/**
 * Products data access + React Query hooks.
 *
 * Public endpoints (no auth):
 *   GET /products?locale=&q=&categoryId=&shopId=&minPrice=&maxPrice=&availability=&sort=&page=&limit=
 *   GET /products/:id?locale=
 *
 * Note: the backend filters by categoryId (UUID), not slug — callers resolve
 * a category slug to its id before calling (see the products page).
 */
import { useQuery } from '@tanstack/react-query';
import { apiRaw, api, type ApiMeta } from '@/lib/api-client';
import { toQueryString } from '@/lib/query';
import type { Product, Locale } from '@/types/domain';

export interface ProductListParams {
  locale: Locale;
  q?: string;
  categoryId?: string;
  shopId?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER';
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export interface ProductListResult {
  items: Product[];
  meta: ApiMeta;
}

export async function fetchProducts(params: ProductListParams): Promise<ProductListResult> {
  const qs = toQueryString({ ...params });
  const res = await apiRaw<Product[]>(`/products?${qs}`, { auth: false });
  return { items: res.data, meta: res.meta ?? { page: 1, limit: res.data.length, total: res.data.length, totalPages: 1 } };
}

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
  });
}

export function fetchProductById(id: string, locale: Locale): Promise<Product> {
  return api<Product>(`/products/${id}?locale=${locale}`, { auth: false });
}

export function useProduct(id: string, locale: Locale) {
  return useQuery({
    queryKey: ['product', id, locale],
    queryFn: () => fetchProductById(id, locale),
    enabled: Boolean(id),
  });
}
