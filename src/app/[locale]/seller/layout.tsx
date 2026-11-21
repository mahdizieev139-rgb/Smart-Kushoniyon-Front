/**
 * Seller dashboard layout — guards the /seller/* area and renders the shell.
 *
 * It is a Client Component because it builds the nav (with icon components) and
 * uses the auth guard. SELLER, ADMIN and SUPER_ADMIN may enter (admins can help
 * manage). The backend still enforces per-shop ownership on every write.
 */
'use client';

import { useTranslations } from 'next-intl';
import { LayoutDashboard, Store, Package } from 'lucide-react';
import { RequireAuth } from '@/components/auth/require-auth';
import { DashboardShell, type DashboardNavItem } from '@/components/dashboard/dashboard-shell';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('dash');

  const nav: DashboardNavItem[] = [
    { href: '/seller/dashboard', label: t('overview'), icon: LayoutDashboard },
    { href: '/seller/shops', label: t('myShops'), icon: Store },
    { href: '/seller/products', label: t('myProducts'), icon: Package },
  ];

  return (
    <RequireAuth roles={['SELLER', 'ADMIN', 'SUPER_ADMIN']}>
      <DashboardShell title={t('sellerPanel')} navItems={nav}>
        {children}
      </DashboardShell>
    </RequireAuth>
  );
}
