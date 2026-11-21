/**
 * LanguageSwitcher — lets the user change interface language (tj/ru/en).
 *
 * It keeps the user on the SAME page and just swaps the locale prefix, using
 * next-intl's locale-aware router. The dropdown closes on outside click and on
 * Escape for keyboard users.
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Globe, Check } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, localeNames, type AppLocale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  function change(next: AppLocale) {
    setOpen(false);
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">{localeNames[locale as AppLocale]}</span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-pop"
        >
          {routing.locales.map((l) => (
            <button
              key={l}
              role="menuitemradio"
              aria-checked={l === locale}
              onClick={() => change(l)}
              className={cn(
                'flex w-full items-center justify-between px-3 py-2 text-left text-sm text-ink hover:bg-canvas',
                l === locale && 'font-semibold',
              )}
            >
              {localeNames[l]}
              {l === locale ? <Check className="h-4 w-4 text-brand" aria-hidden /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
