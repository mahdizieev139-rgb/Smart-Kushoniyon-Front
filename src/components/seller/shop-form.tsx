/**
 * ShopForm — create a shop (used inside a Modal on the seller shops page).
 *
 * A new shop starts as PENDING on the backend and becomes public only after an
 * admin approves it. The seller provides the shop name/description per language
 * and an optional phone number.
 */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { createShop, type ShopTranslationInput } from '@/features/shops/shops-api';
import { ApiError } from '@/lib/api-client';
import { Field, Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/types/domain';

export function ShopForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const t = useTranslations('dash');
  const ta = useTranslations('auth');
  const tc = useTranslations('common');
  const qc = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const schema = z.object({
    name_tj: z.string().min(1, ta('required')),
    desc_tj: z.string().optional(),
    name_ru: z.string().optional(),
    desc_ru: z.string().optional(),
    name_en: z.string().optional(),
    desc_en: z.string().optional(),
    phone: z.string().optional(),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(v: FormValues) {
    setFormError(null);
    const translations: ShopTranslationInput[] = [];
    const add = (l: Locale, name?: string, desc?: string) => {
      if (name && name.trim()) translations.push({ locale: l, name: name.trim(), description: desc?.trim() || undefined });
    };
    add('tj', v.name_tj, v.desc_tj);
    add('ru', v.name_ru, v.desc_ru);
    add('en', v.name_en, v.desc_en);

    try {
      await createShop({ translations, phone: v.phone?.trim() || undefined });
      await qc.invalidateQueries({ queryKey: ['my-shops'] });
      await qc.invalidateQueries({ queryKey: ['seller-overview'] });
      onSaved();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : ta('registerFailed'));
    }
  }

  const languages: { key: 'tj' | 'ru' | 'en'; label: string }[] = [
    { key: 'tj', label: 'Тоҷикӣ' },
    { key: 'ru', label: 'Русский' },
    { key: 'en', label: 'English' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {languages.map((lang) => (
        <div key={lang.key} className="rounded-xl border border-line p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{lang.label}</p>
          <div className="space-y-2">
            <Field
              label={t('shopName')}
              htmlFor={`name_${lang.key}`}
              error={lang.key === 'tj' ? errors.name_tj?.message : undefined}
            >
              <Input id={`name_${lang.key}`} {...register(`name_${lang.key}` as const)} />
            </Field>
            <Input placeholder={t('description')} {...register(`desc_${lang.key}` as const)} />
          </div>
        </div>
      ))}

      <Field label={t('phone')} htmlFor="phone">
        <Input id="phone" type="tel" placeholder="+992…" {...register('phone')} />
      </Field>

      {formError ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p> : null}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          {tc('cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('saving') : tc('save')}
        </Button>
      </div>
    </form>
  );
}
