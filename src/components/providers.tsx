/**
 * App-wide client providers.
 *
 * - TanStack Query: caches server data and handles loading/error/refetch.
 * - Auth wiring: registers the token-refresh handler with the API client and
 *   restores the session once on startup (using the refresh cookie).
 *
 * This is a Client Component because React Query and the auth store run in the
 * browser. It wraps the whole app inside the locale layout.
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setRefreshHandler } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

export function Providers({ children }: { children: React.ReactNode }) {
  // Create the QueryClient once per app instance.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Public market data changes slowly; avoid noisy refetches.
            staleTime: 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    // Let the API client ask the auth store to refresh the token on a 401.
    setRefreshHandler(() => useAuthStore.getState().refresh());

    // Restore any existing session from the HttpOnly refresh cookie.
    void useAuthStore.getState().bootstrap();

    return () => setRefreshHandler(null);
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
