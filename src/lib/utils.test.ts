/**
 * Unit tests for the pure helper functions.
 * These have no UI or network, so they are fast and reliable to test.
 */
import { describe, it, expect } from 'vitest';
import { cn, formatPrice } from './utils';
import { toQueryString } from './query';
import { dashboardPath, isAdmin } from './roles';

describe('cn', () => {
  it('merges conflicting Tailwind classes (last wins)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
  it('drops falsy values', () => {
    expect(cn('a', false, undefined, 'b')).toBe('a b');
  });
});

describe('formatPrice', () => {
  it('formats a decimal string with 2 fraction digits and currency', () => {
    expect(formatPrice('45.5')).toBe('45.50 TJS');
  });
  it('respects a custom currency', () => {
    expect(formatPrice(1000, 'USD')).toBe('1,000.00 USD');
  });
  it('falls back gracefully for non-numeric input', () => {
    expect(formatPrice('abc')).toBe('abc TJS');
  });
});

describe('toQueryString', () => {
  it('skips undefined, null and empty values', () => {
    expect(toQueryString({ locale: 'tj', q: '', page: 2, x: undefined, y: null })).toBe('locale=tj&page=2');
  });
});

describe('roles', () => {
  it('routes each role to the right dashboard', () => {
    expect(dashboardPath('SELLER')).toBe('/seller/dashboard');
    expect(dashboardPath('ADMIN')).toBe('/admin/dashboard');
    expect(dashboardPath('SUPER_ADMIN')).toBe('/admin/dashboard');
    expect(dashboardPath('CUSTOMER')).toBe('/');
  });
  it('identifies admins', () => {
    expect(isAdmin('ADMIN')).toBe(true);
    expect(isAdmin('SUPER_ADMIN')).toBe(true);
    expect(isAdmin('SELLER')).toBe(false);
  });
});
