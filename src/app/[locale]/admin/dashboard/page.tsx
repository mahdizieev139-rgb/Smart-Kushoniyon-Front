/**
 * Admin overview — market-wide KPI tiles from GET /admin/analytics.
 */
'use client';

import { useTranslations } from 'next-intl';
import { Store, Package, Users, Clock, Megaphone, CreditCard } from 'lucide-react';
import { useAdminOverview } from '@/features/admin/admin-api';
import { StatCard } from '@/components/dashboard/stat-card';
import { LoadingState, ErrorState } from '@/components/ui/states';

export default function AdminDashboardPage() {
  const t = useTranslations('dash');
  const ts = useTranslations('states');
  const tc = useTranslations('common');
  const { data, isLoading, isError, refetch } = useAdminOverview();

  if (isLoading) return <LoadingState label={tc('loading')} />;
  if (isError || !data)
    return <ErrorState title={ts('errorTitle')} text={ts('errorText')} onRetry={() => refetch()} retryLabel={tc('retry')} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label={t('statShops')} value={data.shops.total} icon={Store} />
        <StatCard label={t('statPendingShops')} value={data.shops.pending} icon={Clock} tone="amber" />
        <StatCard label={t('statProducts')} value={data.products.total} icon={Package} />
        <StatCard label={t('statPendingProducts')} value={data.products.pending} icon={Clock} tone="amber" />
        <StatCard label={t('statSellers')} value={data.sellers.total} icon={Users} />
        <StatCard label={t('statActiveAds')} value={data.advertisements.active} icon={Megaphone} tone="muted" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label={t('statApprovedShops')} value={data.shops.approved} icon={Store} />
        <StatCard label={t('statApprovedProducts')} value={data.products.approved} icon={Package} />
        <StatCard label={t('statActiveSubs')} value={data.subscriptions.active} icon={CreditCard} tone="muted" />
      </div>
    </div>
  );
}
