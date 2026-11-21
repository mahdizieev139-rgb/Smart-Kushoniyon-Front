/**
 * Auth API calls — thin wrappers over the backend /auth endpoints.
 *
 * The backend returns { user, accessToken } for login/register/refresh. The
 * refresh token is handled by the browser automatically via the HttpOnly
 * cookie, so we never touch it in JavaScript.
 */
import { api } from '@/lib/api-client';
import type { User, Role } from '@/types/domain';

export interface AuthResult {
  user: User;
  accessToken: string;
}

export interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  role: Extract<Role, 'CUSTOMER' | 'SELLER'>;
}

export function loginRequest(payload: LoginPayload) {
  return api<AuthResult>('/auth/login', { method: 'POST', body: payload, auth: false });
}

export function registerRequest(payload: RegisterPayload) {
  return api<AuthResult>('/auth/register', { method: 'POST', body: payload, auth: false });
}

export function logoutRequest() {
  return api<null>('/auth/logout', { method: 'POST', auth: false });
}

// Uses the refresh cookie (auth: false means "don't attach the access token
// and don't trigger the refresh-retry loop" — this call IS the refresh).
export function refreshRequest() {
  return api<AuthResult>('/auth/refresh', { method: 'POST', auth: false });
}
