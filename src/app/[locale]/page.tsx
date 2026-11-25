/**
 * Homepage (/tj, /ru, /en).
 *
 * Sections: hero with search, live category strip (real API data), and a call
 * to open the interactive market map. Featured shops and popular products are
 * added on top of this foundation in the public-website phase.
 */
import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { Languages, Map as MapIcon, BadgeCheck, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { HeroSearch } from '@/components/home/hero-search';
import { CategoriesStrip } from '@/components/home/categories-strip';
import { FeaturedShops } from '@/components/home/featured-shops';
import { PopularProducts } from '@/components/home/popular-products';
import { WhyKushoniyon } from '@/components/home/why-kushoniyon';
import { SellSteps } from '@/components/home/sell-steps';
import { LocatorChip } from '@/components/ui/locator-chip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const t = useTranslations('home');

  const features = [
    { icon: Languages, label: 'Тоҷикӣ · Русский · English' },
    { icon: MapIcon, label: t('mapTitle') },
    { icon: BadgeCheck, label: t('featuredShopsSubtitle') },
  ];

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-navy">
        {/* Market-plan dot grid (signature texture). */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-70" />
        {/* Soft radial accents for depth (decorative). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage:
              'radial-gradient(60rem 30rem at 15% -10%, #2878D0 0%, transparent 60%), radial-gradient(42rem 26rem at 105% 5%, #E8A33D 0%, transparent 55%)',
          }}
        />
        {/* Fade the texture into the next section. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-navy/0"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <span className="reveal inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden />
              {t('heroEyebrow')}
            </span>
            <h1
              className="reveal mt-5 text-balance text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl"
              style={{ '--d': '60ms' } as CSSProperties}
            >
              {t('heroTitle')}
            </h1>
            <p
              className="reveal mt-4 max-w-xl text-pretty text-base text-white/75 sm:text-lg"
              style={{ '--d': '120ms' } as CSSProperties}
            >
              {t('heroSubtitle')}
            </p>

            <div className="reveal mt-7" style={{ '--d': '180ms' } as CSSProperties}>
              <HeroSearch />
            </div>

            <ul
              className="reveal mt-6 flex flex-wrap gap-x-6 gap-y-2"
              style={{ '--d': '240ms' } as CSSProperties}
            >
              {features.map((f) => (
                <li key={f.label} className="flex items-center gap-2 text-sm text-white/70">
                  <f.icon className="h-4 w-4 text-amber" aria-hidden />
                  {f.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Signature: a sample wayfinding card echoing the physical market. */}
          <div
            className="reveal relative hidden lg:block"
            style={{ '--d': '220ms' } as CSSProperties}
          >
            <div className="absolute -inset-4 rounded-card bg-gradient-to-br from-brand/30 to-amber/20 blur-2xl" aria-hidden />
            <div className="relative rounded-card border border-white/15 bg-white p-5 shadow-pop">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-navy-ink">
                  {t('featuredShopsTitle')}
                </span>
                <Badge variant="demo">DEMO</Badge>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { name: 'Sohibkor Tiles', gate: 'G1', section: 'Row A' },
                  { name: 'Dushanbe Paint', gate: 'G2', section: 'Row C' },
                  { name: 'Pamir Tools', gate: 'G1', section: 'Row B' },
                ].map((shop) => (
                  <div
                    key={shop.name}
                    className="flex items-center justify-between rounded-xl border border-line bg-canvas px-3 py-2.5 transition-colors hover:border-brand/40"
                  >
                    <span className="text-sm font-medium text-ink">{shop.name}</span>
                    <LocatorChip gate={shop.gate} section={shop.section} />
                  </div>
                ))}
              </div>
              <Link href="/map" className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
                {t('openMap')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CATEGORIES (live data) ---------- */}
      <CategoriesStrip />

      {/* ---------- WHY KUSHONIYON (value props) ---------- */}
      <WhyKushoniyon />

      {/* ---------- FEATURED SHOPS (live data) ---------- */}
      <FeaturedShops />

      {/* ---------- POPULAR PRODUCTS (live data) ---------- */}
      <PopularProducts />

      {/* ---------- SELL ON KUSHONIYON ---------- */}
      <SellSteps />

      {/* ---------- MAP CTA ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-navy to-brand-600 p-8 sm:p-10">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber/20 blur-3xl"
          />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">{t('mapTitle')}</h2>
              <p className="mt-2 text-white/75">{t('mapText')}</p>
            </div>
            <Link href="/map">
              <Button variant="amber" size="lg" className="group">
                <MapIcon className="h-5 w-5" />
                {t('openMap')}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
