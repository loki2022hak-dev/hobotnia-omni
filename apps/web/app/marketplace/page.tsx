'use client';
import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Shell } from '../../components/shell';
import { api } from '../../lib/api';
import { useAuthStore } from '../../lib/store';

type Item = { id: string; sellerId: string; title: string; description: string; price: string; category: string; photoUrls: string[] };

export default function MarketplacePage() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', photoUrls: '' });
  const { data = [] } = useQuery<Item[]>({ queryKey: ['marketplace'], queryFn: () => api('/marketplace') });
  const create = useMutation({
    mutationFn: () => api('/marketplace', {
      method: 'POST',
      body: JSON.stringify({ ...form, price: Number(form.price), photoUrls: form.photoUrls.split('\n').map((url) => url.trim()).filter(Boolean) })
    }),
    onSuccess: () => { setForm({ title: '', description: '', price: '', category: '', photoUrls: '' }); qc.invalidateQueries({ queryKey: ['marketplace'] }); }
  });
  const sold = useMutation({ mutationFn: (id: string) => api(`/marketplace/${id}/sold`, { method: 'POST', body: '{}' }), onSuccess: () => qc.invalidateQueries({ queryKey: ['marketplace'] }) });
  const remove = useMutation({ mutationFn: (id: string) => api(`/marketplace/${id}`, { method: 'DELETE' }), onSuccess: () => qc.invalidateQueries({ queryKey: ['marketplace'] }) });
  const submit = (event: FormEvent) => { event.preventDefault(); if (form.description.trim().length >= 10 && Number(form.price) > 0) create.mutate(); };
  const canEdit = (item: Item) => user && (item.sellerId === user.id || ['ADMIN', 'MODERATOR'].includes(user.role));

  return (
    <Shell>
      <h1 className="mb-5 text-3xl font-black">Маркетплейс</h1>
      <form onSubmit={submit} className="card mb-5 grid gap-3 p-4">
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Назва товару або послуги" />
        <textarea required minLength={10} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Опис" />
        <div className="grid gap-3 sm:grid-cols-2">
          <input required type="number" min="1" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Ціна, грн" />
          <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Категорія" />
        </div>
        <textarea value={form.photoUrls} onChange={(e) => setForm({ ...form, photoUrls: e.target.value })} placeholder="URL фото, кожен з нового рядка" />
        <button disabled={create.isPending || form.description.trim().length < 10 || Number(form.price) <= 0} className="bg-brand px-4 py-2 font-semibold text-ink disabled:opacity-50">Додати оголошення</button>
      </form>
      <div className="grid gap-3 md:grid-cols-2">
        {data.map((item) => (
          <article className="card p-4" key={item.id}>
            {item.photoUrls?.[0] && <img src={item.photoUrls[0]} alt={item.title} className="mb-3 aspect-video w-full rounded-md object-cover" />}
            <h2 className="font-bold">{item.title}</h2>
            <p className="text-accent">{item.price} грн</p>
            <p className="text-sm text-slate-400">{item.category}</p>
            <p className="mt-2 whitespace-pre-wrap">{item.description}</p>
            {canEdit(item) && <div className="mt-3 flex gap-2"><button onClick={() => sold.mutate(item.id)} className="bg-brand px-3 py-2 text-sm font-semibold text-ink">Продано</button><button onClick={() => remove.mutate(item.id)} className="bg-red-500 px-3 py-2 text-sm font-semibold text-white">Архівувати</button></div>}
          </article>
        ))}
      </div>
    </Shell>
  );
}
