/**
 * API client — one place that talks to the backend REST API.
 *
 * Features:
 *   - Prepends the API base URL.
 *   - Sends cookies (credentials: 'include') so the HttpOnly refresh cookie
 *     flows for the refresh endpoint.
 *   - Attaches the in-memory access token as a Bearer header.
 *   - On a 401, tries to refresh the access token ONCE, then retries the call.
 *   - Unwraps the standard envelope { success, message, data, meta } and throws
 *     a typed ApiError on failure so callers can show a message.
 *
 * The access token lives in memory (set by the auth store), never in
 * localStorage — this reduces XSS token theft risk.
 */
import { API_BASE_URL } from './config';

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiError extends Error {
  status: number;
  errors?: unknown[];
  constructor(message: string, status: number, errors?: unknown[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

// --- Access token kept in memory; the auth store keeps this in sync. ---
let accessToken: string | null = null;
export function setAccessToken(token: string | null): void {
  accessToken = token;
}

// The auth store registers a refresh function here. Returning a new token means
// "retry the original request"; returning null means "refresh failed".
let refreshHandler: (() => Promise<string | null>) | null = null;
export function setRefreshHandler(fn: (() => Promise<string | null>) | null): void {
  refreshHandler = fn;
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown; // plain object; we JSON-stringify it
  auth?: boolean; // default true: attach token + allow refresh-retry
  _retried?: boolean; // internal: prevents infinite refresh loops
}

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
  errors?: unknown[];
}

/** Core request that returns the full envelope (data + meta). */
export async function apiRaw<T>(path: string, options: RequestOptions = {}): Promise<Envelope<T>> {
  const { body, auth = true, _retried, ...rest } = options;
  const headers = new Headers(rest.headers);

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body !== undefined && !isFormData) headers.set('Content-Type', 'application/json');
  if (auth && accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
    credentials: 'include',
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
  });

  // Try a single silent refresh on expiry, then retry the original request.
  if (res.status === 401 && auth && !_retried && refreshHandler) {
    const newToken = await refreshHandler();
    if (newToken) return apiRaw<T>(path, { ...options, _retried: true });
  }

  const json = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (!res.ok || !json?.success) {
    throw new ApiError(json?.message ?? 'Request failed', res.status, json?.errors);
  }
  return json;
}

/** Convenience: returns just the `data` payload (the common case). */
export async function api<T>(path: string, options?: RequestOptions): Promise<T> {
  return (await apiRaw<T>(path, options)).data;
}
