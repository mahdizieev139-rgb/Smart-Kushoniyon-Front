/**
 * Categories data access + React Query hook.
 *
 * The backend resolves translated fields to a flat `name` based on the
 * `?locale=` query param, so we always pass the active locale.
 */
import { useQuery } from '@tanstack/react-query';
import { apiRaw } from '@/lib/api-client';
import type { Category, Locale } from '@/types/domain';

export async function fetchCategories(locale: Locale, limit = 50): Promise<Category[]> {
  const res = await apiRaw<Category[]>(
    `/categories?locale=${locale}&limit=${limit}`,
    { auth: false },
  );
  return res.data;
}

/** React Query hook for the public category list. */
export function useCategories(locale: Locale) {
  return useQuery({
    queryKey: ['categories', locale],
    queryFn: () => fetchCategories(locale),
  });
}
