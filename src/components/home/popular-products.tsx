/**
 * PopularProducts — a live preview of recent products on the homepage.
 * Hides itself when there are no products yet.
 */
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useProducts } from '@/features/products/products-api';
import { ProductCard } from '@/components/products/product-card';
import { Skeleton } from '@/components/ui/states';
import type { Locale } from '@/types/domain';

export function PopularProducts() {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');
  const tc = useTranslations('common');
  const { data, isLoading, isError } = useProducts({ locale, sort: 'newest', limit: 8 });

  if (isError) return null;
  if (!isLoading && (!data || data.items.length === 0)) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{t('popularProductsTitle')}</h2>
            <p className="mt-1 text-sm text-muted">{t('popularProductsSubtitle')}</p>
          </div>
          <Link href="/products" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline">
            {tc('viewAll')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data!.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
