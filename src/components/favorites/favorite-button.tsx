/**
 * FavoriteButton — a heart toggle for a product or shop.
 *
 * Used on cards (inside a Link) and on detail pages. Because it often sits
 * inside a clickable card, we stop the click from also triggering the card's
 * navigation.
 *
 * Note on hydration: the favorite state comes from localStorage, which is only
 * available in the browser. We render the "not favorite" look during SSR and
 * the first client render, then reflect the real state after mount, to avoid a
 * hydration mismatch warning.
 */
'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/stores/favorites-store';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  type: 'product' | 'shop';
  id: string;
  className?: string;
  label?: string; // accessible label (translated by caller)
}

export function FavoriteButton({ type, id, className, label }: FavoriteButtonProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isFav = useFavorites((s) => (type === 'product' ? s.products : s.shops).includes(id));
  const toggleProduct = useFavorites((s) => s.toggleProduct);
  const toggleShop = useFavorites((s) => s.toggleShop);

  const active = mounted && isFav;

  function onClick(e: React.MouseEvent) {
    // Don't let the card's <Link> navigate when the heart is clicked.
    e.preventDefault();
    e.stopPropagation();
    if (type === 'product') toggleProduct(id);
    else toggleShop(id);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label ?? 'Favorite'}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/90 text-muted transition-colors hover:text-red-500',
        className,
      )}
    >
      <Heart className={cn('h-4 w-4', active && 'fill-red-500 text-red-500')} />
    </button>
  );
}
