/**
 * Logo — the Kushoniyon wordmark with a small "gate" mark.
 *
 * The mark is two uprights + a lintel, echoing a market gate (the app's core
 * wayfinding idea). Kept as inline SVG so it scales crisply and needs no asset.
 */
import { cn } from '@/lib/utils';

export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
        <rect x="1" y="1" width="24" height="24" rx="6" fill={onDark ? '#2878D0' : '#163A63'} />
        <path d="M7 19V9.5L13 6l6 3.5V19" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 19h12M10 19v-5h6v5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={cn('font-display text-lg font-extrabold tracking-tight', onDark ? 'text-white' : 'text-navy-ink')}>
        Kushoniyon
      </span>
    </span>
  );
}
