'use client';
import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Shell } from '../../components/shell';
import { api } from '../../lib/api';
import { useAuthStore } from '../../lib/store';

type Job = { id: string; company: string; title: string; description: string; city?: string; type: string };

export default function JobsPage() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({ company: '', title: '', description: '', city: '', type: 'REMOTE' });
  const [applications, setApplications] = useState<Record<string, string>>({});
  const { data = [] } = useQuery<Job[]>({ queryKey: ['jobs'], queryFn: () => api('/jobs') });
  const canPost = ['ADMIN', 'MODERATOR', 'PREMIUM'].includes(user?.role);
  const create = useMutation({
    mutationFn: () => api('/jobs', { method: 'POST', body: JSON.stringify({ ...form, city: form.city || undefined }) }),
    onSuccess: () => { setForm({ company: '', title: '', description: '', city: '', type: 'REMOTE' }); qc.invalidateQueries({ queryKey: ['jobs'] }); }
  });
  const apply = useMutation({
    mutationFn: ({ id, coverText }: { id: string; coverText: string }) => api(`/jobs/${id}/apply`, { method: 'POST', body: JSON.stringify({ coverText }) }),
    onSuccess: (_, vars) => setApplications((value) => ({ ...value, [vars.id]: '' }))
  });
  const remove = useMutation({ mutationFn: (id: string) => api(`/jobs/${id}`, { method: 'DELETE' }), onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }) });
  const submit = (event: FormEvent) => { event.preventDefault(); if (canPost && form.description.trim().length >= 20) create.mutate(); };

  return (
    <Shell>
      <h1 className="mb-5 text-3xl font-black">Робота</h1>
      {canPost && (
        <form onSubmit={submit} className="card mb-5 grid gap-3 p-4">
          <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Компанія" />
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Посада" />
          <textarea required minLength={20} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Опис вакансії" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Місто або remote" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="REMOTE">Remote</option>
              <option value="FULL_TIME">Full time</option>
              <option value="PART_TIME">Part time</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>
          <button disabled={create.isPending || form.description.trim().length < 20} className="bg-brand px-4 py-2 font-semibold text-ink disabled:opacity-50">Опублікувати вакансію</button>
        </form>
      )}
      <div className="space-y-3">
        {data.map((job) => (
          <article className="card p-4" key={job.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold">{job.title}</h2>
                <p className="text-sm text-slate-400">{job.company} · {job.city || 'remote'} · {job.type}</p>
              </div>
              {['ADMIN', 'MODERATOR'].includes(user?.role) && <button onClick={() => remove.mutate(job.id)} className="bg-red-500 px-3 py-2 text-sm font-semibold text-white">Видалити</button>}
            </div>
            <p className="mt-2 whitespace-pre-wrap">{job.description}</p>
            <form onSubmit={(event) => { event.preventDefault(); apply.mutate({ id: job.id, coverText: applications[job.id] ?? '' }); }} className="mt-3 flex flex-col gap-2">
              <textarea required minLength={10} value={applications[job.id] ?? ''} onChange={(e) => setApplications({ ...applications, [job.id]: e.target.value })} placeholder="Супровідний текст" />
              <button disabled={apply.isPending || (applications[job.id] ?? '').trim().length < 10} className="self-start bg-brand px-3 py-2 text-sm font-semibold text-ink disabled:opacity-50">Відгукнутися</button>
            </form>
          </article>
        ))}
      </div>
    </Shell>
  );
}
