/**
 * Copies MapLibre's worker file into public/ so the browser can load it from a
 * stable URL (/maplibre-gl-worker.mjs).
 *
 * Why: under Next.js + Turbopack, MapLibre cannot always resolve its own worker
 * URL, which throws "Worker failed to load". Serving the worker ourselves and
 * calling maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs') fixes it reliably.
 *
 * This runs automatically via the "predev" and "prebuild" npm scripts, so the
 * copied worker always matches the installed maplibre-gl version.
 */
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const src = join(root, 'node_modules', 'maplibre-gl', 'dist', 'maplibre-gl-worker.mjs');
const destDir = join(root, 'public');
const dest = join(destDir, 'maplibre-gl-worker.mjs');

if (!existsSync(src)) {
  console.warn('[copy-maplibre-worker] source not found, skipping:', src);
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log('[copy-maplibre-worker] copied worker -> public/maplibre-gl-worker.mjs');
