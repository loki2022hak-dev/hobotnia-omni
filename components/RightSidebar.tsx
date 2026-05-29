import { Search, Plus } from 'lucide-react';
export default function RightSidebar() {
  const chats = [
    { name: 'Toretto', msg: 'Давай на перегон?', time: '10:30', unread: 2, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop' },
    { name: 'NightRider', msg: 'Гоу сьогодні ввечері', time: '10:21', unread: 1, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop' }
  ];
  return (
    <aside className="w-[320px] h-full bg-[#0a0a0a] border-l border-borderDark flex flex-col flex-shrink-0">
      <div className="p-6 pb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white tracking-widest uppercase">ЧАТИ</h2>
        <button className="text-textMuted hover:text-white"><Plus size={20}/></button>
      </div>
      <div className="px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={16} />
          <input type="text" placeholder="Пошук" className="w-full bg-surfaceCard border border-borderDark rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-textMuted outline-none focus:border-primary" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
        {chats.map((chat, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surfaceCard cursor-pointer">
            <div className="relative">
              <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="text-sm font-bold text-white truncate">{chat.name}</h4>
                <span className="text-[10px] text-textMuted">{chat.time}</span>
              </div>
              <p className={`text-xs truncate ${chat.unread > 0 ? 'text-white font-semibold' : 'text-textMuted'}`}>{chat.msg}</p>
            </div>
            {chat.unread > 0 && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">{chat.unread}</div>}
          </div>
        ))}
      </div>
    </aside>
  );
}
