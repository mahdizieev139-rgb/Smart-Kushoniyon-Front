/**
 * DashboardShell — the shared chrome for seller and admin dashboards.
 *
 * Layout: a left sidebar with navigation + a top bar (page title, user, log out,
 * link back to the public site). On mobile the sidebar collapses into a drawer.
 *
 * Nav items are passed in by each dashboard so this component stays generic.
 */
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X, LogOut, ArrowLeft, type LucideIcon } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Logo } from '@/components/layout/logo';
import { cn } from '@/lib/utils';

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function DashboardShell({
  title,
  navItems,
  children,
}: {
  title: string;
  navItems: DashboardNavItem[];
  children: React.ReactNode;
}) {
  const t = useTranslations('dash');
  const tnav = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isActive = (href: string) => pathname.startsWith(href);

  async function onLogout() {
    await logout();
    router.replace('/');
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-line px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive(item.href) ? 'bg-brand-50 text-brand' : 'text-ink hover:bg-canvas',
            )}
          >
            <item.icon className="h-4 w-4" aria-hidden />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-line p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-canvas"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('backToSite')}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-canvas">
      <div className="mx-auto flex max-w-[1400px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-line bg-white lg:block">
          {sidebar}
        </aside>

        {/* Mobile drawer */}
        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-navy-ink/40" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-pop">{sidebar}</div>
          </div>
        ) : null}

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-canvas lg:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label="Menu"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <h1 className="truncate text-lg font-bold">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted sm:inline">{user?.name}</span>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink hover:bg-canvas"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">{tnav('logout')}</span>
              </button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
