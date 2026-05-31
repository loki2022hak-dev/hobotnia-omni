'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Shell } from '../../../components/shell';
import { Composer } from '../../../components/composer';
import { api } from '../../../lib/api';

export default function ForumTopicPage() {
  const params = useParams<{ slug: string }>();
  const qc = useQueryClient();
  const { data = [] } = useQuery<any[]>({ queryKey: ['topics', params.slug], queryFn: () => api(`/forum/categories/${params.slug}/topics`) });
  const create = useMutation({ mutationFn: (content: string) => api(`/forum/categories/${params.slug}/topics`, { method: 'POST', body: JSON.stringify({ title: content.slice(0, 80), content }) }), onSuccess: () => qc.invalidateQueries({ queryKey: ['topics', params.slug] }) });
  return <Shell><h1 className="mb-5 text-3xl font-black">Теми</h1><Composer placeholder="Створи тему форуму" onSubmit={(v) => create.mutate(v)}/><div className="space-y-3">{data.map((t) => <article className="card p-4" key={t.id}><h2 className="font-bold">{t.title}</h2><p className="mt-2 text-slate-300">{t.content}</p></article>)}</div></Shell>;
}
