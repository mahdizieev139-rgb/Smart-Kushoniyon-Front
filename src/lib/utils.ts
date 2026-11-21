/**
 * cn() — merges Tailwind class names safely.
 *
 * clsx handles conditional classes; tailwind-merge resolves conflicts so the
 * last utility wins (e.g. cn("px-2", "px-4") -> "px-4"). Every component uses
 * this so callers can override styles via a `className` prop.
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a money value for display. The backend returns Decimal prices as
 * strings (e.g. "45.50"); we format them with thousands separators and the
 * currency label. We keep it simple and locale-agnostic for predictable output.
 */
export function formatPrice(value: string | number, currency = 'TJS'): string {
  const amount = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(amount)) return `${value} ${currency}`;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ${currency}`;
}
