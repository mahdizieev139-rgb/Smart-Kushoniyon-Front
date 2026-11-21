/**
 * FeaturedShops — a small live preview of shops on the homepage.
 * Hides itself when there are no shops yet, so the homepage always looks whole.
 */
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useShops } from '@/features/shops/shops-api';
import { ShopCard } from '@/components/shops/shop-card';
import { Skeleton } from '@/components/ui/states';
import type { Locale } from '@/types/domain';

export function FeaturedShops() {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');
  const tc = useTranslations('common');
  const { data, isLoading, isError } = useShops({ locale, sort: 'newest', limit: 3 });

  if (isError) return null;
  if (!isLoading && (!data || data.items.length === 0)) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('featuredShopsTitle')}</h2>
          <p className="mt-1 text-sm text-muted">{t('featuredShopsSubtitle')}</p>
        </div>
        <Link href="/shops" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline">
          {tc('viewAll')}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data!.items.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </section>
  );
}
