/**
 * ShopCard — a single shop tile used on the shops page and homepage.
 *
 * Shows the shop name, short description, a phone chip, and (when the market
 * placement is known) the signature LocatorChip. Links to the shop page by slug.
 */
'use client';

import { useTranslations } from 'next-intl';
import { Phone, Store, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { LocatorChip } from '@/components/ui/locator-chip';
import type { Shop } from '@/types/domain';

export function ShopCard({ shop }: { shop: Shop }) {
  const t = useTranslations('shops');
  const name = shop.name ?? shop.slug;

  return (
    <Link
      href={`/shops/${shop.slug}`}
      className="group flex flex-col gap-3 rounded-card border border-line bg-white p-5 shadow-card transition-shadow hover:shadow-pop"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
          <Store className="h-5 w-5" aria-hidden />
        </span>
        <LocatorChip gate={shop.gateCode} section={shop.sectionCode} />
      </div>

      <div>
        <h3 className="font-semibold text-ink group-hover:text-brand">{name}</h3>
        {shop.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted">{shop.description}</p>
        ) : null}
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        {shop.phone ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted">
            <Phone className="h-3.5 w-3.5" aria-hidden />
            <span className="num">{shop.phone}</span>
          </span>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-1 text-sm font-medium text-brand">
          {t('viewShop')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
