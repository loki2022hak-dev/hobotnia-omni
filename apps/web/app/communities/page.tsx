'use client';
import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Shell } from '../../components/shell';
import { api } from '../../lib/api';
import { useAuthStore } from '../../lib/store';

type Community = { id: string; name: string; slug: string; description?: string; visibility: string; ownerId: string; _count?: { members: number; posts: number } };

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9а-яіїєґ]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60);
}

export default function CommunitiesPage() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const { data = [] } = useQuery<Community[]>({ queryKey: ['communities'], queryFn: () => api('/communities') });
  const create = useMutation({
    mutationFn: () => api('/communities', { method: 'POST', body: JSON.stringify({ name, slug: slugify(name), description, visibility }) }),
    onSuccess: () => { setName(''); setDescription(''); qc.invalidateQueries({ queryKey: ['communities'] }); }
  });
  const join = useMutation({ mutationFn: (id: string) => api(`/communities/${id}/join`, { method: 'POST', body: '{}' }), onSuccess: () => qc.invalidateQueries({ queryKey: ['communities'] }) });
  const remove = useMutation({ mutationFn: (id: string) => api(`/communities/${id}`, { method: 'DELETE' }), onSuccess: () => qc.invalidateQueries({ queryKey: ['communities'] }) });
  const submit = (event: FormEvent) => { event.preventDefault(); if (name.trim().length >= 3) create.mutate(); };
  const canModerate = (community: Community) => user && (community.ownerId === user.id || ['ADMIN', 'MODERATOR'].includes(user.role));

  return (
    <Shell>
      <h1 className="mb-5 text-3xl font-black">Спільноти</h1>
      <form onSubmit={submit} className="card mb-5 grid gap-3 p-4">
        <input value={name} onChange={(e) => setName(e.target.value)} minLength={3} maxLength={80} required placeholder="Назва спільноти" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Опис і правила" />
        <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          <option value="PUBLIC">Публічна</option>
          <option value="PRIVATE">Приватна</option>
        </select>
        <button disabled={create.isPending || name.trim().length < 3} className="bg-brand px-4 py-2 font-semibold text-ink disabled:opacity-50">Створити спільноту</button>
      </form>
      <div className="space-y-3">
        {data.map((community) => (
          <article className="card p-4" key={community.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold">{community.name}</h2>
                <p className="text-sm text-slate-400">{community.description || community.visibility}</p>
                <p className="mt-1 text-xs text-slate-500">{community._count?.members ?? 0} учасників · {community._count?.posts ?? 0} постів</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => join.mutate(community.id)} className="bg-brand px-3 py-2 text-sm font-semibold text-ink">Увійти</button>
                {canModerate(community) && <button onClick={() => remove.mutate(community.id)} className="bg-red-500 px-3 py-2 text-sm font-semibold text-white">Видалити</button>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Shell>
  );
}
