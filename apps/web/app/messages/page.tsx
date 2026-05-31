'use client';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Shell } from '../../components/shell';
import { api } from '../../lib/api';
import { useAuthStore } from '../../lib/store';

type User = { id: string; username: string };
type Chat = { id: string; title?: string; members: { user: User }[]; messages: { content: string }[] };
type Message = { id: string; content: string; createdAt: string; author: { username: string } };

export default function MessagesPage() {
  const qc = useQueryClient();
  const me = useAuthStore((s) => s.user);
  const [selected, setSelected] = useState<string>();
  const [memberId, setMemberId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { data: chats = [] } = useQuery<Chat[]>({ queryKey: ['chats'], queryFn: () => api('/chats') });
  const { data: users = [] } = useQuery<User[]>({ queryKey: ['users'], queryFn: () => api('/users'), enabled: Boolean(me?.id) });
  const chatId = selected ?? chats[0]?.id;
  const { data: messages = [] } = useQuery<Message[]>({ queryKey: ['chat-messages', chatId], queryFn: () => api(`/chats/${chatId}/messages`), enabled: Boolean(chatId) });
  const peers = useMemo(() => users.filter((user) => user.id !== me?.id), [users, me?.id]);
  const create = useMutation({
    mutationFn: () => api<Chat>('/chats', { method: 'POST', body: JSON.stringify({ title: title || undefined, isGroup: false, memberIds: [memberId] }) }),
    onSuccess: (chat) => { setSelected(chat.id); setMemberId(''); setTitle(''); qc.invalidateQueries({ queryKey: ['chats'] }); }
  });
  const send = useMutation({
    mutationFn: () => api(`/chats/${chatId}/messages`, { method: 'POST', body: JSON.stringify({ content }) }),
    onSuccess: () => { setContent(''); qc.invalidateQueries({ queryKey: ['chat-messages', chatId] }); qc.invalidateQueries({ queryKey: ['chats'] }); }
  });

  useEffect(() => {
    if (!chatId) return;
    let socket: any;
    import('socket.io-client').then(({ io }) => {
      socket = io(process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:4000');
      socket.emit('chat:join', { chatId });
      socket.on('chat:message', () => qc.invalidateQueries({ queryKey: ['chat-messages', chatId] }));
    });
    return () => socket?.disconnect();
  }, [chatId, qc]);

  const submitChat = (event: FormEvent) => { event.preventDefault(); if (memberId) create.mutate(); };
  const submitMessage = (event: FormEvent) => { event.preventDefault(); if (chatId && content.trim()) send.mutate(); };

  return (
    <Shell>
      <h1 className="mb-5 text-3xl font-black">Повідомлення</h1>
      <form onSubmit={submitChat} className="card mb-5 grid gap-3 p-4">
        <select required value={memberId} onChange={(e) => setMemberId(e.target.value)}>
          <option value="">Обери користувача</option>
          {peers.map((user) => <option key={user.id} value={user.id}>@{user.username}</option>)}
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Назва чату" />
        <button disabled={create.isPending || !memberId} className="bg-brand px-4 py-2 font-semibold text-ink disabled:opacity-50">Створити чат</button>
      </form>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {chats.map((chat) => (
            <button key={chat.id} onClick={() => setSelected(chat.id)} className={`card block w-full p-3 text-left ${chat.id === chatId ? 'border-brand' : ''}`}>
              <b>{chat.title || chat.members.map((member) => member.user.username).join(', ')}</b>
              <span className="block truncate text-sm text-slate-400">{chat.messages?.[0]?.content || 'Історія чату очікує перше повідомлення'}</span>
            </button>
          ))}
        </div>
        <section className="card flex min-h-[420px] flex-col p-4">
          <div className="flex-1 space-y-2 overflow-y-auto">
            {messages.map((message) => <div key={message.id} className="rounded-md bg-white/5 p-3"><b>@{message.author.username}</b><p>{message.content}</p></div>)}
          </div>
          <form onSubmit={submitMessage} className="mt-3 flex gap-2">
            <input required disabled={!chatId} value={content} onChange={(e) => setContent(e.target.value)} className="flex-1" placeholder="Повідомлення" />
            <button disabled={send.isPending || !chatId || !content.trim()} className="bg-brand px-4 py-2 font-semibold text-ink disabled:opacity-50">Надіслати</button>
          </form>
        </section>
      </div>
    </Shell>
  );
}
