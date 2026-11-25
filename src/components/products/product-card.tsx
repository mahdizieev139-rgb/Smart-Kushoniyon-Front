/**
 * ProductCard — a single product tile used in grids.
 *
 * Shows the photo, name, price (monospaced tabular figures), an availability
 * badge, and a favorite heart. Links to the product detail page.
 *
 * IMPORTANT: the favorite button is a SIBLING of the <Link>, not a child — a
 * <button> inside an <a> is invalid HTML and causes a hydration error.
 */
'use client';

import { Link } from '@/i18n/navigation';
import { ProductImage } from '@/components/ui/product-image';
import { FavoriteButton } from '@/components/favorites/favorite-button';
import { AvailabilityBadge } from './availability-badge';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/domain';
import { useTranslations } from 'next-intl';

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations('products');
  const image = product.images?.[0]?.imageUrl ?? null;
  const name = product.name ?? '—';

  return (
    <div className="hover-lift group relative overflow-hidden rounded-card border border-line bg-white shadow-card hover:border-brand/40">
      <Link href={`/products/${product.id}`} className="flex h-full flex-col">
        <div className="aspect-[4/3] w-full overflow-hidden">
          <ProductImage
            src={image}
            alt={name}
            label={t('noImage')}
            className="h-full w-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 text-sm font-medium text-ink group-hover:text-brand">{name}</h3>
          <div className="mt-auto flex items-center justify-between gap-2">
            <span className="num text-base font-semibold text-navy-ink">
              {formatPrice(product.price, product.currency)}
            </span>
            <AvailabilityBadge availability={product.availability} />
          </div>
        </div>
      </Link>
      <FavoriteButton type="product" id={product.id} className="absolute right-2 top-2 z-10 shadow-card" />
    </div>
  );
}
