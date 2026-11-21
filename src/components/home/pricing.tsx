/**
 * Pricing — the proposed monthly SaaS plans for the market administration.
 *
 * Prices come straight from the business model (Basic 1,500 / Extended 2,500
 * TJS per month). We clearly label them as PROPOSED, not a confirmed agreement.
 */
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function Pricing() {
  const t = useTranslations('home');
  const tc = useTranslations('common');

  const plans = [
    {
      name: t('planBasic'),
      price: '1500',
      features: [t('planBasicF1'), t('planBasicF2'), t('planBasicF3')],
      highlighted: false,
    },
    {
      name: t('planExtended'),
      price: '2500',
      features: [t('planExtendedF1'), t('planExtendedF2'), t('planExtendedF3')],
      highlighted: true,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">{t('pricingTitle')}</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted">{t('pricingSubtitle')}</p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              'rounded-card border bg-white p-6 shadow-card',
              plan.highlighted ? 'border-brand ring-1 ring-brand' : 'border-line',
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              {plan.highlighted ? <Badge variant="brand">★</Badge> : null}
            </div>
            <p className="mt-4">
              <span className="num text-3xl font-bold text-navy-ink">{plan.price}</span>{' '}
              <span className="text-sm text-muted">
                {tc('currency')}
                {tc('perMonth')}
              </span>
            </p>
            <ul className="mt-5 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
