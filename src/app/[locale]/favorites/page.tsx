/**
 * Favorites page (/[locale]/favorites).
 *
 * Shows the products and shops the visitor saved (stored locally). We fetch the
 * public product/shop lists and filter them by the saved IDs, so favorites
 * always reflect current data (price, availability, approval).
 */
'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useFavorites } from '@/stores/favorites-store';
import { useProducts } from '@/features/products/products-api';
import { useShops } from '@/features/shops/shops-api';
import { ProductCard } from '@/components/products/product-card';
import { ShopCard } from '@/components/shops/shop-card';
import { PageHero } from '@/components/layout/page-hero';
import { LoadingState, EmptyState } from '@/components/ui/states';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types/domain';

export default function FavoritesPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations('favorites');
  const [tab, setTab] = useState<'products' | 'shops'>('products');

  // Hydration guard: localStorage favorites are only known on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const favProducts = useFavorites((s) => s.products);
  const favShops = useFavorites((s) => s.shops);

  const { data: products, isLoading: loadingProducts } = useProducts({ locale, limit: 100 });
  const { data: shops, isLoading: loadingShops } = useShops({ locale, limit: 100 });

  const myProducts = products?.items.filter((p) => favProducts.includes(p.id)) ?? [];
  const myShops = shops?.items.filter((s) => favShops.includes(s.id)) ?? [];

  const tabs: { key: 'products' | 'shops'; label: string; count: number }[] = [
    { key: 'products', label: t('productsTab'), count: mounted ? favProducts.length : 0 },
    { key: 'shops', label: t('shopsTab'), count: mounted ? favShops.length : 0 },
  ];

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium',
                tab === tb.key ? 'border-brand bg-brand text-white' : 'border-line bg-white text-muted hover:bg-canvas',
              )}
            >
              {tb.label} <span className="num">({tb.count})</span>
            </button>
          ))}
        </div>

        {!mounted ? (
          <LoadingState />
        ) : tab === 'products' ? (
          loadingProducts ? (
            <LoadingState />
          ) : myProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {myProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyState title={t('emptyProducts')} text={t('localNote')} />
          )
        ) : loadingShops ? (
          <LoadingState />
        ) : myShops.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myShops.map((s) => (
              <ShopCard key={s.id} shop={s} />
            ))}
          </div>
        ) : (
          <EmptyState title={t('emptyShops')} text={t('localNote')} />
        )}
      </div>
    </>
  );
}
