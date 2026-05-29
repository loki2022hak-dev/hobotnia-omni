"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Flag, Wallet, Zap, Trophy, Play, Skull, Send, ShoppingCart, 
  MessageSquare, Star, Target, ShieldCheck, Flame, Gauge
} from "lucide-react";

export default function HobotniaUltra() {
  const [userId] = useState("default-user-id");
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"race" | "garage" | "social">("race");
  const [rooms, setRooms] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  // Стан гонки
  const [raceStatus, setRaceStatus] = useState<"idle" | "racing" | "finished">("idle");
  const [participants, setParticipants] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const garageItems = [
    { id: "turbo_v1", name: "Турбіна Garrett", price: 15000, desc: "+10 до Швидкості", boost: { type: "speed", value: 10 } },
    { id: "tires_pro", name: "Сліки Michelin", price: 8000, desc: "+15 до Зчеплення", boost: { type: "grip", value: 15 } },
    { id: "nitro_stable", name: "Система NOS 2.0", price: 12000, desc: "+12 до Стабільності Нітро", boost: { type: "nitro", value: 12 } }
  ];

  const missions = [
    { id: 1, title: "Перша кров", desc: "Виграй 1 заїзд", reward: "₴ 2,000", done: false },
    { id: 2, title: "Мажор", desc: "Купи будь-яку деталь", reward: "500 EXP", done: false }
  ];

  const loadData = async () => {
    const uRes = await fetch(`/api/user/profile?userId=${userId}`);
    if (uRes.ok) {
      const data = await uRes.json();
      setUser(data.profile);
    }
    const rRes = await fetch("/api/rooms");
    if (rRes.ok) setRooms(await rRes.json());
    
    const cRes = await fetch("/api/chat");
    if (cRes.ok) setChatMessages(await cRes.json());
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ userId, text: chatInput })
    });
    if (res.ok) {
      setChatInput("");
      loadData();
    }
  };

  const buyItem = async (item: any) => {
    const res = await fetch("/api/garage/buy", {
      method: "POST",
      body: JSON.stringify({ userId, itemId: item.id, price: item.price, statBoost: item.boost })
    });
    if (res.ok) {
      alert(`Вітаємо! ${item.name} встановлено.`);
      loadData();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  const startRace = (room: any) => {
    setRaceStatus("racing");
    setLogs(["🚦 Світлофор: ЧЕРВОНИЙ... ЖОВТИЙ... ЗЕЛЕНИЙ!"]);
    setParticipants([
      { id: userId, name: "ТИ", progress: 0, busted: false },
      { id: "bot1", name: "Степан на Блясі", progress: 0, busted: false },
      { id: "bot2", name: "Київський Дріфтер", progress: 0, busted: false }
    ]);
  };

  useEffect(() => {
    if (raceStatus !== "racing") return;
    const timer = setInterval(() => {
      setParticipants(prev => {
        const next = prev.map(p => {
          if (p.busted || p.progress >= 100) return p;
          const boost = p.id === userId ? (user.speed / 10) : Math.random() * 5;
          const newProgress = p.progress + Math.random() * 5 + boost;
          if (newProgress >= 100) {
            setRaceStatus("finished");
            setLogs(l => [...l, `🏁 ПЕРЕМОЖЕЦЬ: ${p.name}!`]);
            fetch("/api/rooms/resolve", {
              method: "POST",
              body: JSON.stringify({ roomId: "some-id", winnerId: p.id === userId ? userId : "bot" })
            }).then(() => loadData());
          }
          return { ...p, progress: Math.min(newProgress, 100) };
        });
        return next;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [raceStatus]);

  if (!user) return <div className="h-screen bg-black flex items-center justify-center font-mono text-red-600 animate-pulse">ПІДКЛЮЧЕННЯ ДО ХОБОТНІ...</div>;

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 flex font-sans">
      {/* LEFT NAV */}
      <nav className="w-20 bg-black border-r border-zinc-900 flex flex-col items-center py-8 gap-8">
        <div className="text-red-600 font-black text-2xl italic">Х</div>
        <button onClick={() => setActiveTab("race")} className={`p-3 rounded-xl ${activeTab === 'race' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><Flag /></button>
        <button onClick={() => setActiveTab("garage")} className={`p-3 rounded-xl ${activeTab === 'garage' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><ShoppingCart /></button>
        <button onClick={() => setActiveTab("social")} className={`p-3 rounded-xl ${activeTab === 'social' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><MessageSquare /></button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-16 border-b border-zinc-900 px-8 flex items-center justify-between bg-black/50 backdrop-blur-md">
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
               <Wallet className="h-4 w-4 text-emerald-400" />
               <span className="text-emerald-400 font-mono font-bold">₴ {user.balance.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
               <Star className="h-4 w-4 text-amber-400" />
               <span className="text-zinc-400 uppercase">Рівень {user.level || 1}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-sm font-bold italic">{user.nickname}</span>
             <div className="w-8 h-8 bg-gradient-to-tr from-red-600 to-amber-500 rounded-full border border-white/10" />
          </div>
        </header>

        <div className="p-8 overflow-y-auto">
          {activeTab === "race" && (
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-8 space-y-6">
                {raceStatus === "racing" ? (
                  <div className="bg-zinc-900/50 rounded-3xl p-8 border border-red-600/20">
                    <h2 className="text-2xl font-black italic mb-8 uppercase flex items-center gap-3"><Flame className="text-red-600" /> LIVE: НІЧНА ЗАРУБА</h2>
                    <div className="space-y-6">
                      {participants.map(p => (
                        <div key={p.id}>
                          <div className="flex justify-between text-xs font-mono mb-2"><span>{p.name}</span><span>{Math.round(p.progress)}%</span></div>
                          <div className="h-4 bg-black rounded-full overflow-hidden border border-zinc-800">
                             <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${p.progress}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 bg-black p-4 rounded-xl font-mono text-xs text-zinc-500 h-32 overflow-y-auto">
                      {logs.map((l, i) => <div key={i}>{l}</div>)}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {rooms.map(r => (
                      <div key={r.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-red-600/50 transition-all group">
                         <div className="flex justify-between mb-4">
                            <span className="font-bold uppercase italic">{r.name}</span>
                            <span className="text-emerald-400 font-mono">₴ {r.bet}</span>
                         </div>
                         <button onClick={() => startRace(r)} className="w-full py-3 bg-white text-black font-black uppercase text-xs rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all">Вступити в заїзд</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="col-span-4 space-y-6">
                 <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                    <h3 className="text-xs font-black uppercase text-zinc-500 mb-4 flex items-center gap-2"><Target className="h-4 w-4" /> Щоденні контракти</h3>
                    <div className="space-y-3">
                       {missions.map(m => (
                         <div key={m.id} className="p-3 bg-black rounded-xl border border-zinc-800 flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity">
                            <div><div className="text-xs font-bold">{m.title}</div><div className="text-[10px] text-zinc-500">{m.desc}</div></div>
                            <div className="text-[10px] text-emerald-400 font-bold">{m.reward}</div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-gradient-to-br from-red-600 to-red-900 p-6 rounded-3xl shadow-xl shadow-red-900/20">
                    <h3 className="text-xs font-black uppercase text-white/80 mb-2">Твоя Тачка</h3>
                    <div className="flex justify-between items-end">
                       <div className="space-y-1">
                          <div className="text-3xl font-black italic">H-OBOT 2000</div>
                          <div className="text-[10px] font-mono text-white/60">Speed: {user.speed} | Grip: {user.grip}</div>
                       </div>
                       <Gauge className="h-12 w-12 text-white/20" />
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === "garage" && (
            <div className="grid grid-cols-3 gap-6">
               {garageItems.map(item => (
                 <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:bg-zinc-800/50 transition-all">
                    <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500"><Zap /></div>
                    <div>
                       <div className="text-lg font-bold">{item.name}</div>
                       <div className="text-sm text-zinc-500">{item.desc}</div>
                    </div>
                    <div className="text-xl font-mono text-emerald-400 font-bold">₴ {item.price.toLocaleString()}</div>
                    <button 
                      onClick={() => buyItem(item)}
                      disabled={user.purchasedItems.includes(item.id)}
                      className="w-full py-3 rounded-xl font-black uppercase text-xs border border-zinc-700 hover:bg-white hover:text-black transition-all disabled:opacity-30"
                    >
                      {user.purchasedItems.includes(item.id) ? "Встановлено" : "Купити"}
                    </button>
                 </div>
               ))}
            </div>
          )}

          {activeTab === "social" && (
            <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col h-[600px] overflow-hidden">
               <div className="p-6 border-b border-zinc-800 font-black italic flex items-center gap-2"><MessageSquare className="text-red-600" /> ГЛОБАЛЬНИЙ ЧАТ</div>
               <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatMessages.map((m: any) => (
                    <div key={m.id} className="flex gap-3">
                       <div className="text-[10px] font-mono text-red-600 font-bold uppercase mt-1">[{m.user.nickname}]</div>
                       <div className="text-sm text-zinc-300 bg-black/40 px-3 py-2 rounded-2xl rounded-tl-none border border-zinc-800/50">{m.text}</div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
               </div>
               <div className="p-4 bg-black/50 border-t border-zinc-800 flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Напиши щось хоботам..." 
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-600" 
                  />
                  <button onClick={sendMessage} className="p-3 bg-red-600 rounded-xl hover:bg-red-500 transition-all"><Send className="h-4 w-4" /></button>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
