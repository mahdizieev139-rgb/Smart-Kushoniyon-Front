/**
 * Root layout for every localized route (/tj, /ru, /en).
 *
 * Because all pages live under [locale], this is effectively THE root layout:
 * it renders <html>/<body>, loads the fonts, sets the language, and wraps the
 * app in the i18n provider, the data/auth providers, and the shared header and
 * footer.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { Manrope, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { Providers } from '@/components/providers';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import '../globals.css';

// Fonts. All three families include Cyrillic so Tajik and Russian render well.
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
});
const plexSans = IBM_Plex_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-sans',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Kushoniyon Smart Market',
    template: '%s · Kushoniyon',
  },
  description:
    'Digital marketplace for Kushoniyon Market, Dushanbe — find shops, construction materials, prices and locations.',
};

// Pre-generate the three locale routes at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Guard against unsupported locales in the URL.
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className={`${manrope.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body className="min-h-dvh">
        <NextIntlClientProvider>
          <Providers>
            <div className="flex min-h-dvh flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
