/**
 * ProductDetail — the public product page.
 *
 * Loads the product by id, then loads its shop (so we can show the seller name
 * and contact). The product API doesn't embed the shop, so we fetch it
 * separately once we know the product's shopId.
 */
'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Phone, Store, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useProduct } from '@/features/products/products-api';
import { useQuery } from '@tanstack/react-query';
import { fetchShopById } from '@/features/shops/shops-api';
import { ProductImage } from '@/components/ui/product-image';
import { FavoriteButton } from '@/components/favorites/favorite-button';
import { AvailabilityBadge } from './availability-badge';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingState, ErrorState } from '@/components/ui/states';
import { formatPrice } from '@/lib/utils';
import type { Locale } from '@/types/domain';

export function ProductDetail({ id }: { id: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('productDetails');
  const tp = useTranslations('products');
  const tc = useTranslations('common');
  const ts = useTranslations('states');

  const { data: product, isLoading, isError, refetch } = useProduct(id, locale);

  // Load the owning shop once we know the product's shopId.
  const { data: shop } = useQuery({
    queryKey: ['shop-by-id', product?.shopId, locale],
    queryFn: () => fetchShopById(product!.shopId, locale),
    enabled: Boolean(product?.shopId),
  });

  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) return <LoadingState label={tc('loading')} />;
  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ErrorState title={ts('errorTitle')} text={ts('errorText')} onRetry={() => refetch()} retryLabel={tc('retry')} />
      </div>
    );
  }

  const name = product.name ?? '—';
  const images = product.images ?? [];
  const mainImage = images[activeImage]?.imageUrl ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link href="/products" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t('backToProducts')}
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <ProductImage
            src={mainImage}
            alt={name}
            label={tp('noImage')}
            className="aspect-square w-full rounded-card border border-line"
          />
          {images.length > 1 ? (
            <div className="mt-3 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border ${
                    i === activeImage ? 'border-brand' : 'border-line'
                  }`}
                  aria-label={`Image ${i + 1}`}
                >
                  <ProductImage src={img.imageUrl} alt={name} className="h-full w-full" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AvailabilityBadge availability={product.availability} />
              {product.status !== 'APPROVED' ? <Badge variant="warning">{product.status}</Badge> : null}
            </div>
            <FavoriteButton type="product" id={product.id} />
          </div>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{name}</h1>
          <p className="num mt-3 text-3xl font-bold text-navy-ink">
            {formatPrice(product.price, product.currency)}
          </p>

          {product.description ? (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-ink">{t('descriptionTitle')}</h2>
              <p className="mt-2 whitespace-pre-line text-muted">{product.description}</p>
            </div>
          ) : null}

          {/* Seller */}
          <Card className="mt-6">
            <CardBody className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand">
                  <Store className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs text-muted">{t('soldBy')}</p>
                  <p className="font-medium text-ink">{shop?.name ?? shop?.slug ?? '—'}</p>
                </div>
              </div>
              {shop ? (
                <Link href={`/shops/${shop.slug}`}>
                  <Button variant="outline" size="sm">
                    {t('viewShop')}
                  </Button>
                </Link>
              ) : null}
            </CardBody>
          </Card>

          {shop?.phone ? (
            <a href={`tel:${shop.phone}`} className="mt-3 block">
              <Button variant="primary" className="w-full">
                <Phone className="h-4 w-4" />
                {t('contactSeller')}
              </Button>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
