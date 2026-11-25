/**
 * MarketMapView — the interactive market map, with two complementary views:
 *
 *   1. "Plan"  (default): a self-contained top-down floor plan built from the
 *      gates/sections data. Always renders — no external tiles or coordinates
 *      required — so the user ALWAYS sees the market layout.
 *   2. "Map"  : a geographic MapLibre map (free OpenStreetMap tiles) centered on
 *      Dushanbe, with a marker for every section that has coordinates.
 *
 * MapLibre is loaded only in the browser and only when the Map view is active.
 * The data here is DEMO (sample coordinates near Dushanbe) — not the verified
 * real market layout. We never fabricate the actual on-the-ground positions.
 */
'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Search, MapPin, Map as MapIcon, LayoutGrid } from 'lucide-react';
import type { Map as MapLibreMap, Marker } from 'maplibre-gl';
import { useMarketMap } from '@/features/market-map/market-map-api';
import { getDemoMarket } from '@/features/market-map/demo-market';
import { useShops } from '@/features/shops/shops-api';
import { MarketPlan } from './market-plan';
import { LoadingState } from '@/components/ui/states';
import { cn } from '@/lib/utils';
import type { Locale, Shop } from '@/types/domain';

// Dushanbe city center — a public, well-known location.
const DUSHANBE: [number, number] = [68.782, 38.5605];

export function MarketMapView() {
  const locale = useLocale() as Locale;
  const t = useTranslations('map');
  const tc = useTranslations('common');

  const [view, setView] = useState<'plan' | 'map'>('plan');
  const [query, setQuery] = useState('');

  const { data: gates, isLoading, isError } = useMarketMap(locale);
  const { data: shopsData } = useShops({ locale, limit: 100 });

  // When the backend is unavailable or empty, fall back to a built-in DEMO
  // layout so the page always shows a complete market plan (never an error) —
  // the same graceful degradation the homepage uses.
  const usingDemo = (isError || !gates || gates.length === 0) && !isLoading;

  // Group shops by their section so the plan can place them in the right row.
  const liveShopsBySection = useMemo(() => {
    const map = new Map<string, Shop[]>();
    for (const shop of shopsData?.items ?? []) {
      if (!shop.sectionId) continue;
      const list = map.get(shop.sectionId) ?? [];
      list.push(shop);
      map.set(shop.sectionId, list);
    }
    return map;
  }, [shopsData]);

  const demo = useMemo(() => getDemoMarket(), []);
  const effectiveGates = useMemo(
    () => (usingDemo ? demo.gates : gates ?? []),
    [usingDemo, demo, gates],
  );
  const effectiveShops = useMemo(
    () => (usingDemo ? demo.shopsBySection : liveShopsBySection),
    [usingDemo, demo, liveShopsBySection],
  );

  // ----- Geographic map (only mounted when the Map view is active) -----
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const resizeObsRef = useRef<ResizeObserver | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (view !== 'map') return;
    let cancelled = false;
    setMapReady(false);

    (async () => {
      if (!containerRef.current) return;
      const maplibregl = await import('maplibre-gl');
      if (cancelled || !containerRef.current) return;

      // Load MapLibre's worker from our own public/ copy. Without this,
      // Turbopack can't resolve the worker URL ("Worker failed to load").
      maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');

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
        zoom: 14,
      });
      map.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.on('load', () => {
        if (cancelled) return;
        // Force a resize: the container's final size may differ from the size
        // MapLibre measured at init, which otherwise leaves the map blank.
        map.resize();
        setMapReady(true);
      });

      // Keep the canvas matched to the container whenever it changes size.
      const ro = new ResizeObserver(() => map.resize());
      ro.observe(containerRef.current);
      resizeObsRef.current = ro;

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      resizeObsRef.current?.disconnect();
      resizeObsRef.current = null;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [view]);

  // Place a marker for every section that has coordinates.
  useEffect(() => {
    const map = mapRef.current;
    if (view !== 'map' || !map || !mapReady || effectiveGates.length === 0) return;

    (async () => {
      const maplibregl = await import('maplibre-gl');
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const located = effectiveGates
        .flatMap((g) => g.sections)
        .filter((s) => s.latitude != null && s.longitude != null);

      located.forEach((section) => {
        const marker = new maplibregl.Marker({ color: '#2878D0' })
          .setLngLat([section.longitude!, section.latitude!])
          .setPopup(
            new maplibregl.Popup({ offset: 24 }).setHTML(
              `<strong>${section.name ?? section.code}</strong><br/>${section.shopCount} • ${section.code}`,
            ),
          )
          .addTo(map);
        markersRef.current.push(marker);
      });

      if (located.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        located.forEach((s) => bounds.extend([s.longitude!, s.latitude!]));
        // Resize first (container may have just become visible), then fit the
        // markers. Cap the zoom at 16 — the demo sections are very close
        // together, so a higher zoom would request sparse tiles and look empty.
        map.resize();
        map.fitBounds(bounds, { padding: 80, maxZoom: 16, duration: 0 });
      }
    })();
  }, [effectiveGates, mapReady, view]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* DEMO notice */}
      <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber/40 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>{t('demoNotice')}</p>
      </div>

      {/* Toolbar: view toggle + search */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-xl border border-line bg-white p-1">
          <button
            onClick={() => setView('plan')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium',
              view === 'plan' ? 'bg-brand text-white' : 'text-muted hover:bg-canvas',
            )}
          >
            <LayoutGrid className="h-4 w-4" aria-hidden />
            {t('tabPlan')}
          </button>
          <button
            onClick={() => setView('map')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium',
              view === 'map' ? 'bg-brand text-white' : 'text-muted hover:bg-canvas',
            )}
          >
            <MapIcon className="h-4 w-4" aria-hidden />
            {t('tabMap')}
          </button>
        </div>

        <div className="flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-3.5 sm:w-80">
          <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted/70"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingState label={tc('loading')} />
      ) : view === 'plan' ? (
        <MarketPlan gates={effectiveGates} shopsBySection={effectiveShops} query={query} />
      ) : (
        <div className="relative h-[60vh] min-h-[380px] overflow-hidden rounded-card border border-line bg-white">
          {/* IMPORTANT: size the map container with h-full (not absolute
              inset-0). MapLibre forces position:relative on its container, which
              cancels `inset-0` and collapses the height to 0 (blank map). */}
          <div ref={containerRef} className="h-full w-full" />
          {!mapReady ? (
            <div className="absolute inset-0 grid place-items-center bg-canvas/60">
              <LoadingState label={tc('loading')} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
