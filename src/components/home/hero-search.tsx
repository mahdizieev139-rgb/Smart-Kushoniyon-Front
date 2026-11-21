/**
 * HeroSearch — the main search bar in the homepage hero.
 *
 * On submit it navigates to the products page with the query, which is where
 * search results live. Kept as its own small Client Component so the rest of
 * the hero can stay a Server Component.
 */
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export function HeroSearch() {
  const t = useTranslations('home');
  const router = useRouter();
  const [query, setQuery] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : '/products');
  }

  return (
    <form
      onSubmit={submit}
      className="flex w-full max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-pop"
    >
      <div className="flex flex-1 items-center gap-2 pl-2">
        <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('heroSearchPlaceholder')}
          aria-label={t('heroSearchPlaceholder')}
          className="h-10 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </div>
      <Button type="submit" size="md" className="shrink-0">
        {t('searchButton')}
      </Button>
    </form>
  );
}
