/**
 * Pagination — Previous / Next controls with the current page indicator.
 *
 * Kept simple and accessible: disabled buttons at the edges, and the current
 * page announced as text. The parent owns the page state and passes handlers.
 */
'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const t = useTranslations('common');
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        {t('previous')}
      </Button>
      <span className="text-sm text-muted">
        {t('page')} <span className="font-semibold text-ink">{page}</span> / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {t('next')}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
