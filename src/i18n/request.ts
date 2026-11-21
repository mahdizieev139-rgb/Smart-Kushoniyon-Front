/**
 * Per-request i18n configuration (runs on the server for each request).
 *
 * next-intl calls this to know which locale is active and which message
 * dictionary to load. If the URL locale is not one we support, we fall back to
 * the default locale instead of throwing.
 */
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    // Load only the active locale's messages (code-split per language).
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
