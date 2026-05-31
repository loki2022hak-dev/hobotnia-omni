'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Crown, ExternalLink, RefreshCw } from 'lucide-react';
import { Shell } from '../../components/shell';
import { api } from '../../lib/api';

type Plan = { code: string; title: string; amountUsd: number; days: number; perks: string[] };
type Payment = { id: string; plan: string; amountUsd: number; invoiceUrl?: string; status: string; createdAt: string };

export default function PremiumPage() {
  const qc = useQueryClient();
  const { data: plans = [] } = useQuery<Plan[]>({ queryKey: ['billing-plans'], queryFn: () => api('/billing/plans') });
  const { data: billing } = useQuery<any>({ queryKey: ['billing-me'], queryFn: () => api('/billing/me'), retry: false });
  const checkout = useMutation({
    mutationFn: (plan: string) => api<Payment>('/billing/checkout', { method: 'POST', body: JSON.stringify({ plan }) }),
    onSuccess: (payment) => {
      qc.invalidateQueries({ queryKey: ['billing-me'] });
      if (payment.invoiceUrl) window.open(payment.invoiceUrl, '_blank', 'noopener,noreferrer');
    }
  });
  const sync = useMutation({
    mutationFn: (id: string) => api(`/billing/payments/${id}/sync`, { method: 'POST', body: '{}' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['billing-me'] })
  });
  const activeUntil = billing?.user?.premiumUntil ? new Date(billing.user.premiumUntil).toLocaleDateString('uk-UA') : undefined;

  return (
    <Shell>
      <div className="mb-6 flex items-center gap-3">
        <Crown className="text-brand" />
        <div>
          <h1 className="text-3xl font-black">VIP підписка</h1>
          <p className="text-sm text-slate-400">{activeUntil ? `Активна до ${activeUntil}` : 'Оплата через Crypto Bot, активація після webhook або ручної перевірки.'}</p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <article className="card flex flex-col p-5" key={plan.code}>
            <h2 className="text-xl font-black">{plan.title}</h2>
            <p className="mt-2 text-3xl font-black text-brand">${plan.amountUsd}</p>
            <p className="text-sm text-slate-400">{plan.days} днів доступу</p>
            <div className="my-4 space-y-2">
              {plan.perks.map((perk) => <p key={perk} className="flex items-center gap-2 text-sm"><Check size={16} className="text-brand" />{perk}</p>)}
            </div>
            <button onClick={() => checkout.mutate(plan.code)} disabled={checkout.isPending} className="mt-auto inline-flex items-center justify-center gap-2 bg-brand px-4 py-3 font-bold text-ink disabled:opacity-50">
              <ExternalLink size={18} /> Оплатити Crypto Bot
            </button>
          </article>
        ))}
      </div>
      <section className="card mt-6 p-4">
        <h2 className="mb-3 font-bold">Платежі</h2>
        <div className="space-y-2">
          {(billing?.payments ?? []).map((payment: Payment) => (
            <div key={payment.id} className="flex flex-col gap-2 rounded-md bg-white/5 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <b>{payment.plan}</b>
                <p className="text-sm text-slate-400">${payment.amountUsd} · {payment.status} · {new Date(payment.createdAt).toLocaleString('uk-UA')}</p>
              </div>
              <div className="flex gap-2">
                {payment.invoiceUrl && <a href={payment.invoiceUrl} target="_blank" rel="noreferrer" className="rounded-md bg-brand px-3 py-2 text-sm font-semibold text-ink">Відкрити оплату</a>}
                {payment.status === 'PENDING' && <button onClick={() => sync.mutate(payment.id)} className="inline-flex items-center gap-2 bg-white/10 px-3 py-2 text-sm font-semibold"><RefreshCw size={14} /> Перевірити</button>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
