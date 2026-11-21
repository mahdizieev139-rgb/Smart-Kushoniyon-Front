/**
 * StatCard — a single KPI tile (icon + number + label) for dashboard overviews.
 * The number uses the mono font with tabular figures so stat rows align.
 */
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'brand',
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: 'brand' | 'amber' | 'muted';
}) {
  const toneClass =
    tone === 'amber'
      ? 'bg-amber-50 text-amber-800'
      : tone === 'muted'
        ? 'bg-canvas text-muted'
        : 'bg-brand-50 text-brand';

  return (
    <div className="rounded-card border border-line bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', toneClass)}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
      <p className="num mt-3 text-3xl font-bold text-navy-ink">{value}</p>
    </div>
  );
}
