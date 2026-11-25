/**
 * MarketPlan — a self-contained, top-down "blueprint" of the bazaar.
 *
 * Unlike the geographic map, this needs no external tiles or GPS coordinates:
 * it draws the market structure directly from the gates -> sections data and
 * places each shop as a "stall" inside its section. This guarantees the user
 * always sees the market layout, even offline or before coordinates exist.
 *
 * Visual language: a dark architectural board (navy-ink + dot grid). Each gate
 * is an entrance panel; inside it the section-rows are lanes labelled with the
 * market's wayfinding codes (Gate·Row); inside each lane the shops are stall
 * tiles that light up on hover. Real shops link to their page; demo stalls are
 * static (no fabricated shop pages).
 */
'use client';

import { useTranslations } from 'next-intl';
import { DoorOpen, Store, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { MarketMapGate } from '@/features/market-map/market-map-api';
import { cn } from '@/lib/utils';

/** Minimal stall shape satisfied by both a real Shop and a DemoStall. */
interface Stall {
  id: string;
  name?: string | null;
  slug?: string;
}

export function MarketPlan({
  gates,
  shopsBySection,
  query,
}: {
  gates: MarketMapGate[];
  shopsBySection: Map<string, Stall[]>;
  query: string;
}) {
  const t = useTranslations('map');

  const q = query.trim().toLowerCase();
  const stallName = (s: Stall) => s.name ?? s.slug ?? '';
  const matches = (s: Stall) => !q || stallName(s).toLowerCase().includes(q);

  const sectionCount = gates.reduce((n, g) => n + g.sections.length, 0);
  const shopTotal = gates.reduce(
    (n, g) => n + g.sections.reduce((m, s) => m + s.shopCount, 0),
    0,
  );

  const stats = [
    { label: t('gates'), value: gates.length },
    { label: t('sections'), value: sectionCount },
    { label: t('shops'), value: shopTotal },
  ];

  return (
    <div className="relative overflow-hidden rounded-card border border-white/10 bg-navy-ink shadow-pop">
      {/* Blueprint textures */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-amber/10 blur-3xl"
      />

      {/* Board header: title + live stats */}
      <div className="relative flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-2 text-white">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <MapPin className="h-4 w-4 text-amber" aria-hidden />
          </span>
          <span className="font-display text-lg font-bold">{t('title')}</span>
        </div>
        <div className="flex gap-6">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="num text-2xl font-extrabold leading-none text-white">{s.value}</div>
              <div className="mt-1 text-xs text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gates laid out like entrances around the bazaar. */}
      <div className="relative grid gap-4 p-4 sm:p-6 lg:grid-cols-2">
        {gates.map((gate) => (
          <section
            key={gate.id}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm"
          >
            {/* Gate header */}
            <header className="mb-3 flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-amber text-navy-ink">
                <DoorOpen className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate font-display font-bold text-white">
                  {gate.name ?? gate.code}
                </p>
                <p className="num text-xs uppercase tracking-wide text-amber/90">{gate.code}</p>
              </div>
            </header>

            {/* Section lanes */}
            <div className="space-y-3">
              {gate.sections.map((section) => {
                const stalls = (shopsBySection.get(section.id) ?? []).filter(matches);
                return (
                  <div key={section.id} className="rounded-lg bg-white/[0.03] p-3 ring-1 ring-white/5">
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="num inline-flex items-center rounded-md bg-brand px-1.5 py-0.5 text-[11px] font-bold text-white">
                          {section.code}
                        </span>
                        <span className="text-sm font-semibold text-white/90">
                          {section.name ?? section.code}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs text-white/50">
                        {section.shopCount} {t('shopsHere')}
                      </span>
                    </div>

                    {stalls.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {stalls.map((stall) => {
                          const label = stallName(stall);
                          const className = cn(
                            'group flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-2 text-xs font-medium text-white/90 transition-all',
                            'hover:-translate-y-0.5 hover:border-amber/60 hover:bg-amber/15 hover:text-white',
                          );
                          const inner = (
                            <>
                              <Store
                                className="h-3.5 w-3.5 shrink-0 text-brand transition-colors group-hover:text-amber"
                                aria-hidden
                              />
                              <span className="truncate">{label}</span>
                            </>
                          );
                          return stall.slug ? (
                            <Link
                              key={stall.id}
                              href={`/shops/${stall.slug}`}
                              className={className}
                              title={label}
                            >
                              {inner}
                            </Link>
                          ) : (
                            <div key={stall.id} className={className} title={label}>
                              {inner}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-white/40">{q ? '—' : t('selectHint')}</p>
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
