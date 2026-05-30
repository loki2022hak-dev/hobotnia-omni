"use client";
import React, { useState, useEffect } from "react";
import { 
  Home, Compass, Layers, MessageSquare, Users, Flag, Trophy, Wallet, Star, Settings, 
  Search, Bell, Plus, Image, Send, Heart, MessageCircle, Share2, Shield, Play, 
  Zap, ThumbsUp, PlusCircle, CheckCircle2, Skull, Volume2, ShieldAlert
} from "lucide-react";

// Інтерфейси для типізації
interface Story { id: number; name: string; avatar: string; media: string; time: string; viewed: boolean; }
interface Chat { id: number; name: string; avatar: string; lastMsg: string; time: string; unread: number; online: boolean; messages: { sender: string; text: string; time: string; }[]; }
interface Post { id: number; author: string; avatar: string; time: string; text: string; image: string; likes: number; comments: number; liked: boolean; tag: string; }
interface RaceRoom { id: string; name: string; distance: string; coverage: string; bet: number; players: string[]; status: "waiting" | "racing" | "finished"; winAmount: number; }

export default function HobotniaDashboardWithIntro() {
  // Головний стейт покрокового інтро, який ти вказав на початку
  const [introStep, setIntroStep] = useState<"check" | "trigger" | "video" | "dashboard">("check");
  
  // Додаткові стейти для етапів інтро
  const [checkProgress, setCheckProgress] = useState(0);
  const [checkLogs, setCheckLogs] = useState<string[]>([]);
  
  // Дашборд стейти
  const [activeTab, setActiveTab] = useState<"home" | "feed" | "races" | "wallet" | "vip" | "admin">("home");
  const [feedFilter, setFeedFilter] = useState<"all" | "subs" | "vip" | "pop">("all");
  const [balance, setBalance] = useState<number>(12450.00);
  const [userVip, setUserVip] = useState<string>("VIP GOLD");
  const [stats, setStats] = useState({ speed: 40, grip: 30, nitro: 30 });
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  
  // Стрічка
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, author: "NightRider", avatar: "NR", time: "2 год тому", text: "Нічне місто. Швидкість. Свобода. Виїхав на обкатку нової гуми.", image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80", likes: 128, comments: 24, liked: true, tag: "all" },
    { id: 2, author: "Toretto", avatar: "TO", time: "5 год тому", text: "Справа не в машині чи байку. Справа в тому, хто за кермом. Чекаю суперників на Чернігівській трасі.", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80", likes: 342, comments: 89, liked: false, tag: "pop" }
  ]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImg, setNewPostImg] = useState("");

  // Заїзди
  const [raceRooms, setRaceRooms] = useState<RaceRoom[]>([
    { id: "2781", name: "Чернігівська Траса (Ніч)", distance: "400 км", coverage: "сухий асфальт", bet: 5000, players: ["Toretto", "ХОБОТ", "Shadow", "NightRider"], status: "waiting", winAmount: 0 }
  ]);
  const [activeRaceLog, setActiveRaceLog] = useState<string[]>([]);
  const [currentRunningRace, setCurrentRunningRace] = useState<RaceRoom | null>(null);

  // Чати
  const [chats, setChats] = useState<Chat[]>([
    { id: 1, name: "Toretto", avatar: "TO", lastMsg: "Давай на перегон?", time: "10:30", unread: 2, online: true, messages: [{ sender: "Toretto", text: "Привіт! Бачив твої показники швидкості на треку.", time: "10:28" }, { sender: "Toretto", text: "Давай на перегон?", time: "10:30" }] },
    { id: 2, name: "NightRider", avatar: "NR", lastMsg: "Гоу сьогодні ввечері", time: "10:21", unread: 1, online: true, messages: [{ sender: "NightRider", text: "Зібрав новий мотор.", time: "10:20" }, { sender: "NightRider", text: "Гоу сьогодні ввечері", time: "10:21" }] }
  ]);
  const [activeChatId, setActiveChatId] = useState<number>(1);
  const [typedMessage, setTypedMessage] = useState("");

  // Емуляція перевірки (Крок 1: check)
  useEffect(() => {
    if (introStep !== "check") return;
    
    const logs = [
      "🔄 Ініціалізація захищеного тунелю...",
      "🛡️ Перевірка підпису SSL шифрування...",
      "🧬 Синхронізація з нодами ХОБОТНЯ СИНДИКАТ...",
      "🔑 Доступ дозволено. Вітаємо у грі."
    ];
    
    let currentLogIdx = 0;
    const interval = setInterval(() => {
      if (currentLogIdx < logs.length) {
        setCheckLogs(prev => [...prev, logs[currentLogIdx]]);
        setCheckProgress(prev => prev + 25);
        currentLogIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIntroStep("trigger"), 800);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [introStep]);

  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setChats(chats.map(c => c.id === activeChatId ? { ...c, lastMsg: typedMessage, time: timeStr, messages: [...c.messages, { sender: "ХОБОТ", text: typedMessage, time: timeStr }] } : c));
    setTypedMessage("");
  };

  const startRaceSimulation = (room: RaceRoom) => {
    if (balance < room.bet) return;
    setBalance(prev => prev - room.bet);
    setCurrentRunningRace(room);
    setActiveRaceLog(["⚡ [СЕРВЕР]: Телеметрія активована...", "🏁 Байки на стартовій лінії..."]);
    
    setTimeout(() => setActiveRaceLog(prev => [...prev, "🔥 Старт! Оберти на максимумі!"]), 1500);
    setTimeout(() => setActiveRaceLog(prev => [...prev, `🚀 Швидкість: ${stats.speed} км/год. Nitro +${stats.nitro}%`]), 3000);
    setTimeout(() => {
      const isWinner = Math.random() > 0.4;
      if (isWinner) {
        setBalance(prev => prev + (room.bet * 2.5));
        setActiveRaceLog(prev => [...prev, `🏆 Переміг @ХОБОТ! + ₴ ${(room.bet * 2.5).toLocaleString()}`]);
      } else {
        setActiveRaceLog(prev => [...prev, `🏁 Першим фінішував @Toretto. Спробуй ще раз!`]);
      }
      setCurrentRunningRace(null);
    }, 4500);
  };

  // ----------------------------------------------------
  // РЕНДЕР КРОКІВ ІНТРО (ТОМУ ЩО ВСЕ МАЄ ПРАЦЮВАТИ БЕЗ ЗАГЛУШОК)
  // ----------------------------------------------------
  
  // КРОК 1: CHECK (Перевірка системи)
  if (introStep === "check") {
    return (
      <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center p-6 font-mono selection:bg-red-600">
        <div className="w-full max-w-md bg-[#070709] border border-zinc-900 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 h-[2px] bg-red-600 transition-all duration-500" style={{ width: `${checkProgress}%` }} />
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <Skull className="h-6 w-6 text-red-500 animate-pulse" />
            <div>
              <h2 className="text-sm font-black uppercase text-white tracking-wider">ХОБОТНЯ СЕК'ЮРІТІ</h2>
              <p className="text-[10px] text-zinc-500 uppercase">Аналіз девайсу та з'єднання...</p>
            </div>
          </div>
          <div className="space-y-2 min-h-32 flex flex-col justify-end text-[11px] text-zinc-400">
            {checkLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="h-3 w-3 text-red-500 shrink-0" />
                <span>{log}</span>
              </div>
            ))}
          </div>
          <div className="text-center text-[10px] text-zinc-600 border-t border-zinc-900 pt-3 uppercase tracking-widest">
            Завантаження ядра протоколу
          </div>
        </div>
      </div>
    );
  }

  // КРОК 2: TRIGGER (Психологічний тригер / Попередження перед входом)
  if (introStep === "trigger") {
    return (
      <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center p-6 font-mono text-center">
        <div className="w-full max-w-lg bg-[#020203] border border-zinc-900 rounded-3xl p-8 space-y-6 shadow-[0_0_50px_rgba(239,68,68,0.05)]">
          <div className="w-14 h-14 bg-red-950/40 border border-red-900/50 rounded-2xl flex items-center justify-center mx-auto text-red-500">
            <ShieldAlert className="h-7 w-7 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase tracking-tight text-white">УВАГА: ТИ ПЕРЕХОДИШ У КЛУБ ШВИДКОСТІ</h1>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-sm mx-auto">
              Тут немає місця повільним рішенням. Контент, телеметрія та ставки відбуваються в реальному часі. Підтверди, що готовий діяти на максималках.
            </p>
          </div>
          <div className="pt-4 border-t border-zinc-900 flex flex-col gap-2">
            <button onClick={() => setIntroStep("video")} className="w-full py-3 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all">
              Я готовий. Ввімкнути презентацію заїзду
            </button>
            <button onClick={() => alert("Доступ скасовано. Повертайтесь, коли будете готові.")} className="w-full py-2.5 bg-transparent hover:bg-zinc-900/50 text-zinc-600 hover:text-zinc-400 font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all">
              Вийти назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  // КРОК 3: VIDEO (Повноформатний плеєр презентації)
  if (introStep === "video") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-mono text-center">
        <div className="w-full max-w-3xl space-y-4">
          <div className="flex justify-between items-center px-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5 uppercase text-red-500 font-bold"><Volume2 className="h-3 w-3" /> Ознайомче відео синдикату</span>
            <button onClick={() => setIntroStep("dashboard")} className="hover:text-white uppercase font-bold text-[10px] tracking-wider bg-zinc-900 px-3 py-1 rounded-md border border-zinc-800">
              Пропустити інтро ➡️
            </button>
          </div>
          
          {/* Професійний кастомний відео-контейнер */}
          <div className="w-full aspect-video bg-zinc-950 rounded-3xl border border-zinc-900 overflow-hidden relative group shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" 
              title="Hobotnia Omni Intro Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end text-left">
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">ХОБОТНЯ PROD</span>
              <h2 className="text-sm font-black text-white mt-1">ОБ КАТКА НОВИХ ТРЕКІВ ТА МОДЕЛЕЙ БАЙКІВ</h2>
            </div>
          </div>
          
          <button onClick={() => setIntroStep("dashboard")} className="w-full py-3.5 bg-white hover:bg-zinc-100 text-black font-black text-xs uppercase rounded-2xl tracking-widest shadow-xl transition-all font-mono">
            ПЕРЕЙТИ ДО ОПЕРАЦІЙНОЇ ПАНЕЛІ (DASHBOARD)
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // КРОК 4: DASHBOARD (Твій елітний функціональний дашборд)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#070709] text-[#e4e4e7] flex font-sans antialiased h-screen overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#020203] border-r border-zinc-900 flex flex-col justify-between shrink-0 z-20">
        <div>
          <div className="p-6 flex flex-col gap-1 border-b border-zinc-900">
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase font-mono">ХОБОТНЯ</h1>
            <span className="text-[9px] font-mono tracking-widest text-red-500 font-bold uppercase">Живи на швидкості</span>
          </div>
          <nav className="p-4 space-y-1">
            <p className="px-3 text-[9px] font-mono uppercase tracking-wider text-zinc-600 mb-2">Соцмережа</p>
            <button onClick={() => setActiveTab("home")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all ${activeTab === "home" ? "bg-gradient-to-r from-red-950/50 to-red-900/10 text-red-500 border-l-2 border-red-500" : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"}`}>
              <Home className="h-4 w-4" /> Головна
            </button>
            <button onClick={() => { setActiveTab("feed"); setFeedFilter("all"); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all ${activeTab === "feed" ? "bg-gradient-to-r from-red-950/50 to-red-900/10 text-red-500 border-l-2 border-red-500" : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"}`}>
              <Compass className="h-4 w-4" /> Стрічка
            </button>
            <button onClick={() => setActiveTab("races")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all ${activeTab === "races" ? "bg-gradient-to-r from-red-950/50 to-red-900/10 text-red-500 border-l-2 border-red-500" : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"}`}>
              <Flag className="h-4 w-4 text-red-500" /> Перегони
            </button>
            <button onClick={() => setActiveTab("wallet")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all ${activeTab === "wallet" ? "bg-gradient-to-r from-red-950/50 to-red-900/10 text-emerald-500 border-l-2 border-emerald-500" : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"}`}>
              <Wallet className="h-4 w-4 text-emerald-500" /> Гаманець
            </button>
            <button onClick={() => setActiveTab("vip")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all ${activeTab === "vip" ? "bg-gradient-to-r from-red-950/50 to-red-900/10 text-amber-500 border-l-2 border-amber-500" : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"}`}>
              <Star className="h-4 w-4 text-amber-400" /> VIP Клуб
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-zinc-900">
          <button onClick={() => setActiveTab("admin")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all ${activeTab === "admin" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
            <Settings className="h-4 w-4" /> Панель конфігу
          </button>
        </div>
      </aside>

      {/* WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-[#020203] border-b border-zinc-900 px-8 flex items-center justify-between shrink-0 z-10">
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-600" />
            <input type="text" placeholder="Шукати заїзди чи треки..." className="w-full bg-[#070709] border border-zinc-900 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-red-600 font-mono text-zinc-300 transition-all" />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-[#020203] border border-zinc-800 px-4 py-1.5 rounded-xl font-mono text-xs font-bold text-emerald-400">
              <span>₴ {balance.toLocaleString()}</span>
              <button onClick={() => setBalance(prev => prev + 5000)} className="ml-1 bg-emerald-600 text-white rounded p-0.5"><Plus className="h-3 w-3" /></button>
            </div>
            <div className="flex items-center gap-3 border-l border-zinc-900 pl-4 font-mono">
              <div className="text-right">
                <div className="text-xs font-black text-zinc-200">ХОБОТ</div>
                <div className="text-[9px] font-bold text-amber-500 tracking-widest">{userVip}</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 p-[1.5px]">
                <div className="w-full h-full bg-[#070709] rounded-xl flex items-center justify-center font-black text-xs text-white">XB</div>
              </div>
            </div>
          </div>
        </header>

        {/* PAGES COMPONENT */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === "home" && (
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                
                {/* АКТИВНІ ПЕРЕГОНИ */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-xs font-black font-mono uppercase text-zinc-500 tracking-wider">Стрічка постів</h3>
                    {posts.slice(0, 1).map(post => (
                      <div key={post.id} className="bg-[#020203] border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-4 text-xs text-zinc-300 font-sans leading-relaxed">{post.text}</div>
                        <div className="w-full h-64 bg-black overflow-hidden"><img src={post.image} className="w-full h-full object-cover" /></div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-black font-mono uppercase text-zinc-500 tracking-wider">Гонка в реальному часі</h3>
                    {raceRooms.map(room => (
                      <div key={room.id} className="bg-[#020203] border border-zinc-900 rounded-2xl p-4 space-y-4">
                        <div className="text-xs font-black font-mono uppercase text-white">КІМНАТА #{room.id}</div>
                        <div className="relative h-40 bg-[#070709] rounded-xl border border-zinc-900 p-4 flex gap-4">
                          <div className="w-1/2 font-mono text-[10px] space-y-1">
                            {room.players.map((p, i) => <div key={i} className="px-2 py-1 bg-zinc-900/50 rounded border border-zinc-800 text-zinc-400">{i+1}. {p}</div>)}
                          </div>
                          <div className="w-1/2 flex flex-col items-center justify-center bg-zinc-950/50 rounded-lg p-2 border border-zinc-900">
                            <button onClick={() => startRaceSimulation(room)} className="w-full py-2 bg-gradient-to-r from-red-700 to-red-600 text-white font-black text-[10px] uppercase rounded-lg font-mono tracking-wider">
                              СТАРТ ЗАЇЗДУ
                            </button>
                          </div>
                        </div>
                        {activeRaceLog.length > 0 && (
                          <div className="bg-black/90 rounded-xl p-3 border border-zinc-900 font-mono text-[10px] text-zinc-400 space-y-1 max-h-24 overflow-y-auto">
                            {activeRaceLog.map((log, index) => <div key={index}>{log}</div>)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* CHATS SIDEBAR */}
              <aside className="w-80 bg-[#020203] border-l border-zinc-900 p-4 flex flex-col justify-between shrink-0 font-mono">
                <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
                  <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Даркнет Чати</h3>
                  <div className="flex-1 overflow-y-auto space-y-1">
                    {chats.map(c => (
                      <div key={c.id} onClick={() => setActiveChatId(c.id)} className={`p-2 rounded-xl cursor-pointer ${c.id === activeChatId ? "bg-red-950/20 text-white" : "text-zinc-400"}`}>
                        <div className="text-xs font-bold">@{c.name}</div>
                        <div className="text-[10px] text-zinc-500 truncate">{c.lastMsg}</div>
                      </div>
                    ))}
                  </div>
                  <div className="border border-zinc-900 rounded-xl bg-[#070709] h-40 flex flex-col overflow-hidden">
                    <div className="flex-1 p-2 overflow-y-auto space-y-1 text-[10px]">
                      {(chats.find(c => c.id === activeChatId) || chats[0]).messages.map((m, i) => (
                        <div key={i} className={`p-1.5 rounded ${m.sender === 'ХОБОТ' ? 'bg-red-950/40 text-right ml-auto' : 'bg-zinc-900'}`}>{m.text}</div>
                      ))}
                    </div>
                    <div className="p-1 bg-[#020203] border-t border-zinc-900 flex gap-1">
                      <input type="text" placeholder="Повідомлення..." value={typedMessage} onChange={e => setTypedMessage(e.target.value)} className="bg-[#070709] text-[10px] p-1 flex-1 text-white focus:outline-none" />
                      <button onClick={handleSendMessage} className="p-1 bg-red-600 text-white rounded"><Send className="h-3 w-3" /></button>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* ВСПЛИВАЮЧІ СТОРІНКИ */}
          {activeTab === "feed" && (
            <div className="flex-1 p-8 overflow-y-auto max-w-2xl mx-auto space-y-4">
              <div className="bg-[#020203] border border-zinc-900 p-4 rounded-xl text-xs font-mono uppercase text-zinc-400">Публікації учасників</div>
              {posts.map(p => (
                <div key={p.id} className="bg-[#020203] border border-zinc-900 rounded-xl overflow-hidden p-4 space-y-2">
                  <div className="text-xs font-bold font-mono text-white">@{p.author}</div>
                  <p className="text-xs text-zinc-300 font-sans">{p.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "races" && (
            <div className="flex-1 p-8 overflow-y-auto max-w-2xl mx-auto space-y-4 font-mono text-xs">
              <div className="bg-[#020203] border border-zinc-900 p-4 rounded-xl text-white font-bold uppercase">Доступні Кімнати заїздів</div>
              <div className="p-4 bg-[#020203] border border-zinc-900 rounded-xl flex justify-between items-center">
                <span>Чернігівська Траса (Ставка: ₴ 5 000)</span>
                <button onClick={() => setActiveTab("home")} className="bg-red-600 text-white px-3 py-1 rounded">Перейти на головну до старту</button>
              </div>
            </div>
          )}

          {activeTab === "wallet" && (
            <div className="flex-1 p-8 overflow-y-auto max-w-md mx-auto space-y-4 font-mono text-xs text-center">
              <div className="bg-[#020203] border border-zinc-900 p-6 rounded-2xl">
                <p className="text-zinc-500 uppercase">Поточні Активи</p>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">₴ {balance.toLocaleString()}</h3>
                <button onClick={() => setBalance(prev => prev + 10000)} className="w-full mt-4 py-2 bg-emerald-600 text-white rounded-xl uppercase font-bold">Швидке Поповнення</button>
              </div>
            </div>
          )}

          {activeTab === "vip" && (
            <div className="flex-1 p-8 overflow-y-auto max-w-xl mx-auto space-y-4 font-mono text-xs">
              <div className="bg-[#020203] border border-zinc-900 p-6 rounded-2xl text-center space-y-2">
                <h3 className="text-amber-400 font-black uppercase">Повний безліміт INFINITE HUSTLE</h3>
                <p className="text-zinc-400">Множник ставок х2.5 активовано автоматично для твого профілю.</p>
              </div>
            </div>
          )}

          {activeTab === "admin" && (
            <div className="flex-1 p-8 overflow-y-auto max-w-md mx-auto space-y-4 font-mono text-xs">
              <div className="bg-[#020203] border border-zinc-900 p-5 rounded-2xl space-y-3">
                <h3 className="text-white font-black uppercase">Конфіг тюнінгу двигуна</h3>
                <div className="flex justify-between items-center bg-zinc-950 p-2 rounded">
                  <span>Потужність нітро бусту</span>
                  <div className="flex gap-1">
                    <button onClick={() => setStats({...stats, nitro: stats.nitro + 5})} className="px-2 bg-zinc-800 rounded">+</button>
                    <span className="px-2">{stats.nitro}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
