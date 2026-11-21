/**
 * Admin products page — review all products and approve / reject them.
 */
'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { Package, Check, X } from 'lucide-react';
import { useAdminProducts, approveProduct, rejectProduct } from '@/features/admin/admin-api';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states';
import { formatPrice, cn } from '@/lib/utils';
import type { Locale, ProductStatus } from '@/types/domain';

const FILTERS: (ProductStatus | undefined)[] = [undefined, 'PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED'];

export default function AdminProductsPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations('dash');
  const ts = useTranslations('states');
  const tc = useTranslations('common');
  const qc = useQueryClient();

  const [status, setStatus] = useState<ProductStatus | undefined>('PENDING');
  const { data: products, isLoading, isError, refetch } = useAdminProducts(locale, status);

  async function run(action: () => Promise<unknown>) {
    await action();
    await qc.invalidateQueries({ queryKey: ['admin-products'] });
    await qc.invalidateQueries({ queryKey: ['admin-overview'] });
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold">{t('allProducts')}</h2>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f ?? 'all'}
            onClick={() => setStatus(f)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm font-medium',
              status === f ? 'border-brand bg-brand-50 text-brand' : 'border-line bg-white text-muted hover:bg-canvas',
            )}
          >
            {f ? t(`status${f}` as 'statusPENDING') : tc('all')}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingState label={tc('loading')} />
      ) : isError ? (
        <ErrorState title={ts('errorTitle')} text={ts('errorText')} onRetry={() => refetch()} retryLabel={tc('retry')} />
      ) : !products || products.length === 0 ? (
        <EmptyState title={ts('emptyTitle')} />
      ) : (
        <Card>
          <ul className="divide-y divide-line">
            {products.map((product) => (
              <li key={product.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand">
                    <Package className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{product.name ?? '—'}</p>
                    <p className="num text-xs text-muted">{formatPrice(product.price, product.currency)}</p>
                  </div>
                  <StatusBadge status={product.status} />
                </div>
                <div className="flex items-center gap-2">
                  {product.status !== 'APPROVED' ? (
                    <Button size="sm" variant="primary" onClick={() => run(() => approveProduct(product.id))}>
                      <Check className="h-4 w-4" />
                      {t('approve')}
                    </Button>
                  ) : null}
                  {product.status !== 'REJECTED' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => run(() => rejectProduct(product.id, window.prompt(t('rejectReason')) ?? undefined))}
                    >
                      <X className="h-4 w-4" />
                      {t('reject')}
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
