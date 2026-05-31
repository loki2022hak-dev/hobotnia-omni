'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
type AuthState = { accessToken?: string; refreshToken?: string; user?: any; setAuth: (v: Partial<AuthState>) => void; logout: () => void };
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      setAuth: (v) => set(v),
      logout: () => set({ accessToken: undefined, refreshToken: undefined, user: undefined })
    }),
    { name: 'hobotnia-auth' }
  )
);
