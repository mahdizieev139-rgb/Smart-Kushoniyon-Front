/**
 * Frontend runtime configuration.
 *
 * NEXT_PUBLIC_* variables are the only ones exposed to the browser. We read the
 * backend API base URL here with a sensible local-dev default so the app runs
 * out of the box. Set NEXT_PUBLIC_API_URL in .env.local for other environments.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:4000/api/v1';
