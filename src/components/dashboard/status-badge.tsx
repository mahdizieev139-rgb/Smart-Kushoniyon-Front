/**
 * StatusBadge — shows a shop/product status (PENDING, APPROVED, …) as a colored,
 * translated badge. Shared by the seller and admin tables.
 */
'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';

type Status = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'ARCHIVED';

const variantByStatus: Record<Status, 'warning' | 'success' | 'danger' | 'neutral'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  SUSPENDED: 'danger',
  ARCHIVED: 'neutral',
};

export function StatusBadge({ status }: { status: string }) {
  const t = useTranslations('dash');
  const s = status as Status;
  return <Badge variant={variantByStatus[s] ?? 'neutral'}>{t(`status${s}` as `status${Status}`)}</Badge>;
}
