/**
 * Admin shops page — review all shops and approve / reject / suspend them.
 *
 * A status filter narrows the list (Pending is the common review queue). Each
 * action calls the backend and then refreshes the list and the overview counts.
 */
'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { Store, Check, X, Ban } from 'lucide-react';
import {
  useAdminShops,
  approveShop,
  rejectShop,
  suspendShop,
} from '@/features/admin/admin-api';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states';
import { cn } from '@/lib/utils';
import type { Locale, ShopStatus } from '@/types/domain';

const FILTERS: (ShopStatus | undefined)[] = [undefined, 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'];

export default function AdminShopsPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations('dash');
  const ts = useTranslations('states');
  const tc = useTranslations('common');
  const qc = useQueryClient();

  const [status, setStatus] = useState<ShopStatus | undefined>('PENDING');
  const { data: shops, isLoading, isError, refetch } = useAdminShops(locale, status);

  async function run(action: () => Promise<unknown>) {
    await action();
    await qc.invalidateQueries({ queryKey: ['admin-shops'] });
    await qc.invalidateQueries({ queryKey: ['admin-overview'] });
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold">{t('allShops')}</h2>

      {/* Status filter */}
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
      ) : !shops || shops.length === 0 ? (
        <EmptyState title={ts('emptyTitle')} />
      ) : (
        <Card>
          <ul className="divide-y divide-line">
            {shops.map((shop) => (
              <li key={shop.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand">
                    <Store className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{shop.name ?? shop.slug}</p>
                    <p className="num truncate text-xs text-muted">{shop.phone ?? '—'}</p>
                  </div>
                  <StatusBadge status={shop.status} />
                </div>
                <div className="flex items-center gap-2">
                  {shop.status !== 'APPROVED' ? (
                    <Button size="sm" variant="primary" onClick={() => run(() => approveShop(shop.id))}>
                      <Check className="h-4 w-4" />
                      {t('approve')}
                    </Button>
                  ) : null}
                  {shop.status !== 'REJECTED' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => run(() => rejectShop(shop.id, window.prompt(t('rejectReason')) ?? undefined))}
                    >
                      <X className="h-4 w-4" />
                      {t('reject')}
                    </Button>
                  ) : null}
                  {shop.status === 'APPROVED' ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => run(() => suspendShop(shop.id, window.prompt(t('rejectReason')) ?? undefined))}
                    >
                      <Ban className="h-4 w-4" />
                      {t('suspend')}
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
