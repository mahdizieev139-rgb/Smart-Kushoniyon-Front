/**
 * MarketPlan — a self-contained, top-down "floor plan" of the bazaar.
 *
 * Unlike the geographic map, this needs no external tiles or GPS coordinates:
 * it draws the market structure directly from the gates -> sections data and
 * places each shop as a "stall" inside its section. This guarantees the user
 * always sees the market layout, even offline or before coordinates exist.
 *
 * Each gate is a block; inside it the section-rows are listed, and inside each
 * row the shops appear as clickable stalls that open the shop page.
 */
'use client';

import { useTranslations } from 'next-intl';
import { DoorOpen, Store } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import type { MarketMapGate } from '@/features/market-map/market-map-api';
import type { Shop } from '@/types/domain';

export function MarketPlan({
  gates,
  shopsBySection,
  query,
}: {
  gates: MarketMapGate[];
  shopsBySection: Map<string, Shop[]>;
  query: string;
}) {
  const t = useTranslations('map');

  const q = query.trim().toLowerCase();
  const matches = (shop: Shop) => !q || (shop.name ?? shop.slug).toLowerCase().includes(q);

  return (
    <div className="overflow-x-auto">
      {/* Gates laid out side by side, like entrances along the bazaar. */}
      <div className="grid min-w-full gap-4 md:grid-cols-2">
        {gates.map((gate) => (
          <section key={gate.id} className="rounded-card border border-line bg-white p-4 shadow-card">
            {/* Gate header */}
            <header className="mb-3 flex items-center gap-2 border-b border-line pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-white">
                <DoorOpen className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="font-display font-bold text-navy-ink">{gate.name ?? gate.code}</p>
                <p className="text-xs uppercase tracking-wide text-muted">{t('aisle')}</p>
              </div>
            </header>

            {/* Section rows */}
            <div className="space-y-3">
              {gate.sections.map((section) => {
                const shops = (shopsBySection.get(section.id) ?? []).filter(matches);
                return (
                  <div key={section.id} className="rounded-xl bg-canvas p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-ink">{section.name ?? section.code}</span>
                      <Badge variant="brand">
                        {section.shopCount} {t('shopsHere')}
                      </Badge>
                    </div>

                    {shops.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {shops.map((shop) => (
                          <Link
                            key={shop.id}
                            href={`/shops/${shop.slug}`}
                            className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-2 text-xs font-medium text-ink transition-colors hover:border-brand hover:text-brand"
                            title={shop.name ?? shop.slug}
                          >
                            <Store className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
                            <span className="truncate">{shop.name ?? shop.slug}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted">{q ? '—' : t('selectHint')}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
