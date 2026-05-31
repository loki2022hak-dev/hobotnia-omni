'use client';
import { FormEvent, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Shell } from '../../components/shell';
import { api } from '../../lib/api';
import { useAuthStore } from '../../lib/store';

export default function SettingsPage() {
  const qc = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { data } = useQuery<any>({ queryKey: ['me'], queryFn: () => api('/users/me'), retry: false });
  const [form, setForm] = useState({ bio: '', city: '', avatarUrl: '', coverUrl: '', status: 'online', website: '', telegram: '' });
  useEffect(() => {
    if (!data) return;
    setForm({
      bio: data.profile?.bio ?? '',
      city: data.profile?.city ?? '',
      avatarUrl: data.profile?.avatarUrl ?? '',
      coverUrl: data.profile?.coverUrl ?? '',
      status: data.status ?? 'online',
      website: data.profile?.socialLinks?.website ?? '',
      telegram: data.profile?.socialLinks?.telegram ?? ''
    });
  }, [data]);
  const update = useMutation({
    mutationFn: () => api('/users/me', { method: 'PATCH', body: JSON.stringify({ ...form, socialLinks: { website: form.website, telegram: form.telegram } }) }),
    onSuccess: async () => {
      const refreshed = await api('/users/me');
      setAuth({ user: refreshed });
      qc.setQueryData(['me'], refreshed);
    }
  });
  const submit = (event: FormEvent) => { event.preventDefault(); update.mutate(); };

  return (
    <Shell>
      <h1 className="mb-5 text-3xl font-black">Профіль і налаштування</h1>
      <section className="card mb-5 p-4">
        <p className="font-bold">@{data?.username}</p>
        <p className="text-sm text-slate-400">{data?.email} · {data?.role} · {data?._count?.posts ?? 0} постів · {data?._count?.comments ?? 0} коментарів</p>
      </section>
      <form onSubmit={submit} className="card grid gap-3 p-4">
        <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Біографія" />
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Місто" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="online">online</option>
            <option value="busy">busy</option>
            <option value="offline">offline</option>
          </select>
        </div>
        <input type="url" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} placeholder="URL аватару" />
        <input type="url" value={form.coverUrl} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} placeholder="URL обкладинки" />
        <div className="grid gap-3 sm:grid-cols-2">
          <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="Сайт" />
          <input value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} placeholder="Telegram" />
        </div>
        <button disabled={update.isPending} className="bg-brand px-4 py-2 font-semibold text-ink disabled:opacity-50">Зберегти профіль</button>
      </form>
    </Shell>
  );
}
