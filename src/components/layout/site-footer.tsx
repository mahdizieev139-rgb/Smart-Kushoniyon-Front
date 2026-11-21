/**
 * SiteFooter — shown on every page.
 *
 * A Server Component: it only reads translations and renders static links, so
 * it needs no client-side JavaScript.
 */
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Logo } from './logo';

export function SiteFooter() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const year = 2026; // build-time constant; avoids hydration mismatch

  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">{t('tagline')}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{t('quickLinks')}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/shops" className="hover:text-brand">
                {nav('shops')}
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-brand">
                {nav('products')}
              </Link>
            </li>
            <li>
              <Link href="/map" className="hover:text-brand">
                {nav('map')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{t('contact')}</h4>
          <p className="mt-3 text-sm text-muted">Kushoniyon Market, Dushanbe, Tajikistan</p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-muted sm:px-6">
          <p>
            © {year} Kushoniyon Smart Market. {t('rights')}
          </p>
          <p className="text-muted/80">{t('demoDisclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}
