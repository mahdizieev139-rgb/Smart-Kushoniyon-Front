/**
 * Locale-aware navigation helpers.
 *
 * Use THESE instead of next/link and next/navigation so links automatically
 * keep the current locale prefix. Example:
 *   import { Link } from '@/i18n/navigation';
 *   <Link href="/shops">Shops</Link>   // -> /tj/shops when locale is tj
 */
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
