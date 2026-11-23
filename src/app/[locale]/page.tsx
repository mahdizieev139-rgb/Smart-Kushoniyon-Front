/**
 * Homepage (/tj, /ru, /en).
 *
 * Sections: hero with search, live category strip (real API data), and a call
 * to open the interactive market map. Featured shops and popular products are
 * added on top of this foundation in the public-website phase.
 */
import { useTranslations } from 'next-intl';
import { Languages, Map as MapIcon, BadgeCheck, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { HeroSearch } from '@/components/home/hero-search';
import { CategoriesStrip } from '@/components/home/categories-strip';
import { FeaturedShops } from '@/components/home/featured-shops';
import { PopularProducts } from '@/components/home/popular-products';
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
        {/* Soft radial accents for depth (decorative). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'radial-gradient(60rem 30rem at 20% -10%, #2878D0 0%, transparent 60%), radial-gradient(40rem 24rem at 100% 0%, #E8A33D 0%, transparent 55%)',
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              {t('heroEyebrow')}
            </span>
            <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl">
              {t('heroTitle')}
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base text-white/75 sm:text-lg">
              {t('heroSubtitle')}
            </p>

            <div className="mt-7">
              <HeroSearch />
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {features.map((f) => (
                <li key={f.label} className="flex items-center gap-2 text-sm text-white/70">
                  <f.icon className="h-4 w-4 text-brand" aria-hidden />
                  {f.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Signature: a sample wayfinding card echoing the physical market. */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 rounded-card bg-white/5 blur-2xl" aria-hidden />
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
                    className="flex items-center justify-between rounded-xl border border-line bg-canvas px-3 py-2.5"
                  >
                    <span className="text-sm font-medium text-ink">{shop.name}</span>
                    <LocatorChip gate={shop.gate} section={shop.section} />
                  </div>
                ))}
              </div>
              <Link href="/map" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
                {t('openMap')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CATEGORIES (live data) ---------- */}
      <CategoriesStrip />

      {/* ---------- FEATURED SHOPS (live data) ---------- */}
      <FeaturedShops />

      {/* ---------- POPULAR PRODUCTS (live data) ---------- */}
      <PopularProducts />

      {/* ---------- SELL ON KUSHONIYON ---------- */}
      <SellSteps />

      {/* ---------- MAP CTA ---------- */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <div className="overflow-hidden rounded-card bg-gradient-to-br from-navy to-brand-600 p-8 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">{t('mapTitle')}</h2>
              <p className="mt-2 text-white/75">{t('mapText')}</p>
            </div>
            <Link href="/map">
              <Button variant="amber" size="lg">
                <MapIcon className="h-5 w-5" />
                {t('openMap')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
