/**
 * Products page (/[locale]/products).
 *
 * A Server Component that renders the page header, then the interactive
 * ProductsBrowser. ProductsBrowser reads the URL query (?q=, ?category=),
 * so it must be inside a <Suspense> boundary.
 */
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/layout/page-hero';
import { ProductsBrowser } from '@/components/products/products-browser';
import { LoadingState } from '@/components/ui/states';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });
  return { title: t('title') };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />
      <Suspense fallback={<LoadingState />}>
        <ProductsBrowser />
      </Suspense>
    </>
  );
}
