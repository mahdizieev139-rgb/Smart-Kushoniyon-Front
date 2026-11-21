/**
 * Auth store (Zustand) — holds the current user and access token in memory.
 *
 * Why Zustand (not Context)? It is tiny, works outside React too, and lets the
 * API client read/update auth without prop drilling. The access token is kept
 * in memory only (never localStorage) to reduce XSS risk; on a page refresh we
 * silently restore the session using the HttpOnly refresh cookie.
 */
'use client';

import { create } from 'zustand';
import { setAccessToken } from '@/lib/api-client';
import type { User } from '@/types/domain';
import {
  loginRequest,
  registerRequest,
  logoutRequest,
  refreshRequest,
  type LoginPayload,
  type RegisterPayload,
} from '@/features/auth/auth-api';

type Status = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  status: Status;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  // Restore the session on app start using the refresh cookie.
  bootstrap: () => Promise<void>;
  // Used by the API client's refresh-retry; returns a new token or null.
  refresh: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',

  login: async (payload) => {
    const { user, accessToken } = await loginRequest(payload);
    setAccessToken(accessToken);
    set({ user, status: 'authenticated' });
    return user;
  },

  register: async (payload) => {
    const { user, accessToken } = await registerRequest(payload);
    setAccessToken(accessToken);
    set({ user, status: 'authenticated' });
    return user;
  },

  logout: async () => {
    try {
      await logoutRequest();
    } finally {
      setAccessToken(null);
      set({ user: null, status: 'unauthenticated' });
    }
  },

  bootstrap: async () => {
    set({ status: 'loading' });
    try {
      const { user, accessToken } = await refreshRequest();
      setAccessToken(accessToken);
      set({ user, status: 'authenticated' });
    } catch {
      // No valid session — that's normal for anonymous visitors.
      setAccessToken(null);
      set({ user: null, status: 'unauthenticated' });
    }
  },

  refresh: async () => {
    try {
      const { user, accessToken } = await refreshRequest();
      setAccessToken(accessToken);
      set({ user, status: 'authenticated' });
      return accessToken;
    } catch {
      setAccessToken(null);
      set({ user: null, status: 'unauthenticated' });
      return null;
    }
  },
}));
