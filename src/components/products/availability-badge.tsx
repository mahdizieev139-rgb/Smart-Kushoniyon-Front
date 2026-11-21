/**
 * AvailabilityBadge — maps a product's availability to a colored badge with
 * translated text. Reused on product cards and the product detail page.
 */
'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import type { ProductAvailability } from '@/types/domain';

export function AvailabilityBadge({ availability }: { availability: ProductAvailability }) {
  const t = useTranslations('products');

  if (availability === 'OUT_OF_STOCK') {
    return <Badge variant="danger">{t('outOfStock')}</Badge>;
  }
  if (availability === 'PREORDER') {
    return <Badge variant="warning">{t('onOrder')}</Badge>;
  }
  return <Badge variant="success">{t('inStock')}</Badge>;
}
