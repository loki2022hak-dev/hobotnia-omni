'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shell } from '../../components/shell';
import { api } from '../../lib/api';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const { data } = useQuery<any>({ queryKey: ['search', q], queryFn: () => api(`/search?q=${encodeURIComponent(q)}`), enabled: q.trim().length > 1 });
  const sections = [
    ['Користувачі', data?.users ?? [], (item: any) => <Link href={`/settings`} className="font-semibold">@{item.username}</Link>],
    ['Пости', data?.posts ?? [], (item: any) => <Link href="/" className="font-semibold">{item.content.slice(0, 120)}</Link>],
    ['Коментарі', data?.comments ?? [], (item: any) => <Link href="/" className="font-semibold">{item.content.slice(0, 120)}</Link>],
    ['Теми форуму', data?.topics ?? [], (item: any) => <Link href="/forum" className="font-semibold">{item.title}</Link>],
    ['Спільноти', data?.communities ?? [], (item: any) => <Link href="/communities" className="font-semibold">{item.name}</Link>]
  ] as const;

  return (
    <Shell>
      <h1 className="mb-5 text-3xl font-black">Пошук</h1>
      <input className="mb-4 w-full" minLength={2} placeholder="Користувачі, пости, коментарі, теми, спільноти" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid gap-4">
        {sections.map(([title, items, render]) => (
          <section className="card p-4" key={title}>
            <h2 className="mb-3 font-bold">{title}</h2>
            <div className="space-y-2">
              {items.map((item: any) => <div key={item.id} className="rounded-md bg-white/5 p-3 text-sm">{render(item)}</div>)}
              {q.trim().length > 1 && items.length === 0 && <p className="text-sm text-slate-400">Збігів у цьому розділі не знайдено.</p>}
            </div>
          </section>
        ))}
      </div>
    </Shell>
  );
}
