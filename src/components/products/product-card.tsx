/**
 * ProductCard — a single product tile used in grids (homepage, products page,
 * shop page). Shows the photo, name, price (monospaced tabular figures) and an
 * availability badge, and links to the product detail page.
 */
'use client';

import { Link } from '@/i18n/navigation';
import { ProductImage } from '@/components/ui/product-image';
import { AvailabilityBadge } from './availability-badge';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/domain';
import { useTranslations } from 'next-intl';

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations('products');
  const image = product.images?.[0]?.imageUrl ?? null;
  const name = product.name ?? '—';

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition-shadow hover:shadow-pop"
    >
      <ProductImage
        src={image}
        alt={name}
        label={t('noImage')}
        className="aspect-[4/3] w-full"
      />
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
  );
}
