'use client';
import Link from 'next/link';
import { Bell, Briefcase, Compass, Crown, Home, MessageCircle, Search, Settings, Shield, Store, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthStore } from '../lib/store';

const nav = [
  ['/', Home, 'Стрічка'], ['/forum', Compass, 'Форум'], ['/communities', Users, 'Спільноти'], ['/messages', MessageCircle, 'Повідомлення'],
  ['/jobs', Briefcase, 'Робота'], ['/marketplace', Store, 'Маркет'], ['/premium', Crown, 'VIP'], ['/search', Search, 'Пошук'], ['/admin', Shield, 'Адмін'], ['/settings', Settings, 'Налаштування']
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const [light, setLight] = useState(false);
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const { data: notifications = [] } = useQuery<any[]>({ queryKey: ['notifications'], queryFn: () => api('/notifications'), enabled: Boolean(token), retry: false });
  const read = useMutation({ mutationFn: (id: string) => api(`/notifications/${id}/read`, { method: 'PATCH', body: '{}' }), onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) });

  useEffect(() => {
    if (!user?.id) return;
    let socket: any;
    import('socket.io-client').then(({ io }) => {
      socket = io(process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:4000');
      socket.emit('presence:online', { userId: user.id });
      socket.on(`notification:${user.id}`, () => qc.invalidateQueries({ queryKey: ['notifications'] }));
    });
    return () => socket?.disconnect();
  }, [qc, user?.id]);

  return (
    <main className={light ? 'light min-h-screen' : 'min-h-screen bg-ink text-slate-100'}>
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr_300px]">
        <aside className="border-line bg-panel/90 sticky top-0 z-10 flex h-auto gap-2 overflow-x-auto border-b p-3 md:h-screen md:flex-col md:border-b-0 md:border-r">
          <Link href="/" className="mb-2 hidden text-2xl font-black tracking-normal text-brand md:block">Хоботня</Link>
          {nav.map(([href, Icon, label]) => <Link key={href} href={href} className="flex min-w-fit items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/10"><Icon size={18}/>{label}</Link>)}
        </aside>
        <section className="px-4 py-5 md:px-8">{children}</section>
        <aside className="hidden border-l border-line p-5 md:block">
          <div className="card p-4">
            <div className="mb-3 flex items-center gap-2 font-semibold"><Bell size={18}/>Пульс</div>
            <div className="space-y-2">
              {notifications.slice(0, 5).map((item) => (
                <button key={item.id} onClick={() => read.mutate(item.id)} className="block w-full rounded-md bg-white/5 p-2 text-left text-sm hover:bg-white/10">
                  <span className="font-semibold">{item.title}</span>
                  <span className="block text-slate-400">{item.body}</span>
                </button>
              ))}
              {!notifications.length && <p className="text-sm text-slate-400">Сповіщення зʼявляться після дій інших користувачів.</p>}
            </div>
            <button onClick={() => setLight(!light)} className="mt-4 w-full bg-brand px-3 py-2 text-sm font-semibold text-ink">Тема</button>
          </div>
        </aside>
      </div>
    </main>
  );
}
