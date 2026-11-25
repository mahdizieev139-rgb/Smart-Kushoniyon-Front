/**
 * WhyKushoniyon — a value-proposition grid explaining what the marketplace
 * gives buyers. Static content (translations only), so it stays a Server
 * Component with no client-side JavaScript.
 */
import { useTranslations } from 'next-intl';
import { Search, Languages, Map as MapIcon, Scale } from 'lucide-react';

export function WhyKushoniyon() {
  const t = useTranslations('home');

  const items = [
    { icon: Search, title: t('whyFindTitle'), text: t('whyFindText') },
    { icon: Languages, title: t('whyLangTitle'), text: t('whyLangText') },
    { icon: MapIcon, title: t('whyMapTitle'), text: t('whyMapText') },
    { icon: Scale, title: t('whyPriceTitle'), text: t('whyPriceText') },
  ];

  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 max-w-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">{t('whyTitle')}</h2>
          <p className="mt-2 text-muted">{t('whySubtitle')}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="hover-lift rounded-card border border-line bg-white p-6 shadow-card hover:border-brand"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
                <item.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
