/**
 * Seller dashboard data hooks (require a logged-in SELLER/ADMIN).
 *
 *   GET /seller/dashboard  -> overview stats for the seller's own shops
 *   GET /seller/shops      -> shops the seller is a member of
 *   GET /seller/products   -> products in the seller's shops
 */
import { useQuery } from '@tanstack/react-query';
import { api, apiRaw } from '@/lib/api-client';
import type { Shop, Product, Locale } from '@/types/domain';

export interface SellerShopStat {
  shopId: string;
  slug: string;
  status: string;
  products: { total: number; approved: number; pending: number };
}

export interface SellerOverview {
  shops: SellerShopStat[];
  totals: { shops: number; products: number; approvedProducts: number; pendingProducts: number };
}

export function useSellerOverview() {
  return useQuery({
    queryKey: ['seller-overview'],
    queryFn: () => api<SellerOverview>('/seller/dashboard'),
  });
}

export function useMyShops(locale: Locale) {
  return useQuery({
    queryKey: ['my-shops', locale],
    queryFn: async () => (await apiRaw<Shop[]>(`/seller/shops?locale=${locale}&limit=100`)).data,
  });
}

export function useMyProducts(locale: Locale) {
  return useQuery({
    queryKey: ['my-products', locale],
    queryFn: async () => (await apiRaw<Product[]>(`/seller/products?locale=${locale}&limit=100`)).data,
  });
}
