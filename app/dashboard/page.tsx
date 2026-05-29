"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Home, MessageSquare, History, Users, Flag, Wallet, Shield, 
  Heart, MessageCircle, Plus, Search, UserCheck, 
  Send, Award, Bell, ChevronDown, Check
} from "lucide-react";

interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  image: string;
  likes: number;
  comments: number;
  liked: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
}

interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  messages: ChatMessage[];
  count: number;
}

interface RacingRoom {
  id: string;
  name: string;
  bet: number;
  playersCount: number;
  playersMax: number;
  status: "В процесі" | "Очікування";
  trackName: string;
  trackLength: string;
  trackType: string;
  turns: number;
  leaderboard: { pos: number; name: string; gap: string; isUser: boolean }[];
}

export default function HobotniaDashboard() {
  // Тимчасовий захардкоджений ID користувача для лінкування з БД (поки немає сесії auth)
  const [userId] = useState<string>("default-user-id");
  
  const [balance, setBalance] = useState<number>(12450.00);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeChatId, setActiveChatId] = useState<string>("1");
  const [chatInput, setChatInput] = useState<string>("");
  const [stats, setStats] = useState({ speed: 40, grip: 30, nitro: 30 });
  const [vipTier, setVipTier] = useState<string>("GOLD");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [roomNameInput, setRoomNameInput] = useState<string>("Нічні гонки");
  const [roomBetSelect, setRoomBetSelect] = useState<number>(5000);
  const [roomPlayersSelect, setRoomPlayersSelect] = useState<number>(4);
  const [roomTypeSelect, setRoomTypeSelect] = useState<string>("Класичний");

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "feed-1",
      author: "NightRider",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      time: "2 год тому",
      text: "Нічне місто. Швидкість. Свобода. Тестуємо новий кастомний обвіс біля центрального мосту. Хто в лобі?",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80",
      likes: 128,
      comments: 24,
      liked: false
    }
  ]);

  const [rooms, setRooms] = useState<RacingRoom[]>([
    {
      id: "room-2781",
      name: "КІМНАТА #2781",
      bet: 5000,
      playersCount: 4,
      playersMax: 4,
      status: "В процесі",
      trackName: "Нічне місто",
      trackLength: "5.2 км",
      trackType: "Кільцевий",
      turns: 12,
      leaderboard: [
        { pos: 1, name: "Toretto", gap: "Лідер", isUser: false },
        { pos: 2, name: "ХОБОТ", gap: "+0.42s", isUser: true },
        { pos: 3, name: "Shadow", gap: "+1.15s", isUser: false }
      ]
    }
  ]);

  const [chats, setChats] = useState<ChatThread[]>([
    {
      id: "1",
      name: "Toretto",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      count: 2,
      messages: [
        { id: "m1", sender: "Toretto", text: "Здорово! Готовий виїхати сьогодні на treк?", time: "10:15" },
        { id: "m2", sender: "ХОБОТ", text: "Привіт. Так, зараз підкручу нітро в гаражі й залітаю.", time: "10:20" },
        { id: "m3", sender: "Toretto", text: "Давай на перегон? Я створив кімнату, чекаю ставку.", time: "10:30" }
      ]
    }
  ]);

  // Стягуємо VIP-профіль з сервера при завантаженні сторінки
  useEffect(() => {
    async function loadVipProfile() {
      try {
        const res = await fetch(`/api/vip?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setBalance(data.user.balance);
          setStats({
            speed: data.user.speed,
            grip: data.user.grip,
            nitro: data.user.nitro
          });
          setVipTier(data.vipStatus);
        }
      } catch (err) {
        console.error("Помилка завантаження профілю з API:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadVipProfile();
  }, [userId]);

  const totalStatsPoints = useMemo(() => stats.speed + stats.grip + stats.nitro, [stats]);

  const activeChat = useMemo(() => {
    return chats.find(c => c.id === activeChatId) || chats[0];
  }, [chats, activeChatId]);

  const filteredRooms = useMemo(() => {
    if (!searchQuery.trim()) return rooms;
    return rooms.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.trackName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rooms, searchQuery]);

  // Зміна повзунків з автоматичним збереженням в БД через POST /api/vip
  const handleStatSliderChange = async (statName: keyof typeof stats, value: number) => {
    const freshStats = { ...stats, [statName]: value };
    if (freshStats.speed + freshStats.grip + freshStats.nitro <= 100) {
      setStats(freshStats);
      
      // Відправляємо конфіг на сервер без затримок
      try {
        await fetch("/api/vip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, ...freshStats })
        });
      } catch (err) {
        console.error("Помилка синхронізації конфігу:", err);
      }
    }
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handleCreateRoom = () => {
    if (!roomNameInput.trim() || balance < roomBetSelect) return;

    const newRoom: RacingRoom = {
      id: `room-${Date.now()}`,
      name: roomNameInput.toUpperCase(),
      bet: roomBetSelect,
      playersCount: 1,
      playersMax: roomPlayersSelect,
      status: "Очікування",
      trackName: roomTypeSelect === "Дрифт" ? "Токіо Спуск" : "Північне Кільце",
      trackLength: roomTypeSelect === "Дрифт" ? "3.5 км" : "4.8 км",
      trackType: roomTypeSelect,
      turns: roomTypeSelect === "Дрифт" ? 18 : 8,
      leaderboard: [{ pos: 1, name: "ХОБОТ", gap: "Лідер", isUser: true }]
    };

    setRooms(prev => [newRoom, ...prev]);
    setBalance(prev => prev - roomBetSelect);
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChats(prev => prev.map(c => c.id === activeChatId ? {
      ...c,
      messages: [...c.messages, { id: `msg-${Date.now()}`, sender: "ХОБОТ", text: chatInput, time: new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }) }]
    } : c));
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 font-sans antialiased selection:bg-red-600">
      <div className="flex min-h-screen">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-[240px] bg-[#0c0c12] border-r border-zinc-900 flex flex-col justify-between p-4 flex-shrink-0">
          <div className="space-y-7">
            <div className="pt-2 px-2">
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">ХОБОТНЯ</h1>
              <p className="text-[10px] text-red-600 font-bold tracking-widest uppercase italic mt-1">живи на швидкості</p>
            </div>

            <div className="space-y-6">
              <div>
                <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-2">Соцмережа</p>
                <nav className="space-y-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium bg-red-600/10 text-white rounded-lg border-l-2 border-red-600"><Home className="h-4 w-4 text-red-500" /> Головна</button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg"><MessageSquare className="h-4 w-4 text-zinc-500" /> Месенджер</button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg"><History className="h-4 w-4 text-zinc-500" /> Історії</button>
                </nav>
              </div>

              <div>
                <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-2">Онлайн-перегони</p>
                <nav className="space-y-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg"><Flag className="h-4 w-4 text-zinc-500" /> Перегони</button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg"><Wallet className="h-4 w-4 text-zinc-500" /> Гаманець</button>
                </nav>
              </div>
            </div>
          </div>

          {/* PRESET CONFIGURATOR */}
          <div className="bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 border border-zinc-800/60 rounded-xl p-3 space-y-2">
            <span className="text-[10px] text-zinc-500 font-mono block text-center uppercase">Конфіг (Max 100)</span>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono"><span className="text-zinc-400">ШВИДКІСТЬ</span><span className="text-red-500 font-bold">{stats.speed}</span></div>
              <input type="range" min="0" max="100" value={stats.speed} onChange={(e) => handleStatSliderChange("speed", parseInt(e.target.value))} className="w-full accent-red-600 bg-zinc-800 h-1 appearance-none cursor-pointer" />
              
              <div className="flex justify-between text-[10px] font-mono"><span className="text-zinc-400">ЗЧЕПЛЕННЯ</span><span className="text-red-500 font-bold">{stats.grip}</span></div>
              <input type="range" min="0" max="100" value={stats.grip} onChange={(e) => handleStatSliderChange("grip", parseInt(e.target.value))} className="w-full accent-red-600 bg-zinc-800 h-1 appearance-none cursor-pointer" />
              
              <div className="flex justify-between text-[10px] font-mono"><span className="text-zinc-400">НІТРО</span><span className="text-red-500 font-bold">{stats.nitro}</span></div>
              <input type="range" min="0" max="100" value={stats.nitro} onChange={(e) => handleStatSliderChange("nitro", parseInt(e.target.value))} className="w-full accent-red-600 bg-zinc-800 h-1 appearance-none cursor-pointer" />
            </div>
            <div className="text-[9px] font-mono flex justify-between text-zinc-500"><span>РАЗОМ:</span><span className="text-emerald-400">{totalStatsPoints}/100</span></div>
          </div>
        </aside>

        {/* WORKSPACE */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 bg-[#0c0c12] border-b border-zinc-900 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded text-white text-xs font-black uppercase tracking-wider italic"><Flag className="h-3.5 w-3.5" /> ХОБОТНЯ</div>
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Пошук кімнати чи треку..." className="w-full bg-[#11111a] border border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-red-600" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#11111a] border border-zinc-800 rounded-lg px-3 py-1 flex items-center gap-3 font-mono text-xs">
                <span className="text-emerald-400 font-bold">₴ {balance.toLocaleString('uk-UA')}</span>
                <button onClick={() => setBalance(prev => prev + 5000)} className="bg-red-600 hover:bg-red-500 text-white p-0.5 rounded"><Plus className="h-3 w-3" /></button>
              </div>

              <div className="flex items-center gap-2.5 border-l border-zinc-800 pl-4">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80" alt="Avatar" className="w-7 h-7 rounded-full border border-amber-500 object-cover" />
                <span className="text-[11px] font-bold text-zinc-200">ХОБОТ</span>
                <ChevronDown className="h-3 w-3 text-zinc-500" />
              </div>
            </div>
          </header>

          <div className="flex-1 p-5 overflow-y-auto space-y-5">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-sm font-mono text-zinc-500">Синхронізація з нодами ХОБОТНІ...</div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                
                {/* FEED & TRACKS */}
                <div className="xl:col-span-9 space-y-5">
                  <div className="bg-[#0c0c12] border border-zinc-900 rounded-xl p-4">
                    <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
                      {chats.map(c => (
                        <div key={c.id} onClick={() => setActiveChatId(c.id)} className="flex flex-col items-center space-y-1.5 flex-shrink-0 cursor-pointer group">
                          <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-red-600 to-amber-500"><img src={c.avatar} alt="" className="w-full h-full rounded-full object-cover border border-zinc-950" /></div>
                          <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="md:col-span-7 space-y-4">
                      {posts.map(post => (
                        <article key={post.id} className="bg-[#0c0c12] border border-zinc-900 rounded-xl p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <img src={post.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                            <div><h4 className="text-xs font-bold text-zinc-200">{post.author}</h4><p className="text-[10px] text-zinc-500">{post.time}</p></div>
                          </div>
                          <p className="text-xs text-zinc-300">{post.text}</p>
                          <div className="rounded-lg overflow-hidden border border-zinc-900 aspect-video"><img src={post.image} alt="" className="w-full h-full object-cover" /></div>
                          <div className="flex items-center gap-4 text-zinc-500 text-xs font-mono">
                            <button onClick={() => handleLikePost(post.id)} className={`flex items-center gap-1.5 ${post.liked ? 'text-red-500' : ''}`}><Heart className="h-3.5 w-3.5 fill-current" /> {post.likes}</button>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="md:col-span-5 space-y-4">
                      {filteredRooms.map(room => (
                        <div key={room.id} className="bg-[#0c0c12] border border-zinc-900 rounded-xl p-4 space-y-3 relative overflow-hidden">
                          <div className="flex justify-between">
                            <div><span className="text-[10px] font-mono font-bold text-zinc-200 block">{room.name}</span><span className="text-[10px] text-zinc-500">Ставка: ₴ {room.bet} | {room.playersCount}/{room.playersMax}</span></div>
                            <span className="text-[8px] bg-red-900/40 text-red-400 px-1.5 py-0.5 rounded font-black uppercase">{room.status}</span>
                          </div>
                          <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-900 text-[10px] text-zinc-400">
                            <div className="text-zinc-200 font-bold">{room.trackName} ({room.trackLength})</div>
                            <div>Конфіг: {room.trackType} | Повороти: {room.turns}</div>
                          </div>
                          <div className="space-y-1 font-mono text-[11px]">
                            {room.leaderboard.map((p, pi) => (
                              <div key={pi} className={`flex justify-between px-2 py-0.5 rounded ${p.isUser ? 'bg-red-600/10 text-red-400 font-bold' : 'text-zinc-500'}`}><span>{p.pos}. {p.name}</span><span>{p.gap}</span></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* MESSENGER PANEL */}
                <div className="xl:col-span-3">
                  <div className="bg-[#0c0c12] border border-zinc-900 rounded-xl p-4 flex flex-col h-full min-h-[440px]">
                    <span className="text-xs font-bold uppercase text-zinc-300 block border-b border-zinc-900 pb-2 mb-2">Чати</span>
                    <div className="space-y-1 overflow-y-auto max-h-[120px] mb-2">
                      {chats.map(c => (
                        <div key={c.id} onClick={() => setActiveChatId(c.id)} className={`p-2 rounded flex items-center justify-between cursor-pointer border ${activeChatId === c.id ? 'bg-red-600/10 border-red-600/30' : 'border-transparent'}`}>
                          <span className="text-xs text-zinc-300 font-bold">{c.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 p-1 bg-zinc-950/40 rounded mb-2 max-h-[200px]">
                      {activeChat.messages.map(m => (
                        <div key={m.id} className={`text-xs p-2 rounded max-w-[85%] ${m.sender === 'ХОБОТ' ? 'bg-red-600/10 border border-red-600/20 ml-auto' : 'bg-zinc-900'}`}>
                          <div className="text-[9px] text-zinc-500 font-mono flex justify-between mb-0.5"><span>{m.sender}</span><span>{m.time}</span></div>
                          <p className="text-zinc-200 break-words">{m.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()} placeholder="Повідомлення..." className="w-full bg-zinc-950 border border-zinc-900 rounded px-2 py-1 text-xs text-white focus:outline-none" />
                      <button onClick={handleSendChatMessage} className="p-2 bg-red-600 rounded text-white"><Send className="h-3 w-3" /></button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* CREATION ENGINE FOOTER ROW */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
              <div className="xl:col-span-4 bg-[#0c0c12] border border-zinc-900 rounded-xl p-4">
                <span className="text-xs font-bold uppercase text-zinc-400 block border-b border-zinc-900 pb-2 mb-2">Аналітика нод</span>
                <div className="h-20 bg-zinc-950 rounded relative">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none"><path d="M 0 25 Q 25 5 50 20 T 100 10 L 100 30 L 0 30 Z" fill="#dc2626" fillOpacity="0.1" /><path d="M 0 25 Q 25 5 50 20 T 100 10" fill="none" stroke="#dc2626" strokeWidth="1" /></svg>
                </div>
              </div>

              <div className="xl:col-span-4 bg-[#0c0c12] border border-zinc-900 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-zinc-400 block border-b border-zinc-900 pb-2 mb-2">Управління кімнатою</span>
                  <input type="text" value={roomNameInput} onChange={(e) => setRoomNameInput(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded p-1.5 text-xs text-white mb-2" placeholder="Назва лобі" />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <select value={roomBetSelect} onChange={(e) => setRoomBetSelect(parseInt(e.target.value))} className="bg-zinc-950 border border-zinc-900 rounded p-1 text-white"><option value={5000}>₴ 5 000</option><option value={10000}>₴ 10 000</option></select>
                    <select value={roomTypeSelect} onChange={(e) => setRoomTypeSelect(e.target.value)} className="bg-zinc-950 border border-zinc-900 rounded p-1 text-white"><option value="Класичний">Класичний</option><option value="Дрифт">Дрифт</option></select>
                  </div>
                </div>
                <button onClick={handleCreateRoom} className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase rounded mt-3">Запустити лобі</button>
              </div>

              <div className="xl:col-span-4 bg-gradient-to-b from-amber-950/20 to-transparent border border-amber-500/20 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase block text-center">VIP {vipTier} МЕТРИКИ</span>
                <p className="text-[10px] text-zinc-400 text-center my-2">0% сервісної комісії активовано для Ваших кастомних кімнат.</p>
                <div className="text-center text-[9px] bg-amber-500/10 text-amber-400 py-1 rounded border border-amber-500/20 font-mono">АКТИВНИЙ ПРЕСЕТ</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
