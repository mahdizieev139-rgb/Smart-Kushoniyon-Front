/**
 * Shared loading / empty / error states.
 *
 * Every list and page reuses these so the app feels consistent and no screen is
 * ever blank without explanation. Text is passed in (already translated) by the
 * caller, keeping these components free of i18n concerns.
 */
import * as React from 'react';
import { Loader2, Inbox, AlertTriangle } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export function LoadingState({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted">
      <Loader2 className="h-6 w-6 animate-spin text-brand" aria-hidden />
      {label ? <p className="text-sm">{label}</p> : null}
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-canvas">
        <Inbox className="h-6 w-6 text-muted" aria-hidden />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {text ? <p className="max-w-sm text-sm text-muted">{text}</p> : null}
    </div>
  );
}

export function ErrorState({
  title,
  text,
  onRetry,
  retryLabel,
}: {
  title: string;
  text?: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {text ? <p className="max-w-sm text-sm text-muted">{text}</p> : null}
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryLabel ?? 'Try again'}
        </Button>
      ) : null}
    </div>
  );
}

/** Skeleton — a shimmering placeholder block shown while content loads. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-line/70', className)} />;
}
