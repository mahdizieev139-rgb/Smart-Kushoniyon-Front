/**
 * Favorites store (Zustand + localStorage persistence).
 *
 * Favorites are kept LOCALLY in the browser. Every visitor (guest or logged-in)
 * has their own list on their own device, so no one can see another person's
 * favorites. When the backend adds a favorites API, we can sync this store with
 * it (see docs/backend-requirements.md) — the UI stays the same.
 *
 * We store only IDs here; the favorites page fetches the actual product/shop
 * data from the API using these IDs.
 */
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  products: string[];
  shops: string[];
  toggleProduct: (id: string) => void;
  toggleShop: (id: string) => void;
  clear: () => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set) => ({
      products: [],
      shops: [],
      toggleProduct: (id) =>
        set((s) => ({
          products: s.products.includes(id)
            ? s.products.filter((x) => x !== id)
            : [...s.products, id],
        })),
      toggleShop: (id) =>
        set((s) => ({
          shops: s.shops.includes(id) ? s.shops.filter((x) => x !== id) : [...s.shops, id],
        })),
      clear: () => set({ products: [], shops: [] }),
    }),
    { name: 'kushoniyon-favorites' }, // localStorage key
  ),
);
