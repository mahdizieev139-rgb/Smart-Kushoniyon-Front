/**
 * Shops data access + React Query hooks.
 *
 * Public endpoints (no auth):
 *   GET /shops?locale=&q=&sort=&sectionId=&categoryId=&page=&limit=
 *   GET /shops/slug/:slug?locale=
 */
import { useQuery } from '@tanstack/react-query';
import { apiRaw, api, type ApiMeta } from '@/lib/api-client';
import { toQueryString } from '@/lib/query';
import type { Shop, Locale } from '@/types/domain';

export interface ShopListParams {
  locale: Locale;
  q?: string;
  sort?: 'newest' | 'oldest' | 'name';
  sectionId?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface ShopListResult {
  items: Shop[];
  meta: ApiMeta;
}

export async function fetchShops(params: ShopListParams): Promise<ShopListResult> {
  const qs = toQueryString({ ...params });
  const res = await apiRaw<Shop[]>(`/shops?${qs}`, { auth: false });
  return { items: res.data, meta: res.meta ?? { page: 1, limit: res.data.length, total: res.data.length, totalPages: 1 } };
}

export function useShops(params: ShopListParams) {
  return useQuery({
    queryKey: ['shops', params],
    queryFn: () => fetchShops(params),
  });
}

export function fetchShopBySlug(slug: string, locale: Locale): Promise<Shop> {
  return api<Shop>(`/shops/slug/${encodeURIComponent(slug)}?locale=${locale}`, { auth: false });
}

export function useShopBySlug(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ['shop', slug, locale],
    queryFn: () => fetchShopBySlug(slug, locale),
    enabled: Boolean(slug),
  });
}

export function fetchShopById(id: string, locale: Locale): Promise<Shop> {
  return api<Shop>(`/shops/${id}?locale=${locale}`, { auth: false });
}

// ---- Seller mutations (require auth) ----

export interface ShopTranslationInput {
  locale: Locale;
  name: string;
  description?: string;
}

export interface CreateShopPayload {
  translations: ShopTranslationInput[];
  phone?: string;
  sectionId?: string;
}

export function createShop(payload: CreateShopPayload): Promise<Shop> {
  return api<Shop>('/shops', { method: 'POST', body: payload });
}

export function updateShop(id: string, payload: Partial<CreateShopPayload>): Promise<Shop> {
  return api<Shop>(`/shops/${id}`, { method: 'PATCH', body: payload });
}
