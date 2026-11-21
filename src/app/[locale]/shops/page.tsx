/**
 * Shops page (/[locale]/shops) — lists approved shops with search + pagination.
 */
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/layout/page-hero';
import { ShopsBrowser } from '@/components/shops/shops-browser';
import { LoadingState } from '@/components/ui/states';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'shops' });
  return { title: t('title') };
}

export default async function ShopsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'shops' });

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />
      <Suspense fallback={<LoadingState />}>
        <ShopsBrowser />
      </Suspense>
    </>
  );
}
