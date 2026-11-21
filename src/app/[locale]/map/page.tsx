/**
 * Market map page (/[locale]/map).
 */
import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/layout/page-hero';
import { MarketMapView } from '@/components/map/market-map-view';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'map' });
  return { title: t('title') };
}

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'map' });

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />
      <MarketMapView />
    </>
  );
}
