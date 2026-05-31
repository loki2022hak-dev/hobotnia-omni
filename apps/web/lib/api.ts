'use client';
import { useAuthStore } from './store';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function csrf() {
  const res = await fetch(`${API_URL}/api/auth/csrf`, { credentials: 'include' });
  return (await res.json()).csrfToken as string;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.method && init.method !== 'GET') headers.set('x-csrf-token', await csrf());
  const res = await fetch(`${API_URL}/api${path}`, { ...init, headers, credentials: 'include' });
  if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}
