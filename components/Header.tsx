import { Search, Home, Users, MessageCircle, MonitorPlay, Bell, ChevronDown, Plus } from 'lucide-react';
export default function Header() {
  return (
    <header className="h-[72px] border-b border-borderDark bg-[#0a0a0a] flex items-center justify-between px-6 flex-shrink-0">
      <div className="relative w-[280px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={16} />
        <input type="text" placeholder="Пошук" className="w-full bg-surfaceCard border border-borderDark rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-textMuted outline-none focus:border-primary transition-colors" />
      </div>
      <div className="flex items-center gap-8">
        <Home className="text-textMuted hover:text-white cursor-pointer" size={24} />
        <Users className="text-textMuted hover:text-white cursor-pointer" size={24} />
        <MessageCircle className="text-textMuted hover:text-white cursor-pointer" size={24} />
        <MonitorPlay className="text-textMuted hover:text-white cursor-pointer" size={24} />
        <Bell className="text-textMuted hover:text-white cursor-pointer" size={24} />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-surfaceCard border border-gold/30 rounded-full pl-4 pr-1 py-1">
          <span className="text-gold font-mono font-bold text-sm mr-3">₴ 12 450.00</span>
          <button className="bg-primary text-white p-1 rounded-full hover:bg-primaryHover"><Plus size={16} /></button>
        </div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-white group-hover:text-primary">ХОБОТ</div>
            <div className="text-[10px] text-gold font-bold">VIP Gold</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-surfaceCard border-2 border-gold p-[2px]">
            <img src="https://images.unsplash.com/photo-1541535881962-3bb380b08458?q=80&w=200&auto=format&fit=crop" alt="Avatar" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
