/**
 * CategoriesStrip — shows real categories fetched from the backend.
 *
 * This is the first place the frontend talks to the live API, so it also
 * demonstrates the loading / empty handling pattern used across the app. Each
 * category links to the products page filtered by that category.
 */
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Boxes } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useCategories } from '@/features/categories/categories-api';
import { Skeleton } from '@/components/ui/states';
import type { Locale } from '@/types/domain';

export function CategoriesStrip() {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');
  const { data, isLoading, isError } = useCategories(locale);

  // Hide the whole section on error — the homepage should still look complete.
  if (isError) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{t('categoriesTitle')}</h2>
        <p className="mt-1 text-sm text-muted">{t('categoriesSubtitle')}</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="hover-lift group flex items-center gap-3 rounded-card border border-line bg-white p-4 shadow-card hover:border-brand"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <Boxes className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-medium text-ink">{category.name ?? category.slug}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
