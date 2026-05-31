'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Shell } from '../../components/shell';
import { api } from '../../lib/api';

const roles = ['USER', 'PREMIUM', 'MODERATOR', 'ADMIN'];
const statuses = ['OPEN', 'REVIEWING', 'RESOLVED', 'REJECTED'];

export default function AdminPage() {
  const qc = useQueryClient();
  const { data: stats } = useQuery<any>({ queryKey: ['admin-stats'], queryFn: () => api('/admin/stats'), retry: false });
  const { data: users = [] } = useQuery<any[]>({ queryKey: ['admin-users'], queryFn: () => api('/admin/users'), retry: false });
  const { data: reports = [] } = useQuery<any[]>({ queryKey: ['admin-reports'], queryFn: () => api('/admin/reports'), retry: false });
  const { data: audit = [] } = useQuery<any[]>({ queryKey: ['admin-audit'], queryFn: () => api('/admin/audit'), retry: false });
  const role = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => api(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role: value }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); qc.invalidateQueries({ queryKey: ['admin-audit'] }); }
  });
  const report = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => api(`/admin/reports/${id}`, { method: 'PATCH', body: JSON.stringify({ status: value }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-reports'] }); qc.invalidateQueries({ queryKey: ['admin-audit'] }); }
  });

  return (
    <Shell>
      <h1 className="mb-5 text-3xl font-black">Адмін-панель</h1>
      <div className="mb-5 grid gap-3 md:grid-cols-4">{Object.entries(stats ?? {}).map(([key, value]) => <div className="card p-4" key={key}><p className="text-sm text-slate-400">{key}</p><b className="text-2xl">{String(value)}</b></div>)}</div>
      <section className="card mb-5 overflow-auto p-4">
        <h2 className="mb-3 font-bold">Користувачі</h2>
        <table className="w-full min-w-[680px] text-sm"><tbody>{users.map((user) => <tr key={user.id} className="border-t border-line"><td className="py-2">@{user.username}</td><td>{user.email}</td><td><select value={user.role} onChange={(e) => role.mutate({ id: user.id, value: e.target.value })}>{roles.map((item) => <option key={item}>{item}</option>)}</select></td></tr>)}</tbody></table>
      </section>
      <section className="card mb-5 overflow-auto p-4">
        <h2 className="mb-3 font-bold">Скарги</h2>
        <table className="w-full min-w-[680px] text-sm"><tbody>{reports.map((item) => <tr key={item.id} className="border-t border-line"><td className="py-2">@{item.author?.username}</td><td>{item.reason}</td><td><select value={item.status} onChange={(e) => report.mutate({ id: item.id, value: e.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table>
      </section>
      <section className="card overflow-auto p-4">
        <h2 className="mb-3 font-bold">Audit Log</h2>
        <table className="w-full min-w-[760px] text-sm"><tbody>{audit.map((item) => <tr key={item.id} className="border-t border-line"><td className="py-2">{new Date(item.createdAt).toLocaleString('uk-UA')}</td><td>{item.actor?.username || 'system'}</td><td>{item.action}</td><td>{item.entity}</td><td>{item.entityId}</td></tr>)}</tbody></table>
      </section>
    </Shell>
  );
}
