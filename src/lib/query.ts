/**
 * toQueryString — turns a params object into a URL query string, skipping
 * undefined, null and empty-string values so we never send "?q=&page=".
 *
 * Example: toQueryString({ locale: 'tj', q: '', page: 2 }) -> "locale=tj&page=2"
 */
export function toQueryString(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, String(value));
  }
  return search.toString();
}
