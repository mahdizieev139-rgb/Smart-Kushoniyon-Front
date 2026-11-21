/**
 * Market map data access + hook.
 *
 * GET /market-map?locale= returns the gates of the market, each with its
 * sections. Coordinates may be null until verified data is collected — the UI
 * handles that gracefully (no invented coordinates).
 */
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Locale } from '@/types/domain';

export interface MarketMapSection {
  id: string;
  code: string;
  name?: string;
  description?: string | null;
  latitude: number | null;
  longitude: number | null;
  shopCount: number;
}

export interface MarketMapGate {
  id: string;
  code: string;
  name?: string;
  latitude: number | null;
  longitude: number | null;
  sections: MarketMapSection[];
}

export function fetchMarketMap(locale: Locale): Promise<MarketMapGate[]> {
  return api<MarketMapGate[]>(`/market-map?locale=${locale}`, { auth: false });
}

export function useMarketMap(locale: Locale) {
  return useQuery({
    queryKey: ['market-map', locale],
    queryFn: () => fetchMarketMap(locale),
  });
}
