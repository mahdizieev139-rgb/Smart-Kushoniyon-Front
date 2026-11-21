/**
 * Login page (/[locale]/login).
 *
 * Uses React Hook Form + Zod for validation. The single "email or phone" field
 * is split into the right payload key before calling the auth store. On success
 * the user is sent to their dashboard (sellers/admins) or the homepage.
 */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { dashboardPath } from '@/lib/roles';
import { ApiError } from '@/lib/api-client';
import { AuthShell } from '@/components/auth/auth-shell';
import { Field, Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [formError, setFormError] = useState<string | null>(null);

  const schema = z.object({
    identifier: z.string().min(1, t('required')),
    password: z.string().min(1, t('required')),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    // Decide whether the identifier is an email or a phone number.
    const isEmail = values.identifier.includes('@');
    const payload = isEmail
      ? { email: values.identifier, password: values.password }
      : { phone: values.identifier, password: values.password };

    try {
      const user = await login(payload);
      router.push(user.role === 'CUSTOMER' ? '/' : dashboardPath(user.role));
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : t('loginFailed'));
    }
  }

  return (
    <AuthShell title={t('loginTitle')} subtitle={t('loginSubtitle')}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field label={t('emailOrPhone')} htmlFor="identifier" error={errors.identifier?.message}>
          <Input id="identifier" autoComplete="username" {...register('identifier')} />
        </Field>
        <Field label={t('password')} htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
        </Field>

        {formError ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t('submitting') : t('loginButton')}
        </Button>

        <p className="text-center text-sm text-muted">
          {t('noAccount')}{' '}
          <Link href="/register" className="font-medium text-brand hover:underline">
            {t('registerButton')}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
