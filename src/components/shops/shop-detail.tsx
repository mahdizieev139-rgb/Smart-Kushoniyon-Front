/**
 * ShopDetail — the public shop page.
 *
 * Loads the shop by its slug, then (once we know the shop id) loads that shop's
 * approved products. Split into two components so the products query only runs
 * after the shop is known.
 */
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Phone, Store, MapPin } from 'lucide-react';
import { useShopBySlug } from '@/features/shops/shops-api';
import { useProducts } from '@/features/products/products-api';
import { ProductCard } from '@/components/products/product-card';
import { LocatorChip } from '@/components/ui/locator-chip';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState, EmptyState, ErrorState, Skeleton } from '@/components/ui/states';
import type { Locale } from '@/types/domain';

export function ShopDetail({ slug }: { slug: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('shopDetails');
  const tc = useTranslations('common');
  const ts = useTranslations('states');
  const tm = useTranslations('map');
  const { data: shop, isLoading, isError, refetch } = useShopBySlug(slug, locale);

  if (isLoading) return <LoadingState label={tc('loading')} />;
  if (isError || !shop) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ErrorState title={ts('errorTitle')} text={ts('errorText')} onRetry={() => refetch()} retryLabel={tc('retry')} />
      </div>
    );
  }

  const name = shop.name ?? shop.slug;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Shop header */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand">
              <Store className="h-6 w-6" aria-hidden />
            </span>
            <h1 className="text-2xl font-bold sm:text-3xl">{name}</h1>
          </div>
          {shop.description ? (
            <p className="mt-4 max-w-2xl text-muted">{shop.description}</p>
          ) : null}
        </div>

        {/* Contact + location card */}
        <Card className="h-fit">
          <CardBody className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-ink">{t('contactTitle')}</h2>
              {shop.phone ? (
                <a
                  href={`tel:${shop.phone}`}
                  className="mt-2 inline-flex items-center gap-2 text-sm text-brand hover:underline"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  <span className="num">{shop.phone}</span>
                </a>
              ) : (
                <p className="mt-2 text-sm text-muted">{t('noPhone')}</p>
              )}
            </div>

            <div className="border-t border-line pt-4">
              <h2 className="text-sm font-semibold text-ink">{t('locationTitle')}</h2>
              <div className="mt-2">
                {shop.gateCode || shop.sectionCode ? (
                  <LocatorChip gate={shop.gateCode} section={shop.sectionCode} />
                ) : (
                  <p className="inline-flex items-center gap-1.5 text-sm text-muted">
                    <MapPin className="h-4 w-4" aria-hidden />
                    {tm('noCoordinates')}
                  </p>
                )}
              </div>
            </div>

            {shop.phone ? (
              <a href={`tel:${shop.phone}`} className="block">
                <Button variant="primary" className="w-full">
                  <Phone className="h-4 w-4" />
                  {t('callShop')}
                </Button>
              </a>
            ) : null}
          </CardBody>
        </Card>
      </div>

      {/* Products */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold">{t('productsTitle')}</h2>
        <ShopProducts shopId={shop.id} locale={locale} />
      </section>
    </div>
  );
}

function ShopProducts({ shopId, locale }: { shopId: string; locale: Locale }) {
  const t = useTranslations('shopDetails');
  const { data, isLoading } = useProducts({ locale, shopId, limit: 12 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return <EmptyState title={t('noProducts')} />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {data.items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
