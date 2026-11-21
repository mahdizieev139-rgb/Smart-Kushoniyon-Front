/**
 * ShopsBrowser — the interactive shops list: search, sort, and pagination.
 */
'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useShops } from '@/features/shops/shops-api';
import { ShopCard } from './shop-card';
import { SearchInput } from '@/components/ui/search-input';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/states';
import type { Locale } from '@/types/domain';

const PAGE_SIZE = 12;

export function ShopsBrowser() {
  const locale = useLocale() as Locale;
  const t = useTranslations('shops');
  const tc = useTranslations('common');
  const ts = useTranslations('states');
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useShops({
    locale,
    q: q || undefined,
    sort: 'newest',
    page,
    limit: PAGE_SIZE,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 max-w-xl">
        <SearchInput
          initialValue={q}
          placeholder={t('searchPlaceholder')}
          onDebouncedChange={(v) => {
            setQ(v);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState title={ts('errorTitle')} text={ts('errorText')} onRetry={() => refetch()} retryLabel={tc('retry')} />
      ) : data && data.items.length > 0 ? (
        <>
          <p className="mb-4 text-sm text-muted">{tc('results', { count: data.meta.total })}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
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
