/**
 * Admin dashboard data hooks + approval mutations (require ADMIN/SUPER_ADMIN).
 *
 *   GET   /admin/analytics          -> market-wide counts
 *   GET   /admin/shops?status=      -> all shops (any status)
 *   GET   /admin/products?status=   -> all products (any status)
 *   PATCH /admin/shops/:id/approve|reject|suspend
 *   PATCH /admin/products/:id/approve|reject
 */
import { useQuery } from '@tanstack/react-query';
import { api, apiRaw } from '@/lib/api-client';
import type { Shop, Product, Locale, ShopStatus, ProductStatus } from '@/types/domain';

export interface AdminOverview {
  shops: { total: number; approved: number; pending: number };
  products: { total: number; approved: number; pending: number };
  sellers: { total: number };
  advertisements: { active: number };
  subscriptions: { active: number };
}

export function useAdminOverview() {
  return useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => api<AdminOverview>('/admin/analytics'),
  });
}

export function useAdminShops(locale: Locale, status?: ShopStatus) {
  return useQuery({
    queryKey: ['admin-shops', locale, status ?? 'all'],
    queryFn: async () =>
      (await apiRaw<Shop[]>(`/admin/shops?locale=${locale}&limit=100${status ? `&status=${status}` : ''}`)).data,
  });
}

export function useAdminProducts(locale: Locale, status?: ProductStatus) {
  return useQuery({
    queryKey: ['admin-products', locale, status ?? 'all'],
    queryFn: async () =>
      (await apiRaw<Product[]>(`/admin/products?locale=${locale}&limit=100${status ? `&status=${status}` : ''}`)).data,
  });
}

// ---- Approval mutations ----
export const approveShop = (id: string) => api<Shop>(`/admin/shops/${id}/approve`, { method: 'PATCH' });
export const rejectShop = (id: string, reason?: string) =>
  api<Shop>(`/admin/shops/${id}/reject`, { method: 'PATCH', body: { reason } });
export const suspendShop = (id: string, reason?: string) =>
  api<Shop>(`/admin/shops/${id}/suspend`, { method: 'PATCH', body: { reason } });

export const approveProduct = (id: string) => api<Product>(`/admin/products/${id}/approve`, { method: 'PATCH' });
export const rejectProduct = (id: string, reason?: string) =>
  api<Product>(`/admin/products/${id}/reject`, { method: 'PATCH', body: { reason } });
