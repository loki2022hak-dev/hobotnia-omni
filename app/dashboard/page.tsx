"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Flag, Wallet, Zap, Trophy, Play, Skull, Send, ShoppingCart, 
  MessageSquare, Star, Target, Flame, Gauge, Ticket, Volume2, VolumeX
} from "lucide-react";

export default function HobotniaCinematicEdition() {
  const [userId] = useState("default-user-id");
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"race" | "garage" | "social">("race");
  const [rooms, setRooms] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  // СТЕНД РЕЖИСЕРА: Етапи заставки ("video" -> "quote" -> "game")
  const [introStep, setIntroStep] = useState<"video" | "quote" | "game">("video");
  const [isMuted, setIsMuted] = useState(true);

  // Стан гонки
  const [raceStatus, setRaceStatus] = useState<"idle" | "racing" | "finished">("idle");
  const [logs, setLogs] = useState<string[]>([]);

  const garageItems = [
    { id: "turbo_v1", name: "Турбіна Garrett", price: 15000, desc: "+10 до Швидкості" },
    { id: "tires_pro", name: "Сліки Michelin", price: 8000, desc: "+15 до Зчеплення" },
    { id: "nitro_stable", name: "Система NOS 2.0", price: 12000, desc: "+12 до Стабільності Нітро" }
  ];

  // Керування кінематографом
  useEffect(() => {
    if (introStep === "video") {
      // Через 8 секунд відео перемикається на чорний екран з текстом
      const videoTimer = setTimeout(() => {
        setIntroStep("quote");
      }, 8500);
      return () => clearTimeout(videoTimer);
    }

    if (introStep === "quote") {
      // Пауза на глибокі думки про життя (5 секунд) перед пуском у гру
      const quoteTimer = setTimeout(() => {
         setIntroStep("game");
      }, 5500);
      return () => clearTimeout(quoteTimer);
    }
  }, [introStep]);

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

  const handleActivatePromo = async () => {
    if (!promoInput.trim()) return;
    const res = await fetch("/api/promo", {
      method: "POST",
      body: JSON.stringify({ userId, code: promoInput })
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      setPromoInput("");
      loadData();
    } else {
      alert(data.error);
    }
  };

  const handleStartServerRace = async (room: any) => {
    setRaceStatus("racing");
    setLogs(["⚡ [СЕРВЕР]: Обчислення аеродинаміки, зчеплення та впорскування палива..."]);

    const res = await fetch("/api/rooms/simulate", {
      method: "POST",
      body: JSON.stringify({ roomId: room.id, userId })
    });
    const data = await res.json();

    setTimeout(() => {
      setRaceStatus("finished");
      setLogs(data.logs);
      loadData();
    }, 2500);
  };

  const buyItem = async (item: any) => {
    const res = await fetch("/api/garage/buy", {
      method: "POST",
      body: JSON.stringify({ userId, itemId: item.id })
    });
    if (res.ok) {
      alert("Деталь успішно встановлена!");
      loadData();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

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

  // 1. ЕКРАН ВІДЕО ЗАСТАВКИ (МОТО АДРЕНАЛІН)
  if (introStep === "video") {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-hidden flex items-center justify-center">
        {/* Використовуємо зациклений атмосферний мото-футаж високої якості без копірайту */}
        <iframe 
          className="absolute w-screen h-screen object-cover scale-125 pointer-events-none border-0"
          src={`https://www.youtube.com/embed/5-b076HhYF4?autoplay=1&controls=0&mute=${isMuted ? 1 : 0}&loop=1&playlist=5-b076HhYF4&start=12`}
          allow="autoplay; encrypted-media"
        />
        
        {/* Градієнтне затемнення поверх відео для кінематографічності */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />

        <div className="absolute bottom-10 right-10 flex gap-4 z-50">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all border border-white/20"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <button 
            onClick={() => setIntroStep("quote")} 
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all"
          >
            Пропустити інтро
          </button>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_5px_15px_rgba(255,0,0,0.5)]">ХОБОТНЯ</h1>
          <p className="text-xs md:text-sm font-bold tracking-widest text-red-500 font-mono mt-2 uppercase">Адреналін заливає вени. Ризик формує характер.</p>
        </div>
      </div>
    );
  }

  // 2. ЧОРНИЙ ЕКРАН ТА ФІЛОСОФСЬКИЙ НАПИС (ЖИТТЄВИЙ ПАТТЕРН)
  if (introStep === "quote") {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 animate-fade-in select-none">
        <div className="max-w-2xl text-center space-y-6">
          <p className="text-xl md:text-3xl font-black font-serif italic text-zinc-100 leading-relaxed tracking-wide animate-pulse">
            «Гроші приходять і йдуть... Друзі, з якими ти ділив останній літр бензину, стають чужими через пачку купюр. А зрада... зрада завжди стріляє точно в спину від тих, кому ти довіряв свій руль. В цій грі немає правил. Тут є тільки швидкість і твій чистий розрахунок.»
          </p>
          <div className="h-[2px] w-24 bg-red-600 mx-auto mt-4" />
          <p className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">Завантаження тіньового синдикату...</p>
        </div>
      </div>
    );
  }

  // 3. ОСНОВНИЙ ІГРОВИЙ ІНТЕРФЕЙС
  if (!user) return <div className="h-screen bg-black flex items-center justify-center font-mono text-red-600">СИНХРОНІЗАЦІЯ ПРОФІЛЮ...</div>;

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 flex font-sans animate-fade-in">
      {/* NAVIGATION */}
      <nav className="w-20 bg-black border-r border-zinc-900 flex flex-col items-center py-8 gap-8">
        <div className="text-red-600 font-black text-2xl italic">Х</div>
        <button onClick={() => setActiveTab("race")} className={`p-3 rounded-xl ${activeTab === 'race' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><Flag /></button>
        <button onClick={() => setActiveTab("garage")} className={`p-3 rounded-xl ${activeTab === 'garage' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><ShoppingCart /></button>
        <button onClick={() => setActiveTab("social")} className={`p-3 rounded-xl ${activeTab === 'social' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><MessageSquare /></button>
      </nav>

      {/* CONTENT AREA */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-zinc-900 px-8 flex items-center justify-between bg-black/50 backdrop-blur-md">
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
               <Wallet className="h-4 w-4 text-emerald-400" />
               <span className="text-emerald-400 font-mono font-bold">₴ {user.balance.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-sm font-bold italic">{user.nickname}</span>
             <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold">{user.vip?.isActive ? "VIP" : "FREE"}</span>
          </div>
        </header>

        <div className="p-8 overflow-y-auto">
          {activeTab === "race" && (
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-8 space-y-6">
                {raceStatus === "racing" || raceStatus === "finished" ? (
                  <div className="bg-zinc-900/50 rounded-3xl p-8 border border-red-600/20">
                    <h2 className="text-xl font-black italic mb-6 uppercase flex items-center gap-2"><Flame className="text-red-600" /> СЕРВЕРНИЙ СИМУЛЯТОР МАТЧУ</h2>
                    <div className="bg-black p-6 rounded-xl font-mono text-sm text-zinc-300 min-h-[150px] space-y-2 border border-zinc-800">
                      {logs.map((l, i) => <div key={i} className="border-l-2 border-red-600 pl-2">{l}</div>)}
                    </div>
                    {raceStatus === "finished" && (
                      <button onClick={() => setRaceStatus("idle")} className="mt-4 px-6 py-2 bg-zinc-800 text-white rounded-xl text-xs font-bold hover:bg-zinc-700">Вийти в лобі</button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {rooms.filter(r => r.status === "Очікування").map(r => (
                      <div key={r.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between group">
                         <div className="flex justify-between mb-4">
                            <span className="font-bold uppercase italic text-sm">{r.name}</span>
                            <span className="text-emerald-400 font-mono text-sm">₴ {r.bet}</span>
                         </div>
                         <button onClick={() => handleStartServerRace(r)} className="w-full py-3 bg-red-600 text-white font-black uppercase text-xs rounded-xl hover:bg-red-500 transition-all">СТАРТ НА СЕРВЕРІ</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-4 space-y-6">
                 <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                    <h3 className="text-xs font-black uppercase text-zinc-400 flex items-center gap-2"><Ticket className="h-4 w-4 text-red-500" /> Активація Промокоду</h3>
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={promoInput} 
                         onChange={e => setPromoInput(e.target.value)} 
                         placeholder="Код (напр. START2026)" 
                         className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-red-600 font-mono text-white" 
                       />
                       <button onClick={handleActivatePromo} className="px-4 py-2 bg-zinc-100 text-black font-black text-xs rounded-xl hover:bg-white transition-all">OK</button>
                    </div>
                 </div>

                 <div className="bg-gradient-to-br from-zinc-900 to-black p-6 rounded-3xl border border-zinc-800 text-center">
                    <Gauge className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-xs font-bold text-zinc-400 uppercase">Твій Тюнінг</div>
                    <div className="text-2xl font-black italic text-white mt-1">SPD: {user.stats?.speed} | GRP: {user.stats?.grip}</div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === "garage" && (
            <div className="grid grid-cols-3 gap-6">
               {garageItems.map(item => (
                 <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition-all">
                    <div className="text-lg font-bold">{item.name}</div>
                    <div className="text-xs text-zinc-500">{item.desc}</div>
                    <div className="text-xl font-mono text-emerald-400 font-bold">₴ {item.price.toLocaleString()}</div>
                    <button 
                      onClick={() => buyItem(item)}
                      disabled={user.purchasedItems?.includes(item.id)}
                      className="w-full py-2.5 rounded-xl font-black uppercase text-xs border border-zinc-700 hover:bg-white hover:text-black transition-all disabled:opacity-30"
                    >
                      {user.purchasedItems?.includes(item.id) ? "Встановлено" : "Купити апгрейд"}
                    </button>
                 </div>
               ))}
            </div>
          )}

          {activeTab === "social" && (
            <div className="max-w-xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col h-[500px] overflow-hidden">
               <div className="p-4 border-b border-zinc-800 font-black text-xs uppercase text-zinc-400 flex items-center gap-2"><MessageSquare className="text-red-600" /> Стрічка ЧАТУ</div>
               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((m: any) => (
                    <div key={m.id} className="text-xs font-mono">
                       <span className="text-red-500 font-bold">@{m.user.nickname}: </span>
                       <span className="text-zinc-300">{m.text}</span>
                    </div>
                  ))}
               </div>
               <div className="p-3 bg-black/40 border-t border-zinc-800 flex gap-2">
                  <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Повідомлення..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-1.5 text-xs text-white focus:outline-none" />
                  <button onClick={sendMessage} className="p-2 bg-red-600 rounded-xl text-white"><Send className="h-3.5 w-3.5" /></button>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
