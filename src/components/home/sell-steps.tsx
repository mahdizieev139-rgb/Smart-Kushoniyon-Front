/**
 * SellSteps — explains how a seller gets started, in three ordered steps.
 *
 * The numbering (01/02/03) is meaningful here: it is a real sequence a seller
 * follows, so the numbers carry information rather than just decorate.
 */
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export function SellSteps() {
  const t = useTranslations('home');

  const steps = [
    { title: t('sellStep1Title'), text: t('sellStep1Text') },
    { title: t('sellStep2Title'), text: t('sellStep2Text') },
    { title: t('sellStep3Title'), text: t('sellStep3Text') },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">{t('sellTitle')}</h2>
          <p className="mt-2 max-w-xl text-muted">{t('sellText')}</p>
        </div>
        <Link href="/register">
          <Button variant="navy" size="lg">
            {t('becomeSeller')}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title} className="rounded-card border border-line bg-white p-6 shadow-card">
            <span className="num text-sm font-semibold text-brand">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
