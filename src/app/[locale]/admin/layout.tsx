/**
 * Admin dashboard layout — guards /admin/* and renders the shell.
 * Only ADMIN and SUPER_ADMIN may enter. The backend enforces the same.
 */
'use client';

import { useTranslations } from 'next-intl';
import { LayoutDashboard, Store, Package } from 'lucide-react';
import { RequireAuth } from '@/components/auth/require-auth';
import { DashboardShell, type DashboardNavItem } from '@/components/dashboard/dashboard-shell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('dash');

  const nav: DashboardNavItem[] = [
    { href: '/admin/dashboard', label: t('overview'), icon: LayoutDashboard },
    { href: '/admin/shops', label: t('allShops'), icon: Store },
    { href: '/admin/products', label: t('allProducts'), icon: Package },
  ];

  return (
    <RequireAuth roles={['ADMIN', 'SUPER_ADMIN']}>
      <DashboardShell title={t('adminPanel')} navItems={nav}>
        {children}
      </DashboardShell>
    </RequireAuth>
  );
}
