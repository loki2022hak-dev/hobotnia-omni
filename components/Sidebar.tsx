import { Home, LayoutGrid, Clock, MessageSquare, Users, Flag, Trophy, Wallet, Crown, Settings } from 'lucide-react';
export default function Sidebar() {
  const menuItems = [
    { icon: Home, label: 'Головна', active: true },
    { icon: LayoutGrid, label: 'Стрічка' },
    { icon: Clock, label: 'Історії' },
    { icon: MessageSquare, label: 'Повідомлення', badge: 3 },
    { icon: Users, label: 'Друзі' },
    { icon: Flag, label: 'Перегони' },
    { icon: Trophy, label: 'Топ перегонів' },
    { icon: Wallet, label: 'Гаманець' },
    { icon: Crown, label: 'VIP Клуб' },
    { icon: Settings, label: 'Налаштування' },
  ];
  return (
    <aside className="w-[260px] h-screen bg-[#050505] border-r border-borderDark flex flex-col flex-shrink-0">
      <div className="p-6">
        <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">ХОБОТНЯ<span className="text-primary">.</span></h1>
        <p className="text-[10px] font-bold text-primary tracking-widest mt-1">ЖИВИ НА ШВИДКОСТІ</p>
      </div>
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {menuItems.map((item, idx) => (
          <button key={idx} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors group ${item.active ? 'bg-primary/10 text-primary' : 'text-textMuted hover:text-white hover:bg-white/5'}`}>
            <div className="flex items-center gap-4">
              <item.icon size={20} className={item.active ? 'text-primary' : 'text-textMuted group-hover:text-white'} />
              <span className={`text-sm font-semibold ${item.active ? 'text-primary' : ''}`}>{item.label}</span>
            </div>
            {item.badge && <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
          </button>
        ))}
      </nav>
      <div className="p-4">
        <button className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3 rounded-lg text-sm transition-colors uppercase tracking-wider shadow-[0_0_15px_rgba(229,9,20,0.4)]">Створити кімнату</button>
      </div>
    </aside>
  );
}
