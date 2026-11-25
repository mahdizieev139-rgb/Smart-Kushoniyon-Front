/**
 * Contact page (/[locale]/contact).
 *
 * Left: static contact details (address, phone, email, hours). Right: a demo
 * message form that validates locally and shows a success note — it does NOT
 * send anything, which the note makes explicit for the DEMO build.
 */
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { Card, CardBody } from '@/components/ui/card';
import { Input, Field } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [sent, setSent] = useState(false);

  const details = [
    { icon: MapPin, label: t('addressLabel'), value: t('addressValue') },
    { icon: Phone, label: t('phoneLabel'), value: '+992 44 600 00 00' },
    { icon: Mail, label: t('emailLabel'), value: 'info@kushoniyon.tj' },
    { icon: Clock, label: t('hoursLabel'), value: t('hoursValue') },
  ];

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2">
        {/* Contact details */}
        <section>
          <h2 className="text-xl font-bold">{t('infoTitle')}</h2>
          <ul className="mt-5 space-y-4">
            {details.map((d) => (
              <li key={d.label} className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                  <d.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <div className="text-sm text-muted">{d.label}</div>
                  <div className="font-medium text-ink">{d.value}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Demo message form */}
        <section>
          <Card>
            <CardBody>
              <h2 className="text-xl font-bold">{t('formTitle')}</h2>

              {sent ? (
                <div className="mt-5 flex items-start gap-2 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <p>{t('formSuccess')}</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  className="mt-5 space-y-4"
                >
                  <Field label={t('formName')} htmlFor="name">
                    <Input id="name" name="name" required autoComplete="name" />
                  </Field>
                  <Field label={t('formEmail')} htmlFor="email">
                    <Input id="email" name="email" type="email" required autoComplete="email" />
                  </Field>
                  <Field label={t('formMessage')} htmlFor="message">
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none focus-visible:border-brand"
                    />
                  </Field>

                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    <Send className="h-5 w-5" />
                    {t('formSubmit')}
                  </Button>

                  <p className="text-xs text-muted">{t('formNote')}</p>
                </form>
              )}
            </CardBody>
          </Card>
        </section>
      </div>
    </>
  );
}
