'use client';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bookmark, Heart, MessageCircle, Repeat2, Trash2 } from 'lucide-react';
import { AuthPanel } from '../components/auth-panel';
import { Composer } from '../components/composer';
import { Shell } from '../components/shell';
import { api } from '../lib/api';
import { useAuthStore } from '../lib/store';

function PostCard({ post }: { post: any }) {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [comment, setComment] = useState('');
  const { data: comments = [] } = useQuery<any[]>({ queryKey: ['comments', post.id], queryFn: () => api(`/posts/${post.id}/comments`) });
  const like = useMutation({ mutationFn: () => api(`/posts/${post.id}/like`, { method: 'POST', body: '{}' }), onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }) });
  const save = useMutation({ mutationFn: () => api(`/posts/${post.id}/save`, { method: 'POST', body: '{}' }) });
  const repost = useMutation({ mutationFn: () => api(`/posts/${post.id}/repost`, { method: 'POST', body: '{}' }), onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }) });
  const remove = useMutation({ mutationFn: () => api(`/posts/${post.id}`, { method: 'DELETE' }), onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }) });
  const createComment = useMutation({
    mutationFn: () => api(`/posts/${post.id}/comments`, { method: 'POST', body: JSON.stringify({ content: comment.trim() }) }),
    onSuccess: () => { setComment(''); qc.invalidateQueries({ queryKey: ['comments', post.id] }); qc.invalidateQueries({ queryKey: ['posts'] }); }
  });
  const canDelete = user?.id === post.authorId || ['ADMIN', 'MODERATOR'].includes(user?.role);

  return (
    <article className="card p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="font-semibold">@{post.author?.username}</div>
        {canDelete && <button onClick={() => remove.mutate()} className="rounded-md bg-red-500/20 p-2 text-red-200"><Trash2 size={16}/></button>}
      </div>
      <p className="whitespace-pre-wrap text-slate-200">{post.content}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
        <button onClick={() => like.mutate()} className="inline-flex items-center gap-2 bg-white/10 px-3 py-2"><Heart size={18}/>{post._count?.likes ?? 0}</button>
        <button onClick={() => document.getElementById(`comment-${post.id}`)?.focus()} className="inline-flex items-center gap-2 bg-white/10 px-3 py-2"><MessageCircle size={18}/>{post._count?.comments ?? 0}</button>
        <button onClick={() => repost.mutate()} className="inline-flex items-center gap-2 bg-white/10 px-3 py-2"><Repeat2 size={18}/>{post._count?.reposts ?? 0}</button>
        <button onClick={() => save.mutate()} className="inline-flex items-center gap-2 bg-white/10 px-3 py-2"><Bookmark size={18}/>Зберегти</button>
      </div>
      <div className="mt-4 space-y-2">
        {comments.map((item) => <div key={item.id} className="rounded-md bg-white/5 p-2 text-sm"><b>@{item.author?.username}</b><p>{item.content}</p></div>)}
        <div className="flex gap-2">
          <input id={`comment-${post.id}`} className="flex-1" minLength={1} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Коментар"/>
          <button disabled={!comment.trim()} onClick={() => createComment.mutate()} className="bg-brand px-3 py-2 font-semibold text-ink disabled:opacity-50">Додати</button>
        </div>
      </div>
    </article>
  );
}

export default function FeedPage() {
  const qc = useQueryClient();
  const { data = [] } = useQuery<any[]>({ queryKey: ['posts'], queryFn: () => api('/posts') });
  const create = useMutation({ mutationFn: (content: string) => api('/posts', { method: 'POST', body: JSON.stringify({ content }) }), onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }) });
  return <Shell><AuthPanel/><Composer onSubmit={(v) => create.mutate(v)}/><div className="space-y-4">{data.map((p) => <PostCard key={p.id} post={p}/>)}</div></Shell>;
}
