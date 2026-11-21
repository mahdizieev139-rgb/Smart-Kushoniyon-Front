/**
 * Seller overview — KPI tiles + a per-shop product breakdown.
 */
'use client';

import { useTranslations } from 'next-intl';
import { Store, Package, CheckCircle2, Clock } from 'lucide-react';
import { useSellerOverview } from '@/features/seller/seller-api';
import { StatCard } from '@/components/dashboard/stat-card';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Card, CardBody } from '@/components/ui/card';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/states';

export default function SellerDashboardPage() {
  const t = useTranslations('dash');
  const ts = useTranslations('states');
  const tc = useTranslations('common');
  const { data, isLoading, isError, refetch } = useSellerOverview();

  if (isLoading) return <LoadingState label={tc('loading')} />;
  if (isError || !data)
    return <ErrorState title={ts('errorTitle')} text={ts('errorText')} onRetry={() => refetch()} retryLabel={tc('retry')} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t('statShops')} value={data.totals.shops} icon={Store} />
        <StatCard label={t('statProducts')} value={data.totals.products} icon={Package} />
        <StatCard label={t('statApprovedProducts')} value={data.totals.approvedProducts} icon={CheckCircle2} />
        <StatCard label={t('statPendingProducts')} value={data.totals.pendingProducts} icon={Clock} tone="amber" />
      </div>

      {data.shops.length === 0 ? (
        <EmptyState title={t('noShops')} text={t('noShopsHint')} />
      ) : (
        <Card>
          <CardBody className="p-0">
            <ul className="divide-y divide-line">
              {data.shops.map((shop) => (
                <li key={shop.shopId} className="flex items-center justify-between gap-3 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand">
                      <Store className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="font-medium text-ink">{shop.slug}</span>
                    <StatusBadge status={shop.status} />
                  </div>
                  <div className="num text-sm text-muted">
                    {shop.products.total} · <span className="text-emerald-600">{shop.products.approved}</span> ·{' '}
                    <span className="text-amber-700">{shop.products.pending}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
