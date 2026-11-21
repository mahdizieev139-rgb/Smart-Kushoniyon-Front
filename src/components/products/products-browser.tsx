/**
 * ProductsBrowser — the interactive products catalog.
 *
 * Responsibilities:
 *   - read initial search (?q=) and category (?category=slug) from the URL
 *   - let the user search, filter by category, filter by price, and sort
 *   - page through results
 *
 * The backend filters products by categoryId (a UUID), but our URLs use the
 * human-friendly category slug, so we resolve the slug to an id using the
 * categories list.
 */
'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useCategories } from '@/features/categories/categories-api';
import { useProducts } from '@/features/products/products-api';
import { ProductCard } from './product-card';
import { SearchInput } from '@/components/ui/search-input';
import { Select } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { LoadingState, EmptyState, ErrorState, Skeleton } from '@/components/ui/states';
import type { Locale } from '@/types/domain';

const PAGE_SIZE = 12;

export function ProductsBrowser() {
  const locale = useLocale() as Locale;
  const t = useTranslations('products');
  const tc = useTranslations('common');
  const ts = useTranslations('states');
  const searchParams = useSearchParams();

  // Initial values from the URL (e.g. coming from the homepage search).
  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [categorySlug, setCategorySlug] = useState(searchParams.get('category') ?? '');
  const [sort, setSort] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);

  const { data: categories } = useCategories(locale);

  // Resolve the category slug (URL/select) to the id the API expects.
  const categoryId = useMemo(
    () => categories?.find((c) => c.slug === categorySlug)?.id,
    [categories, categorySlug],
  );

  const { data, isLoading, isError, refetch } = useProducts({
    locale,
    q: q || undefined,
    categoryId,
    sort,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    page,
    limit: PAGE_SIZE,
  });

  // Any filter change returns to page 1 so results stay consistent.
  function resetToFirstPage<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Filter bar */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SearchInput
          initialValue={q}
          placeholder={t('searchPlaceholder')}
          onDebouncedChange={resetToFirstPage(setQ)}
        />
        <Select
          value={categorySlug}
          onChange={(e) => resetToFirstPage(setCategorySlug)(e.target.value)}
          aria-label={t('filterCategory')}
        >
          <option value="">{tc('all')} · {t('filterCategory')}</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name ?? c.slug}
            </option>
          ))}
        </Select>
        <Select
          value={sort}
          onChange={(e) => resetToFirstPage(setSort)(e.target.value as typeof sort)}
          aria-label={t('sortBy')}
        >
          <option value="newest">{t('sortNewest')}</option>
          <option value="price_asc">{t('sortPriceAsc')}</option>
          <option value="price_desc">{t('sortPriceDesc')}</option>
        </Select>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={minPrice}
            onChange={(e) => resetToFirstPage(setMinPrice)(e.target.value)}
            placeholder={t('minPrice')}
            aria-label={t('minPrice')}
            className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus-visible:border-brand"
          />
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={maxPrice}
            onChange={(e) => resetToFirstPage(setMaxPrice)(e.target.value)}
            placeholder={t('maxPrice')}
            aria-label={t('maxPrice')}
            className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus-visible:border-brand"
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title={ts('errorTitle')}
          text={ts('errorText')}
          onRetry={() => refetch()}
          retryLabel={tc('retry')}
        />
      ) : data && data.items.length > 0 ? (
        <>
          <p className="mb-4 text-sm text-muted">{tc('results', { count: data.meta.total })}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState title={ts('emptyTitle')} text={ts('emptyText')} />
      )}
    </div>
  );
}
