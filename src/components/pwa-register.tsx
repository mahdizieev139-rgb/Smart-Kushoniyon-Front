/**
 * PwaRegister — registers the service worker so the app is installable and has
 * an offline fallback. Only runs in production (the SW would interfere with
 * hot-reload in development). Renders nothing.
 */
'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    // Register after load so it never competes with the first paint.
    const onLoad = () => navigator.serviceWorker.register('/sw.js').catch(() => {});
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return null;
}
