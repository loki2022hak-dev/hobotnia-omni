'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Shell } from '../../components/shell';
import { api } from '../../lib/api';
export default function ForumPage() {
  const { data = [] } = useQuery<any[]>({ queryKey: ['forum-categories'], queryFn: () => api('/forum/categories') });
  return <Shell><h1 className="mb-5 text-3xl font-black">Форум</h1><div className="grid gap-3 md:grid-cols-2">{data.map((c) => <Link className="card p-4 hover:border-brand" key={c.id} href={`/forum/${c.slug}`}><h2 className="font-bold">{c.title}</h2><p className="text-sm text-slate-400">{c._count?.topics ?? 0} тем</p></Link>)}</div></Shell>;
}
