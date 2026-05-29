"use client";
import { useState } from 'react';
import { X, Crown, Shield, EyeOff, Video } from 'lucide-react';

export default function VipModal({ onClose, userId }: { onClose: () => void, userId: string }) {
  const [loading, setLoading] = useState(false);
  const plans = [
    { id: 'TEST', name: 'ТЕСТОВИЙ ЗАЇЗД', priceUah: '500', priceUsdt: 12, period: '1 місяць', color: 'border-gray-500' },
    { id: 'SEASON', name: 'СЕЗОН', priceUah: '1 200', priceUsdt: 30, period: '3 місяці', color: 'border-primary', popular: true },
    { id: 'LEGEND', name: 'ЛЕГЕНДА', priceUah: '4 000', priceUsdt: 100, period: '1 рік', color: 'border-gold' },
  ];

  const handleBuy = async (plan: string, amount: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/vip', { method: 'POST', body: JSON.stringify({ userId, plan, amount }) });
      const data = await res.json();
      if (data.payUrl) window.location.href = data.payUrl;
    } catch (e) {
      alert("Помилка API.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-surface border border-borderDark rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-textMuted hover:text-white"><X size={24} /></button>
        <div className="p-8 text-center border-b border-borderDark">
           <Crown size={48} className="text-gold mx-auto mb-4" />
           <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-500 uppercase">VIP GOLD КЛУБ</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 p-8">
          {plans.map((p) => (
            <div key={p.id} className={`bg-black border-2 ${p.color} rounded-xl p-6 flex flex-col relative ${p.popular ? 'scale-105' : ''}`}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full">ХІТ ПРОДАЖІВ</div>}
              <h3 className="text-lg font-black text-white mb-1">{p.name}</h3>
              <p className="text-textMuted text-xs font-bold mb-4">{p.period}</p>
              <div className="text-3xl font-black text-white mb-1">₴{p.priceUah}</div>
              <div className="text-gold text-sm font-bold mb-6">~ {p.priceUsdt} USDT</div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-gray-300"><EyeOff size={16} className="text-primary"/> Режим Невидимки</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><Crown size={16} className="text-gold"/> Золотий Нікнейм</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><Video size={16} className="text-blue-400"/> Історії у 4K</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><Shield size={16} className="text-green-400"/> Без реклами</li>
              </ul>
              <button onClick={() => handleBuy(p.id, p.priceUsdt)} disabled={loading} className={`w-full py-3 rounded-lg font-black text-sm uppercase ${p.popular ? 'bg-primary text-white hover:bg-primaryHover' : 'bg-surfaceCard text-white border border-borderDark'}`}>
                {loading ? 'Зєднання...' : 'Оплатити'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
