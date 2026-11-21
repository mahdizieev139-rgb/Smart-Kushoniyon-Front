/**
 * RequireAuth — a client-side route guard for dashboard pages.
 *
 * How it works:
 *   - On startup the auth store silently restores the session (bootstrap),
 *     moving status from 'idle' -> 'loading' -> 'authenticated'|'unauthenticated'.
 *   - While that resolves we show a spinner (so we don't flicker the login page).
 *   - If the user is not logged in, we send them to /login.
 *   - If logged in but with the wrong role, we show a "no access" message.
 *
 * This is defense-in-depth for UX only — the backend ALSO enforces every rule.
 * A guard in the browser can never be the real security boundary.
 */
'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { LoadingState, EmptyState } from '@/components/ui/states';
import type { Role } from '@/types/domain';

export function RequireAuth({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const t = useTranslations('dash');
  const tc = useTranslations('common');
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);

  const allowed = status === 'authenticated' && user != null && roles.includes(user.role);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // Still restoring the session.
  if (status === 'idle' || status === 'loading') {
    return <LoadingState label={tc('loading')} />;
  }

  // Logged in but not allowed here.
  if (status === 'authenticated' && !allowed) {
    return (
      <div className="py-24">
        <EmptyState title={t('noPermission')} />
      </div>
    );
  }

  if (allowed) return <>{children}</>;

  // Unauthenticated: redirect effect is running; show a spinner meanwhile.
  return <LoadingState label={tc('loading')} />;
}
