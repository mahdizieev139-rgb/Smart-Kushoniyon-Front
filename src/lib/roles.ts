/**
 * Small role helpers shared by the header, route guards and dashboards.
 */
import type { Role } from '@/types/domain';

/** Where a logged-in user's "Dashboard" link should point, based on role. */
export function dashboardPath(role: Role): string {
  switch (role) {
    case 'SELLER':
      return '/seller/dashboard';
    case 'ADMIN':
    case 'SUPER_ADMIN':
      return '/admin/dashboard';
    default:
      // Customers have no dashboard; send them home.
      return '/';
  }
}

export function isAdmin(role: Role): boolean {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}
