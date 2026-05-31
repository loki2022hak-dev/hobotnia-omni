'use client';
import { useState } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../lib/store';

export function AuthPanel() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', username: '', password: '', rememberMe: true });
  const [error, setError] = useState('');
  async function submit() {
    setError('');
    try {
      const res = await api<any>(mode === 'login' ? '/auth/login' : '/auth/register', { method: 'POST', body: JSON.stringify(form) });
      setAuth(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Помилка авторизації');
    }
  }
  if (user) {
    return <div className="card mb-6 flex items-center justify-between p-4"><div><p className="font-semibold">@{user.username}</p><p className="text-sm text-slate-400">{user.role}</p></div><button onClick={logout} className="bg-white/10 px-3 py-2 text-sm">Вийти</button></div>;
  }
  return (
    <div className="card mb-6 p-4">
      <div className="mb-3 flex gap-2">
        <button className="bg-brand px-3 py-2 text-sm font-semibold text-ink" onClick={() => setMode('login')}>Вхід</button>
        <button className="bg-white/10 px-3 py-2 text-sm" onClick={() => setMode('register')}>Реєстрація</button>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <input required placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/>
        {mode === 'register' && <input required minLength={3} placeholder="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}/>}
        <input required minLength={8} placeholder="пароль" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/>
        <button onClick={submit} className="bg-accent px-4 py-2 font-semibold text-ink">Продовжити</button>
      </div>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
    </div>
  );
}
