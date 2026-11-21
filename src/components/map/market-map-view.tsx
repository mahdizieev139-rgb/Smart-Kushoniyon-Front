/**
 * MarketMapView — the interactive market map.
 *
 * Design notes:
 *  - MapLibre GL is loaded only in the browser (dynamic import inside an
 *    effect) because it touches `window`.
 *  - We use free OpenStreetMap raster tiles so no API key is required.
 *  - The map centers on Dushanbe city (public location). We do NOT invent the
 *    market's internal coordinates: markers appear only for gates/sections that
 *    actually have verified coordinates. Everything else is listed in the side
 *    panel with a clear "location not set" note. All data here is DEMO.
 *
 * The side panel lets customers search shops and browse gates → sections.
 * Selecting a section that has coordinates flies the map to it.
 */
'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Store, DoorOpen, Search, MapPin } from 'lucide-react';
import type { Map as MapLibreMap, Marker } from 'maplibre-gl';
import { useMarketMap, type MarketMapSection } from '@/features/market-map/market-map-api';
import { useShops } from '@/features/shops/shops-api';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/ui/states';
import type { Locale } from '@/types/domain';

// Dushanbe city center — a public, well-known location (not the market's
// internal layout, which we never fabricate).
const DUSHANBE: [number, number] = [68.787, 38.5598];

export function MarketMapView() {
  const locale = useLocale() as Locale;
  const t = useTranslations('map');
  const tc = useTranslations('common');

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [shopQuery, setShopQuery] = useState('');

  const { data: gates, isLoading } = useMarketMap(locale);
  const { data: shopsData } = useShops({ locale, q: shopQuery || undefined, limit: 20 });

  // 1) Initialize the map once.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!containerRef.current || mapRef.current) return;
      const maplibregl = await import('maplibre-gl');
      if (cancelled || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
            },
          },
          layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
        },
        center: DUSHANBE,
        zoom: 12,
      });
      map.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.on('load', () => !cancelled && setMapReady(true));
      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // 2) Add markers for sections that have real coordinates.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !gates) return;

    (async () => {
      const maplibregl = await import('maplibre-gl');

      // Clear previous markers.
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const located = gates
        .flatMap((g) => g.sections)
        .filter((s) => s.latitude != null && s.longitude != null);

      located.forEach((section) => {
        const marker = new maplibregl.Marker({ color: '#163A63' })
          .setLngLat([section.longitude!, section.latitude!])
          .setPopup(
            new maplibregl.Popup({ offset: 24 }).setHTML(
              `<strong>${section.name ?? section.code}</strong><br/>${section.shopCount} • ${section.code}`,
            ),
          )
          .addTo(map);
        markersRef.current.push(marker);
      });

      // Fit to markers if we have any; otherwise stay on the city view.
      if (located.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        located.forEach((s) => bounds.extend([s.longitude!, s.latitude!]));
        map.fitBounds(bounds, { padding: 60, maxZoom: 17 });
      }
    })();
  }, [gates, mapReady]);

  function flyToSection(section: MarketMapSection) {
    const map = mapRef.current;
    if (map && section.latitude != null && section.longitude != null) {
      map.flyTo({ center: [section.longitude, section.latitude], zoom: 18 });
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* DEMO notice */}
      <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber/40 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>{t('demoNotice')}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Map */}
        <div className="relative h-[60vh] min-h-[380px] overflow-hidden rounded-card border border-line bg-white">
          <div ref={containerRef} className="absolute inset-0" />
          {!mapReady ? (
            <div className="absolute inset-0 grid place-items-center bg-canvas/60">
              <LoadingState label={tc('loading')} />
            </div>
          ) : null}
        </div>

        {/* Side panel */}
        <aside className="flex max-h-[60vh] flex-col overflow-hidden rounded-card border border-line bg-white">
          {/* Shop search */}
          <div className="border-b border-line p-3">
            <div className="flex h-10 items-center gap-2 rounded-lg border border-line px-3">
              <Search className="h-4 w-4 text-muted" aria-hidden />
              <input
                value={shopQuery}
                onChange={(e) => setShopQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                aria-label={t('searchPlaceholder')}
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted/70"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Shop results (when searching) */}
            {shopQuery && shopsData ? (
              <ul className="divide-y divide-line">
                {shopsData.items.map((shop) => (
                  <li key={shop.id}>
                    <Link
                      href={`/shops/${shop.slug}`}
                      className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-canvas"
                    >
                      <Store className="h-4 w-4 text-brand" aria-hidden />
                      <span className="font-medium">{shop.name ?? shop.slug}</span>
                    </Link>
                  </li>
                ))}
                {shopsData.items.length === 0 ? (
                  <li className="px-4 py-6 text-center text-sm text-muted">{t('selectHint')}</li>
                ) : null}
              </ul>
            ) : isLoading ? (
              <LoadingState />
            ) : (
              /* Gates → sections tree */
              <div className="p-3">
                {gates?.map((gate) => (
                  <div key={gate.id} className="mb-4 last:mb-0">
                    <div className="mb-1.5 flex items-center gap-2 px-1 text-sm font-semibold text-navy-ink">
                      <DoorOpen className="h-4 w-4 text-brand" aria-hidden />
                      {gate.name ?? gate.code}
                    </div>
                    <ul className="space-y-1">
                      {gate.sections.map((section) => (
                        <li key={section.id}>
                          <button
                            onClick={() => flyToSection(section)}
                            disabled={section.latitude == null}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-canvas disabled:cursor-default"
                          >
                            <span className="text-ink">{section.name ?? section.code}</span>
                            <Badge variant="neutral">{section.shopCount}</Badge>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
