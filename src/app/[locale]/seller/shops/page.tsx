/**
 * Seller shops page — list the seller's shops and create new ones.
 */
'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Plus, Store, Phone } from 'lucide-react';
import { useMyShops } from '@/features/seller/seller-api';
import { Link } from '@/i18n/navigation';
import { ShopForm } from '@/components/seller/shop-form';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states';
import type { Locale } from '@/types/domain';

export default function SellerShopsPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations('dash');
  const ts = useTranslations('states');
  const tc = useTranslations('common');
  const { data: shops, isLoading, isError, refetch } = useMyShops(locale);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">{t('myShops')}</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          {t('newShop')}
        </Button>
      </div>

      {isLoading ? (
        <LoadingState label={tc('loading')} />
      ) : isError ? (
        <ErrorState title={ts('errorTitle')} text={ts('errorText')} onRetry={() => refetch()} retryLabel={tc('retry')} />
      ) : !shops || shops.length === 0 ? (
        <EmptyState title={t('noShops')} text={t('noShopsHint')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <Card key={shop.id} className="p-5">
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
                  <Store className="h-5 w-5" aria-hidden />
                </span>
                <StatusBadge status={shop.status} />
              </div>
              <h3 className="mt-3 font-semibold text-ink">{shop.name ?? shop.slug}</h3>
              {shop.phone ? (
                <p className="num mt-1 inline-flex items-center gap-1.5 text-sm text-muted">
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  {shop.phone}
                </p>
              ) : null}
              {shop.status === 'APPROVED' ? (
                <Link
                  href={`/shops/${shop.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
                >
                  {tc('viewAll')}
                </Link>
              ) : null}
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={t('newShop')}>
        <ShopForm onClose={() => setOpen(false)} onSaved={() => setOpen(false)} />
      </Modal>
    </div>
  );
}
