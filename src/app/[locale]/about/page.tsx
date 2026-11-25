/**
 * About page (/[locale]/about).
 *
 * Static marketing content: who we are, our mission, our values, a small stats
 * band and a seller call-to-action. Translations only, so it stays a Server
 * Component. Stat numbers are illustrative figures for the DEMO build.
 */
import { useTranslations } from 'next-intl';
import { Eye, Languages, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/layout/page-hero';
import { Button } from '@/components/ui/button';

const STATS = [
  { value: '120+', key: 'statsShops' as const },
  { value: '900+', key: 'statsProducts' as const },
  { value: '12', key: 'statsCategories' as const },
  { value: '3', key: 'statsLanguages' as const },
];

export default function AboutPage() {
  const t = useTranslations('about');
  const h = useTranslations('home');

  const values = [
    { icon: Eye, title: t('value1Title'), text: t('value1Text') },
    { icon: Languages, title: t('value2Title'), text: t('value2Text') },
    { icon: ShieldCheck, title: t('value3Title'), text: t('value3Text') },
    { icon: HeartHandshake, title: t('value4Title'), text: t('value4Text') },
  ];

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Intro + mission */}
        <section className="grid gap-8 py-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">{t('introTitle')}</h2>
            <p className="mt-3 text-pretty text-muted">{t('introText')}</p>
          </div>
          <div className="rounded-card border border-line bg-brand-50 p-6">
            <h2 className="text-xl font-bold text-navy-ink">{t('missionTitle')}</h2>
            <p className="mt-3 text-navy-ink/80">{t('missionText')}</p>
          </div>
        </section>
      </div>

      {/* Stats band */}
      <section className="border-y border-line bg-navy">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.key} className="text-center">
              <div className="num text-3xl font-extrabold text-white sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-white/70">{h(s.key)}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Values */}
        <section className="py-12">
          <h2 className="mb-6 text-2xl font-bold">{t('statsTitle')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-card border border-line bg-white p-6 shadow-card">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
                  <v.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-4">
          <div className="overflow-hidden rounded-card bg-gradient-to-br from-navy to-brand-600 p-8 sm:p-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">{t('ctaTitle')}</h2>
                <p className="mt-2 text-white/75">{t('ctaText')}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/register">
                  <Button variant="amber" size="lg">
                    {t('ctaButton')}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/shops">
                  <Button variant="outline" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                    {t('exploreButton')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
