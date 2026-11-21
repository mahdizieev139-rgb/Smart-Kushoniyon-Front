/* Kushoniyon service worker.
 *
 * Caching policy (privacy-first):
 *   - Static same-origin assets (JS/CSS/fonts/images): cache-first.
 *   - Page navigations: network-first, falling back to /offline.html offline.
 *   - NEVER cache API calls, auth, or seller/admin pages — these are dynamic
 *     and may contain private data that must not sit in a shared cache.
 */
const CACHE = 'kushoniyon-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL, '/icons/icon.svg', '/manifest.webmanifest']))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  // Remove old caches when the service worker updates.
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function isSensitive(url) {
  return (
    url.pathname.startsWith('/api') ||
    /\/(seller|admin|login|register)(\/|$)/.test(url.pathname)
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only handle our own origin; let the backend API and map tiles go to network.
  if (url.origin !== self.location.origin) return;
  // Never cache sensitive/dynamic routes.
  if (isSensitive(url)) return;

  // Page navigations: try the network, fall back to the offline page.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // Static assets: serve from cache, update cache in the background.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
