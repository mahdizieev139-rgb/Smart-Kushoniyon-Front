/**
 * SiteHeader — the top navigation bar shown on every page.
 *
 * Left: logo. Center: main navigation. Right: language switcher + auth actions.
 * On small screens the navigation collapses into a toggle menu.
 *
 * It is a Client Component because it reads auth state (to show Dashboard/Log
 * out vs Log in/Sign up) and manages the mobile menu open/close state.
 */
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X, LogOut, LayoutDashboard, Heart } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { dashboardPath } from '@/lib/roles';
import { Logo } from './logo';
import { LanguageSwitcher } from './language-switcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const logout = useAuthStore((s) => s.logout);

  const links = [
    { href: '/', label: t('home') },
    { href: '/shops', label: t('shops') },
    { href: '/products', label: t('products') },
    { href: '/map', label: t('map') },
    { href: '/calculator', label: t('calculator') },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/90 backdrop-blur supports-[backdrop-filter]:bg-navy/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="shrink-0 rounded-lg bg-white px-2.5 py-1.5">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white',
                isActive(link.href) && 'bg-white/10 text-white',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/favorites"
            aria-label={t('favorites')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/90 hover:bg-white/10"
          >
            <Heart className="h-5 w-5" aria-hidden />
          </Link>
          <LanguageSwitcher />

          <div className="hidden items-center gap-2 md:flex">
            {status === 'authenticated' && user ? (
              <>
                {user.role !== 'CUSTOMER' ? (
                  <Link href={dashboardPath(user.role)}>
                    <Button variant="amber" size="sm">
                      <LayoutDashboard className="h-4 w-4" />
                      {t('dashboard')}
                    </Button>
                  </Link>
                ) : null}
                <Button variant="ghost" size="sm" onClick={() => logout()} className="text-white hover:bg-white/10">
                  <LogOut className="h-4 w-4" />
                  {t('logout')}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    {t('login')}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    {t('register')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen ? (
        <div className="border-t border-white/10 bg-navy md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10',
                  isActive(link.href) && 'bg-white/10 text-white',
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
              {status === 'authenticated' && user ? (
                <>
                  {user.role !== 'CUSTOMER' ? (
                    <Link href={dashboardPath(user.role)} onClick={() => setMenuOpen(false)}>
                      <Button variant="amber" className="w-full">
                        {t('dashboard')}
                      </Button>
                    </Link>
                  ) : null}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setMenuOpen(false);
                      void logout();
                    }}
                  >
                    {t('logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      {t('login')}
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)}>
                    <Button variant="primary" className="w-full">
                      {t('register')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
