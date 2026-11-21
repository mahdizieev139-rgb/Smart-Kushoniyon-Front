/**
 * Register page (/[locale]/register).
 *
 * Customers and sellers can self-register (admins are created by a super admin).
 * The account type is chosen with two selectable cards. On success the user is
 * routed to their dashboard (sellers) or the homepage (customers).
 */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { ShoppingBag, Store } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { dashboardPath } from '@/lib/roles';
import { ApiError } from '@/lib/api-client';
import { AuthShell } from '@/components/auth/auth-shell';
import { Field, Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const registerUser = useAuthStore((s) => s.register);
  const [formError, setFormError] = useState<string | null>(null);

  const schema = z.object({
    name: z.string().min(2, t('nameMin')),
    email: z.string().email(t('invalidEmail')),
    password: z.string().min(8, t('passwordMin')),
    role: z.enum(['CUSTOMER', 'SELLER']),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'SELLER' },
  });

  const role = watch('role');

  async function onSubmit(values: FormValues) {
    setFormError(null);
    try {
      const user = await registerUser(values);
      router.push(user.role === 'CUSTOMER' ? '/' : dashboardPath(user.role));
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : t('registerFailed'));
    }
  }

  const roleOptions = [
    { value: 'SELLER' as const, label: t('asSeller'), icon: Store },
    { value: 'CUSTOMER' as const, label: t('asCustomer'), icon: ShoppingBag },
  ];

  return (
    <AuthShell title={t('registerTitle')} subtitle={t('registerSubtitle')}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Account type */}
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink">{t('accountType')}</span>
          <div className="grid grid-cols-2 gap-3">
            {roleOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('role', opt.value, { shouldValidate: true })}
                className={cn(
                  'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors',
                  role === opt.value
                    ? 'border-brand bg-brand-50 text-brand'
                    : 'border-line bg-white text-ink hover:bg-canvas',
                )}
                aria-pressed={role === opt.value}
              >
                <opt.icon className="h-4 w-4" aria-hidden />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Field label={t('name')} htmlFor="name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" {...register('name')} />
        </Field>
        <Field label={t('email')} htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
        </Field>
        <Field label={t('password')} htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
        </Field>

        {formError ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t('submitting') : t('registerButton')}
        </Button>

        <p className="text-center text-sm text-muted">
          {t('haveAccount')}{' '}
          <Link href="/login" className="font-medium text-brand hover:underline">
            {t('loginButton')}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
