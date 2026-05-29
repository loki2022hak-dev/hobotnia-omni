"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Flag, Wallet, Zap, Play, Skull, Send, ShoppingCart, 
  MessageSquare, Star, Target, Flame, Gauge, Ticket, Volume2, VolumeX, User, Lock
} from "lucide-react";

export default function HobotniaUltimateEdition() {
  const [userId] = useState("default-user-id");
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"race" | "garage" | "social">("race");
  
  // Списки з бекенду
  const [rooms, setRooms] = useState<any[]>([]);
  const [globalMessages, setGlobalMessages] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  
  // Месенджер стейти
  const [socialMode, setSocialMode] = useState<"global" | "private">("global");
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [privateMessages, setPrivateMessages] = useState<any[]>([]);
  
  // Інпути
  const [chatInput, setChatInput] = useState("");
  const [dmInput, setDmInput] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  // Стенд кінематографу
  const [introStep, setIntroStep] = useState<"video" | "quote" | "game">("video");
  const [isMuted, setIsMuted] = useState(true);

  // Гонка
  const [raceStatus, setRaceStatus] = useState<"idle" | "racing" | "finished">("idle");
  const [logs, setLogs] = useState<string[]>([]);

  const garageItems = [
    { id: "turbo_v1", name: "Турбіна Garrett", price: 15000, desc: "+10 до Швидкості" },
    { id: "tires_pro", name: "Сліки Michelin", price: 8000, desc: "+15 до Зчеплення" },
    { id: "nitro_stable", name: "Система NOS 2.0", price: 12000, desc: "+12 до Стабільності Нітро" }
  ];

  useEffect(() => {
    if (introStep === "video") {
      const t = setTimeout(() => setIntroStep("quote"), 8500);
      return () => clearTimeout(t);
    }
    if (introStep === "quote") {
      const t = setTimeout(() => setIntroStep("game"), 5500);
      return () => clearTimeout(t);
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
    if (cRes.ok) setGlobalMessages(await cRes.json());

    const listRes = await fetch(`/api/users/list?excludeId=${userId}`);
    if (listRes.ok) setContacts(await listRes.ok ? await listRes.json() : []);
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [globalMessages, privateMessages, socialMode]);

  // Завантаження приватної переписки при виборі контакту
  useEffect(() => {
    if (selectedContact) {
      fetch(`/api/messages/dm?userId=${userId}&contactId=${selectedContact.id}`)
        .then(res => res.json())
        .then(data => setPrivateMessages(Array.isArray(data) ? data : []));
    }
  }, [selectedContact]);

  const sendGlobalMessage = async () => {
    if (!chatInput.trim()) return;
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ userId, text: chatInput })
    });
    if (res.ok) { setChatInput(""); loadData(); }
  };

  const sendPrivateMessage = async () => {
    if (!dmInput.trim() || !selectedContact) return;
    const res = await fetch("/api/messages/dm", {
      method: "POST",
      body: JSON.stringify({ senderId: userId, receiverId: selectedContact.id, text: dmInput })
    });
    if (res.ok) {
      setDmInput("");
      // Перезавантажуємо гілку діалогу
      const freshDMs = await fetch(`/api/messages/dm?userId=${userId}&contactId=${selectedContact.id}`).then(r => r.json());
      setPrivateMessages(freshDMs);
    }
  };

  const handleActivatePromo = async () => {
    if (!promoInput.trim()) return;
    const res = await fetch("/api/promo", {
      method: "POST",
      body: JSON.stringify({ userId, code: promoInput })
    });
    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) { setPromoInput(""); loadData(); }
  };

  const handleStartServerRace = async (room: any) => {
    setRaceStatus("racing");
    setLogs(["⚡ [СЕРВЕР]: Прорахунок шансів, крутного моменту та зачепу коліс..."]);
    const res = await fetch("/api/rooms/simulate", { method: "POST", body: JSON.stringify({ roomId: room.id, userId }) });
    const data = await res.json();
    setTimeout(() => { setRaceStatus("finished"); setLogs(data.logs); loadData(); }, 2500);
  };

  const buyItem = async (item: any) => {
    const res = await fetch("/api/garage/buy", { method: "POST", body: JSON.stringify({ userId, itemId: item.id }) });
    if (res.ok) { alert("Апгрейд успішно встановлено!"); loadData(); } else { alert((await res.json()).error); }
  };

  if (introStep === "video") {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-hidden flex items-center justify-center">
        <iframe className="absolute w-screen h-screen object-cover scale-125 pointer-events-none border-0" src={`https://www.youtube.com/embed/5-b076HhYF4?autoplay=1&controls=0&mute=${isMuted ? 1 : 0}&loop=1&playlist=5-b076HhYF4&start=12`} allow="autoplay; encrypted-media" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
        <div className="absolute bottom-10 right-10 flex gap-4 z-50">
          <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-white/10 text-white rounded-full backdrop-blur-md border border-white/20">{isMuted ? <VolumeX /> : <Volume2 />}</button>
          <button onClick={() => setIntroStep("quote")} className="px-6 py-3 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg">Пропустити інтро</button>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_5px_15px_rgba(255,0,0,0.5)]">ХОБОТНЯ</h1>
        </div>
      </div>
    );
  }

  if (introStep === "quote") {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 select-none animate-fade-in">
        <div className="max-w-2xl text-center space-y-6">
          <p className="text-xl md:text-3xl font-black font-serif italic text-zinc-100 leading-relaxed tracking-wide animate-pulse">
            «Гроші приходять і йдуть... Друзі, з якими ти ділив останній літр бензину, стають чужими через пачку купюр. А зрада... зрада завжди стріляє точно в спину від тих, кому ти довіряв свій руль. В цій грі немає правил. Тут є тільки швидкість і твій чистий розрахунок.»
          </p>
          <div className="h-[2px] w-24 bg-red-600 mx-auto mt-4" />
        </div>
      </div>
    );
  }

  if (!user) return <div className="h-screen bg-black flex items-center justify-center font-mono text-red-600">ЗАВАНТАЖЕННЯ ХОБОТНІ...</div>;

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 flex font-sans">
      {/* NAVBAR */}
      <nav className="w-20 bg-black border-r border-zinc-900 flex flex-col items-center py-8 gap-8">
        <div className="text-red-600 font-black text-2xl italic">Х</div>
        <button onClick={() => setActiveTab("race")} className={`p-3 rounded-xl ${activeTab === 'race' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><Flag /></button>
        <button onClick={() => setActiveTab("garage")} className={`p-3 rounded-xl ${activeTab === 'garage' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><ShoppingCart /></button>
        <button onClick={() => setActiveTab("social")} className={`p-3 rounded-xl ${activeTab === 'social' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><MessageSquare /></button>
      </nav>

      {/* WORKSPACE */}
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
          </div>
        </header>

        <div className="p-8 overflow-y-auto h-[calc(100vh-64px)]">
          {activeTab === "race" && (
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-8 space-y-6">
                {raceStatus !== "idle" ? (
                  <div className="bg-zinc-900/50 rounded-3xl p-8 border border-red-600/20">
                    <h2 className="text-xl font-black italic mb-6 uppercase flex items-center gap-2"><Flame className="text-red-600" /> СЕРВЕРНИЙ РЕЗУЛЬТАТ ЗАЇЗДУ</h2>
                    <div className="bg-black p-6 rounded-xl font-mono text-sm text-zinc-300 min-h-[150px] space-y-2 border border-zinc-800">
                      {logs.map((l, i) => <div key={i} className="border-l-2 border-red-600 pl-2">{l}</div>)}
                    </div>
                    {raceStatus === "finished" && <button onClick={() => setRaceStatus("idle")} className="mt-4 px-6 py-2 bg-zinc-800 text-white rounded-xl text-xs font-bold">Назад в лобі</button>}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {rooms.filter(r => r.status === "Очікування").map(r => (
                      <div key={r.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
                         <div className="flex justify-between mb-4">
                            <span className="font-bold uppercase italic text-sm">{r.name}</span>
                            <span className="text-emerald-400 font-mono text-sm">₴ {r.bet}</span>
                         </div>
                         <button onClick={() => handleStartServerRace(r)} className="w-full py-3 bg-red-600 text-white font-black uppercase text-xs rounded-xl">СТАРТ НА СЕРВЕРІ</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="col-span-4">
                 <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                    <h3 className="text-xs font-black uppercase text-zinc-400 flex items-center gap-2"><Ticket className="h-4 w-4 text-red-500" /> Активувати Промокод</h3>
                    <div className="flex gap-2">
                       <input type="text" value={promoInput} onChange={e => setPromoInput(e.target.value)} placeholder="Код (START2026)" className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs focus:outline-none font-mono text-white" />
                       <button onClick={handleActivatePromo} className="px-4 py-2 bg-zinc-100 text-black font-black text-xs rounded-xl">OK</button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === "garage" && (
            <div className="grid grid-cols-3 gap-6">
               {garageItems.map(item => (
                 <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4">
                    <div className="text-lg font-bold">{item.name}</div>
                    <div className="text-xs text-zinc-500">{item.desc}</div>
                    <div className="text-xl font-mono text-emerald-400 font-bold">₴ {item.price.toLocaleString()}</div>
                    <button onClick={() => buyItem(item)} disabled={user.purchasedItems?.includes(item.id)} className="w-full py-2.5 rounded-xl font-black uppercase text-xs border border-zinc-700 disabled:opacity-30">
                      {user.purchasedItems?.includes(item.id) ? "Встановлено" : "Купити апгрейд"}
                    </button>
                 </div>
               ))}
            </div>
          )}

          {/* UNDERGROUND MESSENGER TABS */}
          {activeTab === "social" && (
            <div className="grid grid-cols-12 gap-6 h-[550px] bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
               
               {/* ЛІВА ЧАСТИНА: КОНТАКТИ ТА ТАБИ */}
               <div className="col-span-4 border-r border-zinc-800 flex flex-col bg-black/20">
                  <div className="p-4 border-b border-zinc-800 flex gap-2">
                     <button onClick={() => setSocialMode("global")} className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all ${socialMode === 'global' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>Глобальний</button>
                     <button onClick={() => setSocialMode("private")} className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all ${socialMode === 'private' ? 'bg-red-600 text-white' : 'text-zinc-400 bg-zinc-800'}`}>Приватні DM</button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                     {socialMode === "global" ? (
                       <div className="p-4 text-center text-xs text-zinc-600 font-mono">Ви підключені до загальної рації синдикату.</div>
                     ) : (
                       contacts.map(c => (
                         <button 
                           key={c.id} 
                           onClick={() => setSelectedContact(c)}
                           className={`w-full p-3 rounded-xl flex items-center gap-3 font-mono text-xs transition-all text-left ${selectedContact?.id === c.id ? 'bg-zinc-800 border-l-4 border-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-800/40'}`}
                         >
                           <User className="h-4 w-4 text-zinc-500" />
                           <div>
                             <div className="font-bold">@{c.nickname}</div>
                             <span className="text-[9px] text-zinc-600 uppercase">{c.isVip ? "VIP-ХОБОТ" : "Користувач"}</span>
                           </div>
                         </button>
                       ))
                     )}
                  </div>
               </div>

               {/* ПРАВА ЧАСТИНА: ВІКНО ДІАЛОГУ */}
               <div className="col-span-8 flex flex-col h-full bg-black/40">
                  {socialMode === "global" ? (
                    <>
                      <div className="p-4 border-b border-zinc-800 font-black text-xs uppercase text-zinc-400 flex items-center gap-2">📻 Загальна шифрована рація</div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                         {globalMessages.map((m: any) => (
                           <div key={m.id} className="text-xs font-mono">
                              <span className="text-red-500 font-bold">@{m.user.nickname}: </span>
                              <span className="text-zinc-300">{m.text}</span>
                           </div>
                         ))}
                         <div ref={chatEndRef} />
                      </div>
                      <div className="p-3 bg-black/60 border-t border-zinc-800 flex gap-2">
                         <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendGlobalMessage()} placeholder="Крикнути в рацію..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-1.5 text-xs text-white focus:outline-none focus:border-red-600" />
                         <button onClick={sendGlobalMessage} className="p-2 bg-red-600 rounded-xl text-white"><Send className="h-3.5 w-3.5" /></button>
                      </div>
                    </>
                  ) : selectedContact ? (
                    <>
                      <div className="p-4 border-b border-zinc-800 font-black text-xs font-mono text-zinc-300 flex items-center justify-between">
                         <span className="flex items-center gap-2 text-red-500"><Lock className="h-3.5 w-3.5" /> ШИФРОВАНИЙ КАНАЛ: @{selectedContact.nickname}</span>
                         <span className="text-[9px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">P2P SECURE</span>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                         {privateMessages.length === 0 ? (
                           <div className="text-center py-24 text-xs font-mono text-zinc-600">Діалог пустий. Напиши перше повідомлення в приват.</div>
                         ) : (
                           privateMessages.map((m: any) => (
                             <div key={m.id} className={`flex flex-col ${m.senderId === userId ? 'items-end' : 'items-start'}`}>
                                <div className="max-w-[70%] p-2.5 rounded-2xl border text-xs font-mono text-zinc-200 bg-zinc-900/60 border-zinc-800">
                                   <div className="text-[9px] text-zinc-500 font-bold mb-0.5">@{m.sender.nickname}</div>
                                   <div>{m.text}</div>
                                </div>
                             </div>
                           ))
                         )}
                         <div ref={chatEndRef} />
                      </div>
                      <div className="p-3 bg-black/60 border-t border-zinc-800 flex gap-2">
                         <input type="text" value={dmInput} onChange={e => setDmInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendPrivateMessage()} placeholder={`Надіслати приватне повідомлення для @${selectedContact.nickname}...`} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-1.5 text-xs text-white focus:outline-none focus:border-red-600" />
                         <button onClick={sendPrivateMessage} className="p-2 bg-red-600 rounded-xl text-white"><Send className="h-3.5 w-3.5" /></button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 font-mono text-xs p-6 text-center">
                       <Lock className="h-8 w-8 mb-2 text-zinc-800 animate-pulse" />
                       Виберіть хобота зі списку контактів зліва, щоб відкрити приватний захищений P2P чат.
                    </div>
                  )}
               </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
