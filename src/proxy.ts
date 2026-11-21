/**
 * Next.js proxy (formerly "middleware") — handles locale detection + redirects.
 *
 * It runs before pages render and makes sure every request has a valid locale
 * prefix (e.g. redirects "/" to "/tj"). The matcher excludes API routes,
 * Next.js internals, and static files (anything with a dot in the path).
 *
 * In Next.js 16 this file convention was renamed from `middleware.ts` to
 * `proxy.ts`; the next-intl handler works the same under the new name.
 */
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
