/**
 * Internationalization routing configuration (next-intl).
 *
 * The app serves three languages. Tajik ("tj") is the default. Every public
 * URL is prefixed with the locale, e.g. /tj/shops, /ru/shops, /en/shops.
 * This single source of truth is imported by the middleware, the request
 * config, and the typed navigation helpers.
 */
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['tj', 'ru', 'en'],
  defaultLocale: 'tj',
  // "always" keeps the locale in the URL even for the default language, which
  // makes language switching and sharing links unambiguous.
  localePrefix: 'always',
});

// A small, reusable type: "tj" | "ru" | "en".
export type AppLocale = (typeof routing.locales)[number];

// Human-readable names shown in the language switcher (in their own language).
export const localeNames: Record<AppLocale, string> = {
  tj: 'Тоҷикӣ',
  ru: 'Русский',
  en: 'English',
};
