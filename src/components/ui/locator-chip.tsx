/**
 * LocatorChip — the app's signature element.
 *
 * It mimics physical bazaar/airport wayfinding signage, showing which Gate and
 * Section a shop sits in (e.g. "G1 · Row A"). It appears on every shop card and
 * shop page so the digital listing ties directly to the real market geography.
 *
 * Why its own component? The "find it in the market" idea is the product's
 * reason to exist, so this visual must be identical everywhere it appears.
 */
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocatorChipProps {
  gate?: string | null; // e.g. "G1"
  section?: string | null; // e.g. "Row A"
  className?: string;
}

export function LocatorChip({ gate, section, className }: LocatorChipProps) {
  // Nothing to show if the shop has no placement yet.
  if (!gate && !section) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-navy/15 bg-navy/5 px-2 py-1 text-xs font-medium text-navy',
        className,
      )}
    >
      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span className="num tracking-tight">
        {gate}
        {gate && section ? <span className="mx-1 text-navy/40">·</span> : null}
        {section}
      </span>
    </span>
  );
}
