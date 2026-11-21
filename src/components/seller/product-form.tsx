/**
 * ProductForm — create or edit a product (used inside a Modal).
 *
 * Fields: shop, category, price, availability, and name + description in the
 * three languages (at least Tajik name is required). Optionally attach images,
 * which are uploaded after the product is saved.
 *
 * The backend enforces that the seller owns the chosen shop; this form is just
 * the UI. On success we invalidate the product queries so lists refresh.
 */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { useCategories } from '@/features/categories/categories-api';
import {
  createProduct,
  updateProduct,
  uploadProductImages,
  type ProductTranslationInput,
} from '@/features/products/products-api';
import { ApiError } from '@/lib/api-client';
import { Field, Input, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Locale, Product, Shop } from '@/types/domain';

export function ProductForm({
  product,
  shops,
  onClose,
  onSaved,
}: {
  product?: Product;
  shops: Shop[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations('dash');
  const tp = useTranslations('products');
  const ta = useTranslations('auth');
  const tc = useTranslations('common');
  const qc = useQueryClient();
  const { data: categories } = useCategories(locale);

  const [files, setFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const schema = z.object({
    shopId: z.string().min(1, ta('required')),
    categoryId: z.string().optional(),
    price: z.coerce.number().positive(ta('required')),
    availability: z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'PREORDER']),
    name_tj: z.string().min(1, ta('required')),
    desc_tj: z.string().optional(),
    name_ru: z.string().optional(),
    desc_ru: z.string().optional(),
    name_en: z.string().optional(),
    desc_en: z.string().optional(),
  });
  type FormValues = z.infer<typeof schema>;

  const tr = product?.translations;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      shopId: product?.shopId ?? shops[0]?.id ?? '',
      categoryId: product?.categoryId ?? '',
      price: product ? Number(product.price) : undefined,
      availability: product?.availability ?? 'IN_STOCK',
      name_tj: tr?.tj?.name ?? '',
      desc_tj: tr?.tj?.description ?? '',
      name_ru: tr?.ru?.name ?? '',
      desc_ru: tr?.ru?.description ?? '',
      name_en: tr?.en?.name ?? '',
      desc_en: tr?.en?.description ?? '',
    },
  });

  async function onSubmit(v: FormValues) {
    setFormError(null);

    // Collect only the languages the seller actually filled in.
    const translations: ProductTranslationInput[] = [];
    const add = (l: Locale, name?: string, desc?: string) => {
      if (name && name.trim()) translations.push({ locale: l, name: name.trim(), description: desc?.trim() || undefined });
    };
    add('tj', v.name_tj, v.desc_tj);
    add('ru', v.name_ru, v.desc_ru);
    add('en', v.name_en, v.desc_en);

    try {
      let productId = product?.id;
      if (product) {
        await updateProduct(product.id, {
          categoryId: v.categoryId || undefined,
          price: v.price,
          availability: v.availability,
          translations,
        });
      } else {
        const created = await createProduct({
          shopId: v.shopId,
          categoryId: v.categoryId || undefined,
          price: v.price,
          availability: v.availability,
          translations,
        });
        productId = created.id;
      }

      if (productId && files.length > 0) {
        await uploadProductImages(productId, files);
      }

      await qc.invalidateQueries({ queryKey: ['my-products'] });
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
      {/* Shop (only when creating; editing keeps the same shop) */}
      {!product ? (
        <Field label={t('shopName')} htmlFor="shopId" error={errors.shopId?.message}>
          <Select id="shopId" {...register('shopId')}>
            {shops.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name ?? s.slug}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <Field label={t('price')} htmlFor="price" error={errors.price?.message}>
          <Input id="price" type="number" step="0.01" min="0" {...register('price')} />
        </Field>
        <Field label={t('availability')} htmlFor="availability">
          <Select id="availability" {...register('availability')}>
            <option value="IN_STOCK">{tp('inStock')}</option>
            <option value="OUT_OF_STOCK">{tp('outOfStock')}</option>
            <option value="PREORDER">{tp('onOrder')}</option>
          </Select>
        </Field>
      </div>

      <Field label={t('category')} htmlFor="categoryId">
        <Select id="categoryId" {...register('categoryId')}>
          <option value="">{t('selectCategory')}</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name ?? c.slug}
            </option>
          ))}
        </Select>
      </Field>

      {/* Name + description per language */}
      {languages.map((lang) => (
        <div key={lang.key} className="rounded-xl border border-line p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{lang.label}</p>
          <div className="space-y-2">
            <Field
              label={t('productName')}
              htmlFor={`name_${lang.key}`}
              error={lang.key === 'tj' ? errors.name_tj?.message : undefined}
            >
              <Input id={`name_${lang.key}`} {...register(`name_${lang.key}` as const)} />
            </Field>
            <Input placeholder={t('description')} {...register(`desc_${lang.key}` as const)} />
          </div>
        </div>
      ))}

      {/* Images */}
      <Field label={t('uploadImages')} htmlFor="images">
        <input
          id="images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand"
        />
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
