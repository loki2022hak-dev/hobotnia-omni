"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Home, Compass, Layers, MessageSquare, Users, Flag, Trophy, Wallet, Star, Settings, 
  Search, Bell, Plus, Image, Send, Heart, MessageCircle, Share2, Shield, Play, 
  ChevronRight, Check, AlertTriangle, Zap, ThumbsUp, PlusCircle
} from "lucide-react";

// Інтерфейси для типізації
interface Story { id: number; name: string; avatar: string; media: string; time: string; viewed: boolean; }
interface Chat { id: number; name: string; avatar: string; lastMsg: string; time: string; unread: number; online: boolean; messages: { sender: string; text: string; time: string; }[]; }
interface Post { id: number; author: string; avatar: string; time: string; text: string; image: string; likes: number; comments: number; liked: boolean; tag: string; }
interface RaceRoom { id: string; name: string; distance: string; coverage: string; bet: number; players: string[]; status: "waiting" | "racing" | "finished"; winAmount: number; }

export default function HobotniaProductionDashboard() {
  // Навігаційні стейти
  const [activeTab, setActiveTab] = useState<"home" | "feed" | "races" | "wallet" | "vip" | "admin">("home");
  const [feedFilter, setFeedFilter] = useState<"all" | "subs" | "vip" | "pop">("all");
  
  // Економіка та Персонаж
  const [balance, setBalance] = useState<number>(12450.00);
  const [userVip, setUserVip] = useState<string>("VIP GOLD");
  
  // Стейт характеристик для Адмін-панелі / Розподілу очок
  const [stats, setStats] = useState({ speed: 40, grip: 30, nitro: 30 });
  const [availablePoints, setAvailablePoints] = useState<number>(0);

  // Стейт інтерактивних історій
  const [stories, setStories] = useState<Story[]>([
    { id: 1, name: "Toretto", avatar: "TO", media: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80", time: "10 хв тому", viewed: false },
    { id: 2, name: "NightRider", avatar: "NR", media: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80", time: "45 хв тому", viewed: false },
    { id: 3, name: "DriftKing", avatar: "DK", media: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80", time: "2 год тому", viewed: false },
    { id: 4, name: "MotoLife", avatar: "ML", media: "https://images.unsplash.com/photo-1515777315835-281b94c9589f?auto=format&fit=crop&w=600&q=80", time: "3 год тому", viewed: true },
    { id: 5, name: "SpeedDemon", avatar: "SD", media: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80", time: "5 год тому", viewed: true }
  ]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  // Стейт стрічки постів
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, author: "NightRider", avatar: "NR", time: "2 год тому", text: "Нічне місто. Швидкість. Свобода. Виїхав на обкатку нової гуми.", image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80", likes: 128, comments: 24, liked: true, tag: "all" },
    { id: 2, author: "Toretto", avatar: "TO", time: "5 год тому", text: "Справа не в машині чи байку. Справа в тому, хто за кермом. Чекаю суперників на Чернігівській трасі.", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80", likes: 342, comments: 89, liked: false, tag: "pop" },
    { id: 3, author: "Ghost", avatar: "GH", time: "1 день тому", text: "Ексклюзивний заїзд для VIP-клубівців. Тільки закриті ставки.", image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=800&q=80", likes: 95, comments: 12, liked: false, tag: "vip" }
  ]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImg, setNewPostImg] = useState("");

  // Стейт заїздів та телеметрії
  const [raceRooms, setRaceRooms] = useState<RaceRoom[]>([
    { id: "2781", name: "Чернігівська Траса (Ніч)", distance: "400 км", coverage: "сухий асфальт", bet: 5000, players: ["Toretto", "ХОБОТ", "Shadow", "NightRider"], status: "waiting", winAmount: 0 }
  ]);
  const [activeRaceLog, setActiveRaceLog] = useState<string[]>([]);
  const [currentRunningRace, setCurrentRunningRace] = useState<RaceRoom | null>(null);

  // Стейт системи чатів
  const [chats, setChats] = useState<Chat[]>([
    { id: 1, name: "Toretto", avatar: "TO", lastMsg: "Давай на перегон?", time: "10:30", unread: 2, online: true, messages: [{ sender: "Toretto", text: "Привіт! Бачив твої показники швидкості на треку.", time: "10:28" }, { sender: "Toretto", text: "Давай на перегон?", time: "10:30" }] },
    { id: 2, name: "NightRider", avatar: "NR", lastMsg: "Гоу сьогодні ввечері", time: "10:21", unread: 1, online: true, messages: [{ sender: "NightRider", text: "Зібрав новий мотор.", time: "10:20" }, { sender: "NightRider", text: "Гоу сьогодні ввечері", time: "10:21" }] },
    { id: 3, name: "MotoLife Club", avatar: "ML", lastMsg: "Звʼязок зашифровано синдикатом...", time: "Вчора", unread: 0, online: false, messages: [{ sender: "System", text: "Безпечний канал створено.", time: "00:00" }] }
  ]);
  const [activeChatId, setActiveChatId] = useState<number>(1);
  const [typedMessage, setTypedMessage] = useState("");

  // Додаткові інтерактивні функції
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setChats(chats.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          lastMsg: typedMessage,
          time: timeStr,
          messages: [...c.messages, { sender: "ХОБОТ", text: typedMessage, time: timeStr }]
        };
      }
      return c;
    }));
    setTypedMessage("");
  };

  const handleLike = (id: number) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked };
      }
      return p;
    }));
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      author: "ХОБОТ",
      avatar: "ХБ",
      time: "Щойно",
      text: newPostText,
      image: newPostImg.trim() || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      likes: 0,
      comments: 0,
      liked: false,
      tag: "all"
    };
    setPosts([newPost, ...posts]);
    setNewPostText("");
    setNewPostImg("");
  };

  // Запуск симулятора перегонів на базі характеристик
  const startRaceSimulation = (room: RaceRoom) => {
    if (balance < room.bet) {
      alert("Недостатньо коштів на балансі для цієї ставки!");
      return;
    }
    setBalance(prev => prev - room.bet);
    setCurrentRunningRace(room);
    setActiveRaceLog(["⚡ [СЕРВЕР]: Ініціалізація зашифрованої телеметрії...", "🏁 Гонщики зайняли позиції на стартовій прямій..."]);
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step === 1) {
        setActiveRaceLog(prev => [...prev, "🔥 Світлофори згасли! Шалений старт з пробуксовкою!"]);
      } else if (step === 2) {
        setActiveRaceLog(prev => [...prev, `🚀 Швидкість: ${stats.speed} км/год. Твій нітро-буст активовано на +${stats.nitro}%!`]);
      } else if (step === 3) {
        setActiveRaceLog(prev => [...prev, `⏳ Проходження затяжного повороту. Зчеплення коліс (${stats.grip}) стабільне.`]);
      } else if (step === 4) {
        clearInterval(interval);
        // Розраховуємо шанс перемоги на базі статів
        const totalStats = stats.speed + stats.grip + stats.nitro;
        const winChance = totalStats > 90 ? 0.75 : 0.45;
        const isWinner = Math.random() < winChance;
        
        if (isWinner) {
          const cashPrize = room.bet * 2.5;
          setBalance(prev => prev + cashPrize);
          setActiveRaceLog(prev => [
            ...prev,
            `🏆 ЗАЇЗД ЗАВЕРШЕНО! Переміг @ХОБОТ!`,
            `💰 Твій баланс поповнено на ₴ ${cashPrize.toLocaleString()}`
          ]);
        } else {
          setActiveRaceLog(prev => [
            ...prev,
            `🏁 ЗАЇЗД ЗАВЕРШЕНО! Першим фінішував @Toretto.`,
            `❌ На жаль, цього разу фортуна була не на твоєму боці. Спробуй ще раз!`
          ]);
        }
        setCurrentRunningRace(null);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#e4e4e7] flex font-sans antialiased selection:bg-red-600 selection:text-white h-screen overflow-hidden">
      
      {/* 1. ЛІВА НАВІГАЦІЙНА ПАНЕЛЬ (SIDEBAR) */}
      <aside className="w-64 bg-[#020203] border-r border-zinc-900 flex flex-col justify-between shrink-0 z-20">
        <div>
          <div className="p-6 flex flex-col gap-1 border-b border-zinc-900">
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
              ХОБОТНЯ
            </h1>
            <span className="text-[9px] font-mono tracking-widest text-red-500 font-bold uppercase animate-pulse">
              Живи на швидкості
            </span>
          </div>
          
          <nav className="p-4 space-y-1">
            <p className="px-3 text-[9px] font-mono uppercase tracking-wider text-zinc-600 mb-2">Соцмережа</p>
            <button onClick={() => setActiveTab("home")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all ${activeTab === "home" ? "bg-gradient-to-r from-red-950/50 to-red-900/10 text-red-500 border-l-2 border-red-500" : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"}`}>
              <Home className="h-4 w-4" /> Головна
            </button>
            <button onClick={() => { setActiveTab("feed"); setFeedFilter("all"); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all ${activeTab === "feed" ? "bg-gradient-to-r from-red-950/50 to-red-900/10 text-red-500 border-l-2 border-red-500" : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"}`}>
              <Compass className="h-4 w-4" /> Стрічка
            </button>
            <button onClick={() => { setActiveTab("feed"); setFeedFilter("vip"); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200`}>
              <Layers className="h-4 w-4" /> Історії
            </button>
            <button onClick={() => setActiveTab("home")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200">
              <MessageSquare className="h-4 w-4" /> Повідомлення <span className="ml-auto bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-sans font-bold">3</span>
            </button>

            <p className="px-3 text-[9px] font-mono uppercase tracking-wider text-zinc-600 pt-4 mb-2">Онлайн-перегони</p>
            <button onClick={() => setActiveTab("races")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all ${activeTab === "races" ? "bg-gradient-to-r from-red-950/50 to-red-900/10 text-red-500 border-l-2 border-red-500" : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"}`}>
              <Flag className="h-4 w-4 text-red-500" /> Перегони
            </button>

            <p className="px-3 text-[9px] font-mono uppercase tracking-wider text-zinc-600 pt-4 mb-2">Кабінет</p>
            <button onClick={() => setActiveTab("wallet")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all ${activeTab === "wallet" ? "bg-gradient-to-r from-red-950/50 to-red-900/10 text-red-500 border-l-2 border-red-500" : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"}`}>
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

      {/* 2. ЦЕНТРАЛЬНИЙ БЛОК + ХЕДЕР */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* ХЕДЕР */}
        <header className="h-16 bg-[#020203] border-b border-zinc-900 px-8 flex items-center justify-between shrink-0 z-10">
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-600" />
            <input type="text" placeholder="Швидкий пошук за заїздами та треками..." className="w-full bg-[#070709] border border-zinc-900 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-red-600 font-mono text-zinc-300 transition-all" />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors" onClick={() => alert("Система сповіщень активована. Усі канали захищені.")}>
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            </button>
            
            <div className="flex items-center gap-2 bg-[#020203] border border-zinc-800 px-4 py-1.5 rounded-xl font-mono text-xs font-bold text-emerald-400 shadow-inner">
              <span>₴ {balance.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <button onClick={() => setBalance(prev => prev + 5000)} className="ml-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md p-0.5 transition-colors" title="Поповнити баланс"><Plus className="h-3 w-3" /></button>
            </div>

            <div className="flex items-center gap-3 border-l border-zinc-900 pl-4">
              <div className="text-right">
                <div className="text-xs font-black font-mono text-zinc-200 tracking-tight">ХОБОТ</div>
                <div className="text-[9px] font-bold text-amber-500 font-mono tracking-widest uppercase">{userVip}</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 p-[1.5px] shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                <div className="w-full h-full bg-[#070709] rounded-xl flex items-center justify-center font-black text-xs text-white font-mono">XB</div>
              </div>
            </div>
          </div>
        </header>

        {/* НАПОВНЕННЯ СТОРІНОК */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* СТОРІНКА: ГОЛОВНА (З МАКЕТУ) */}
          {activeTab === "home" && (
            <div className="flex-1 flex overflow-hidden">
              
              {/* ЦЕНТРАЛЬНА СТРІЧКА */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                
                {/* СЕКЦІЯ ІСТОРІЙ */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-black uppercase font-mono tracking-wider text-zinc-500">Історії синдикату</h3>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase">Активні канали</span>
                  </div>
                  <div className="bg-[#020203] border border-zinc-900 p-4 rounded-2xl flex gap-4 items-center overflow-x-auto">
                    <div className="flex flex-col items-center min-w-[65px] group cursor-pointer" onClick={() => alert("Для завантаження власної історії вкажіть пряме медіа-посилання в адмін-панелі.")}>
                      <div className="w-12 h-12 rounded-xl border-2 border-dashed border-zinc-800 flex items-center justify-center bg-zinc-900/30 group-hover:border-red-500 transition-all">
                        <Plus className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400" />
                      </div>
                      <span className="text-[9px] mt-1.5 text-zinc-500 font-mono font-bold text-center">Додати</span>
                    </div>
                    {stories.map(s => (
                      <div key={s.id} onClick={() => { setActiveStory(s); setStories(stories.map(st => st.id === s.id ? { ...st, viewed: true } : st)); }} className="flex flex-col items-center min-w-[65px] cursor-pointer">
                        <div className={`w-12 h-12 rounded-xl p-[2px] transition-all hover:scale-105 ${s.viewed ? "bg-zinc-800" : "bg-gradient-to-tr from-red-600 via-amber-500 to-purple-600"}`}>
                          <div className="w-full h-full bg-[#070709] rounded-xl flex items-center justify-center text-[10px] font-bold font-mono text-white">
                            {s.avatar}
                          </div>
                        </div>
                        <span className="text-[9px] mt-1.5 text-zinc-400 font-mono text-center truncate w-14">@{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ДВОКОЛОНКОВИЙ СТРУКТУРНИЙ ПЛАН */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  
                  {/* ОДИН АКТУАЛЬНИЙ ПОСТ */}
                  <div className="space-y-3">
                    <div className="flex gap-4 border-b border-zinc-900 pb-2 font-mono text-xs font-bold">
                      <button onClick={() => { setActiveTab("feed"); setFeedFilter("all"); }} className="text-red-500 border-b-2 border-red-500 pb-1 uppercase tracking-wider">Для тебе</button>
                      <button onClick={() => { setActiveTab("feed"); setFeedFilter("subs"); }} className="text-zinc-500 pb-1 hover:text-zinc-300 uppercase tracking-wider">Підписки</button>
                      <button onClick={() => { setActiveTab("feed"); setFeedFilter("vip"); }} className="text-zinc-500 pb-1 hover:text-zinc-300 uppercase tracking-wider">VIP</button>
                    </div>

                    {posts.slice(0, 1).map(post => (
                      <div key={post.id} className="bg-[#020203] border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center text-[11px] font-mono font-bold text-red-500">{post.avatar}</div>
                            <div>
                              <div className="text-xs font-bold font-mono text-zinc-200">@{post.author}</div>
                              <div className="text-[9px] font-mono text-zinc-600">{post.time}</div>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 pb-3 text-xs text-zinc-300 font-sans leading-relaxed">
                          {post.text}
                        </div>
                        <div className="w-full h-64 bg-black relative">
                          <img src={post.image} alt="Media content" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3 bg-[#020203] border-t border-zinc-950 flex items-center gap-4 text-zinc-500">
                          <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1.5 text-xs font-mono font-bold transition-colors ${post.liked ? "text-red-500" : "hover:text-zinc-300"}`}>
                            <Heart className={`h-4 w-4 ${post.liked ? "fill-red-600 text-red-600" : ""}`} /> {post.likes}
                          </button>
                          <button onClick={() => setActiveTab("feed")} className="flex items-center gap-1.5 text-xs font-mono font-bold hover:text-zinc-300">
                            <MessageCircle className="h-4 w-4" /> {post.comments}
                          </button>
                          <button onClick={() => { alert("Посилання на стрічку скопійовано в буфер синдикату."); }} className="flex items-center gap-1.5 text-xs font-mono font-bold hover:text-zinc-300 ml-auto">
                            <Share2 className="h-4 w-4" /> Поділитись
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* АКТИВНІ ПЕРЕГОНИ */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <h3 className="text-xs font-black uppercase font-mono tracking-wider text-zinc-500">Активни перегони</h3>
                      <button onClick={() => setActiveTab("races")} className="text-[10px] font-mono text-zinc-600 uppercase hover:text-zinc-400">Всі кімнати</button>
                    </div>

                    {raceRooms.map(room => (
                      <div key={room.id} className="bg-[#020203] border border-zinc-900 rounded-2xl p-4 space-y-4 shadow-xl">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xs font-black font-mono uppercase text-white flex items-center gap-2">
                              КІМНАТА #{room.id}
                              <span className="bg-red-950/60 text-red-500 text-[8px] px-2 py-0.5 rounded border border-red-900/50 font-bold uppercase tracking-widest animate-pulse">В процесі</span>
                            </div>
                            <div className="text-[10px] font-mono text-zinc-500 mt-1">Траса: {room.name} | Ставка: ₴ {room.bet.toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="relative h-44 bg-[#070709] rounded-xl border border-zinc-900 p-4 flex gap-4">
                          <div className="w-1/2 space-y-1 font-mono text-[10px]">
                            {room.players.map((p, i) => (
                              <div key={i} className={`flex items-center justify-between px-2 py-1 rounded border ${p === 'ХОБОТ' ? 'bg-red-950/40 border-red-900/50 text-red-400 font-bold' : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400'}`}>
                                <span>{i+1}. {p}</span>
                                {p === 'ХОБОТ' && <span className="text-[8px] text-amber-500">Твоя черга</span>}
                              </div>
                            ))}
                          </div>
                          
                          <div className="w-1/2 flex flex-col items-center justify-center bg-zinc-950/50 rounded-lg border border-zinc-900 p-2 text-center relative">
                            {currentRunningRace ? (
                              <div className="space-y-1 animate-pulse">
                                <Zap className="h-5 w-5 text-amber-500 mx-auto animate-bounce" />
                                <span className="text-[9px] font-mono text-amber-500 block">ЙДЕ ТЕЛЕМЕТРІЯ...</span>
                              </div>
                            ) : (
                              <>
                                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wide mb-2">Готовий до заїзду?</div>
                                <button onClick={() => startRaceSimulation(room)} className="w-full py-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-black text-[10px] uppercase tracking-wider rounded-lg shadow-lg font-mono flex items-center justify-center gap-1">
                                  <Play className="h-3 w-3 fill-white" /> СТАРТ
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* ТЕЛЕМЕТРІЯ В РЕАЛЬНОМУ ЧАСІ */}
                        {activeRaceLog.length > 0 && (
                          <div className="bg-black/80 rounded-xl p-3 border border-zinc-900 font-mono text-[10px] text-zinc-400 space-y-1 max-h-32 overflow-y-auto shadow-inner">
                            <div className="text-red-500 font-bold border-b border-zinc-900 pb-1 mb-1 uppercase tracking-widest text-[8px]">Канал звʼязку телеметрії:</div>
                            {activeRaceLog.map((log, index) => (
                              <div key={index} className="truncate">{log}</div>
                            ))}
                          </div>
                        )}

                        {/* БАНЕР З МАКЕТУ */}
                        <div className="bg-gradient-to-r from-amber-500/10 via-red-600/5 to-transparent border border-amber-500/20 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:border-amber-500/40 transition-all" onClick={() => setActiveTab("vip")}>
                          <div>
                            <div className="text-xs font-black font-mono text-amber-400 tracking-wider uppercase flex items-center gap-1">VIP CLUB <Star className="h-3 w-3 fill-amber-400 text-amber-400" /></div>
                            <div className="text-[10px] text-zinc-400 mt-0.5">Отримай статус ЛЕГЕНДИ та х2 до каси виграшу.</div>
                          </div>
                          <button className="bg-amber-500 text-black text-[9px] font-black uppercase px-3 py-1.5 rounded-md font-mono tracking-wider">ДІЗНАТИСЬ</button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* ПРАВА ЧАСТИНА: ЧАТИ З МАКЕТУ */}
              <aside className="w-80 bg-[#020203] border-l border-zinc-900 flex flex-col justify-between shrink-0 font-mono">
                <div className="p-4 space-y-4 flex-1 flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">Даркнет Чати</h3>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  </div>

                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-600" />
                    <input type="text" placeholder="Шукати за контактом..." className="w-full bg-[#070709] border border-zinc-900 rounded-lg pl-8 pr-3 py-1.5 text-[11px] focus:outline-none text-zinc-300" />
                  </div>

                  {/* СПИСОК ЧАТІВ */}
                  <div className="space-y-1 overflow-y-auto flex-1 pr-1">
                    {chats.map(c => (
                      <div key={c.id} onClick={() => { setActiveChatId(c.id); setChats(chats.map(ch => ch.id === c.id ? { ...ch, unread: 0 } : ch)); }} className={`p-2.5 flex items-center justify-between rounded-xl cursor-pointer transition-all ${c.id === activeChatId ? "bg-red-950/20 border border-red-900/30 text-white" : "hover:bg-zinc-900/30 text-zinc-400"}`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-300 shrink-0 relative">
                            {c.avatar}
                            {c.online && <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-black" />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-zinc-200 truncate">@{c.name}</div>
                            <div className="text-[10px] text-zinc-500 truncate max-w-[150px]">{c.lastMsg}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[8px] text-zinc-600">{c.time}</div>
                          {c.unread > 0 && <span className="inline-block bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full mt-1 animate-pulse">{c.unread}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ОКОНЦЕ АКТИВНОГО ЧАТУ (ПОВНОЦІННИЙ КЛІКАБЕЛЬНИЙ ІНТЕРФЕЙС) */}
                  <div className="border border-zinc-900 rounded-xl bg-[#070709] flex flex-col h-48 overflow-hidden">
                    <div className="p-2 bg-[#020203] border-b border-zinc-900 flex items-center justify-between text-[10px]">
                      <span className="font-bold text-zinc-400">Діалог: @{activeChat.name}</span>
                      <span className="text-zinc-600 text-[9px]">Зашифровано AES</span>
                    </div>
                    
                    <div className="flex-1 p-2 overflow-y-auto space-y-2 text-[10px]">
                      {activeChat.messages.map((m, idx) => (
                        <div key={idx} className={`max-w-[85%] rounded-lg p-2 ${m.sender === 'ХОБОТ' ? 'bg-red-950/50 text-red-200 ml-auto border border-red-900/20' : 'bg-zinc-900 text-zinc-300'}`}>
                          <p className="leading-relaxed">{m.text}</p>
                          <span className="text-[7px] text-zinc-500 block text-right mt-0.5">{m.time}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-1.5 bg-[#020203] border-t border-zinc-900 flex gap-1 items-center">
                      <input type="text" placeholder="Повідомлення..." value={typedMessage} onChange={e => setTypedMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} className="bg-[#070709] border border-zinc-800 rounded px-2 py-1 text-[10px] flex-1 focus:outline-none focus:border-red-600 text-white" />
                      <button onClick={handleSendMessage} className="p-1 bg-red-600 hover:bg-red-700 text-white rounded"><Send className="h-3 w-3" /></button>
                    </div>
                  </div>

                </div>
              </aside>

            </div>
          )}

          {/* СТОРІНКА: ПОВНА СТРІЧКА ПОСТІВ ТА СТВОРЕННЯ */}
          {activeTab === "feed" && (
            <div className="flex-1 p-8 overflow-y-auto max-w-3xl mx-auto space-y-6">
              
              {/* ФОРМА СТВОРЕННЯ ПОСТУ */}
              <form onSubmit={handleAddPost} className="bg-[#020203] border border-zinc-900 p-6 rounded-2xl space-y-4">
                <div className="text-xs font-black uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-2">
                  <Image className="text-red-500 h-4 w-4" /> Поділитися стилем синдикату в стрічку
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="URL зображення..." value={newPostImg} onChange={e => setNewPostImg(e.target.value)} className="bg-[#070709] border border-zinc-900 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-red-500" />
                  <input type="text" placeholder="Напишіть підпис до фотографії..." value={newPostText} onChange={e => setNewPostText(e.target.value)} className="bg-[#070709] border border-zinc-900 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-500" required />
                </div>
                <button type="submit" className="w-full py-2.5 bg-zinc-100 hover:bg-white text-black font-black font-mono text-xs uppercase rounded-xl tracking-wider transition-all">
                  Закинути в стрічку
                </button>
              </form>

              {/* ФІЛЬТРАЦІЯ ПОСТІВ */}
              <div className="flex gap-2 bg-[#020203] p-1.5 border border-zinc-900 rounded-xl font-mono text-xs">
                <button onClick={() => setFeedFilter("all")} className={`px-4 py-1.5 rounded-lg font-bold uppercase ${feedFilter === "all" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}>Всі публікації</button>
                <button onClick={() => setFeedFilter("vip")} className={`px-4 py-1.5 rounded-lg font-bold uppercase ${feedFilter === "vip" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-200"}`}>Тільки VIP</button>
                <button onClick={() => setFeedFilter("pop")} className={`px-4 py-1.5 rounded-lg font-bold uppercase ${feedFilter === "pop" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"}`}>Популярні</button>
              </div>

              {/* СПИСОК ПОСТІВ */}
              <div className="space-y-6">
                {posts.filter(p => feedFilter === "all" || p.tag === feedFilter).map(post => (
                  <div key={post.id} className="bg-[#020203] border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-4 flex items-center gap-3 border-b border-zinc-950">
                      <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 text-red-500 font-mono font-bold flex items-center justify-center rounded-xl">{post.avatar}</div>
                      <div>
                        <div className="text-xs font-black font-mono text-white">@{post.author}</div>
                        <div className="text-[10px] font-mono text-zinc-600">{post.time}</div>
                      </div>
                    </div>
                    <div className="p-4 text-xs text-zinc-300 leading-relaxed">{post.text}</div>
                    <div className="w-full bg-black">
                      <img src={post.image} alt="Feed media" className="w-full object-cover max-h-[450px]" />
                    </div>
                    <div className="p-4 border-t border-zinc-950 bg-zinc-950/20 flex gap-6 text-zinc-500 text-xs font-mono">
                      <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1.5 font-bold transition-all ${post.liked ? 'text-red-500' : 'hover:text-zinc-200'}`}>
                        <Heart className={`h-4 w-4 ${post.liked ? 'fill-red-600' : ''}`} /> {post.likes}
                      </button>
                      <button className="flex items-center gap-1.5 font-bold hover:text-zinc-200"><MessageCircle className="h-4 w-4" /> {post.comments}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* СТОРІНКА: ПЕРЕГОНИ (КІМНАТИ) */}
          {activeTab === "races" && (
            <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto space-y-6">
              <div className="bg-gradient-to-r from-red-950/30 to-transparent border border-red-900/30 p-6 rounded-2xl flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black italic uppercase text-white font-mono tracking-tight">Серверний пул перегонів</h2>
                  <p className="text-xs text-zinc-400 mt-1">Обирай трасу, розраховуй старти відповідно до конфігурації твого заліза.</p>
                </div>
                <button onClick={() => {
                  const id = Math.floor(1000 + Math.random() * 9000).toString();
                  setRaceRooms([...raceRooms, { id, name: "Львівський обхід (Дощ)", distance: "320 км", coverage: "мокрий асфальт", bet: 2500, players: ["SpeedDemon", "Ghost", "ХОБОТ"], status: "waiting", winAmount: 0 }]);
                }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl font-mono flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Створити кімнату
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {raceRooms.map(room => (
                  <div key={room.id} className="bg-[#020203] border border-zinc-900 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl">
                    <div className="flex justify-between items-start font-mono">
                      <div>
                        <h4 className="text-xs font-black uppercase text-white tracking-wide">{room.name}</h4>
                        <p className="text-[10px] text-zinc-500 mt-1">Дистанція: {room.distance} | Покриття: {room.coverage}</p>
                      </div>
                      <span className="text-emerald-400 text-xs font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30">₴ {room.bet.toLocaleString()}</span>
                    </div>

                    <div className="bg-[#070709] p-3 rounded-xl border border-zinc-900 flex justify-between items-center">
                      <div className="text-[10px] font-mono text-zinc-400">Гравці: <span className="text-white font-bold">{room.players.length} / 4</span></div>
                      <button onClick={() => startRaceSimulation(room)} className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase rounded-lg font-mono tracking-wider transition-all">
                        Залетіти на старт
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* СТОРІНКА: ГАМАНЕЦЬ */}
          {activeTab === "wallet" && (
            <div className="flex-1 p-8 overflow-y-auto max-w-2xl mx-auto space-y-6">
              <div className="bg-[#020203] border border-zinc-900 p-6 rounded-2xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Wallet className="h-40 w-40 text-emerald-500" /></div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Доступні активи синдикату</p>
                <h3 className="text-3xl font-black font-mono text-emerald-400 mt-1">₴ {balance.toLocaleString('uk-UA', { minimumFractionDigits: 2 })}</h3>
                
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button onClick={() => setBalance(prev => prev + 10000)} className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl tracking-wider font-mono transition-all">Поповнити карткою</button>
                  <button onClick={() => { if(balance >= 1000) { setBalance(prev => prev - 1000); alert("Заявку на вивід коштів успішно надіслано фінансовому менеджеру."); } else { alert("Мінімальний вивід від ₴ 1 000"); } }} className="py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-black text-xs uppercase rounded-xl tracking-wider font-mono transition-all">Вивести активи</button>
                </div>
              </div>

              <div className="space-y-2 font-mono">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 px-1">Історія фінансових транзакцій</h4>
                <div className="bg-[#020203] border border-zinc-900 rounded-xl p-2 divide-y divide-zinc-900/60 text-[11px]">
                  <div className="p-3 flex justify-between items-center"><span className="text-zinc-400">🏆 Бонус за активність у синдикаті</span><span className="text-emerald-400 font-bold">+ ₴ 2 500.00</span></div>
                  <div className="p-3 flex justify-between items-center"><span className="text-zinc-400">💳 Прямий депозит через LiqPay</span><span className="text-emerald-400 font-bold">+ ₴ 10 000.00</span></div>
                  <div className="p-3 flex justify-between items-center"><span className="text-zinc-400">🏁 Ставка на нічний перегон #2781</span><span className="text-red-500 font-bold">- ₴ 5 000.00</span></div>
                </div>
              </div>
            </div>
          )}

          {/* СТОРІНКА: VIP КЛУБ */}
          {activeTab === "vip" && (
            <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto space-y-6 font-mono">
              <div className="bg-gradient-to-r from-amber-500/10 via-red-600/5 to-transparent border border-amber-500/20 p-8 rounded-2xl text-center space-y-3">
                <Shield className="h-10 w-10 text-amber-500 mx-auto" />
                <h3 className="text-2xl font-black uppercase text-white tracking-tight">Елітні привілеї VIP-Клубу</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans">Отримуй ексклюзивні множники виграшів у перегонах, золотий колір нікнейму та зашифровані канали сповіщень.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: "vip_week", name: "WEEKLY PASS", price: 150, desc: "Швидкий старт, +5% до швидкості в заїздах, базовий префікс у рації." },
                  { id: "vip_month", name: "MONTHLY BOSS", price: 350, desc: "Вибір авторитетів. +15% до каси виграшу, пріоритет у кімнатах." },
                  { id: "vip_forever", name: "INFINITE HUSTLE", price: 990, desc: "Повний безліміт назавжди. Золотий нікнейм, +25% до балансу синдикату." }
                ].map(p => (
                  <div key={p.id} className="bg-[#020203] border border-zinc-900 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all">
                    <div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-black text-amber-400">{p.name}</span>
                        <span className="text-[10px] text-zinc-600">Активний</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-3 font-sans leading-relaxed">{p.desc}</p>
                    </div>
                    <div>
                      <div className="text-xl font-black text-white mb-2">₴ {p.price}</div>
                      <button onClick={() => {
                        if (balance >= p.price) {
                          setBalance(prev => prev - p.price);
                          setUserVip(p.name);
                          alert(`Статус ${p.name} успішно активовано та додано до вашого профілю!`);
                        } else {
                          alert("Недостатньо коштів на балансі!");
                        }
                      }} className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase text-[10px] rounded-lg tracking-wider transition-all">
                        Активувати
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* СТОРІНКА: АДМІН-ПАНЕЛЬ (РОЗПОДІЛ ОЧОК ХАРАКТЕРИСТИК) */}
          {activeTab === "admin" && (
            <div className="flex-1 p-8 overflow-y-auto max-w-xl mx-auto space-y-6 font-mono">
              <div className="bg-[#020203] border border-zinc-900 p-6 rounded-2xl space-y-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Розподіл очок характеристик мотоцикла</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Впливає на симуляцію та математику перемоги на Чернігівській трасі.</p>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 flex justify-between items-center text-xs">
                  <span>Доступні вільні очки для розподілу:</span>
                  <span className="text-red-500 font-bold text-sm bg-red-950/40 px-2 py-0.5 rounded border border-red-900/30">{availablePoints}</span>
                </div>

                <div className="space-y-4 pt-2">
                  {/* ШВИДКІСТЬ */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-300">Швидкість двигуна</span>
                      <span className="font-bold text-white">{stats.speed} / 100</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex-1 bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                        <div className="bg-red-600 h-full transition-all" style={{ width: `${stats.speed}%` }} />
                      </div>
                      <button onClick={() => setStats({...stats, speed: Math.min(100, stats.speed + 5)})} className="px-2 py-0.5 bg-zinc-800 text-white rounded text-[10px] font-bold border border-zinc-700">+</button>
                      <button onClick={() => setStats({...stats, speed: Math.max(0, stats.speed - 5)})} className="px-2 py-0.5 bg-zinc-800 text-white rounded text-[10px] font-bold border border-zinc-700">-</button>
                    </div>
                  </div>

                  {/* ЗЧЕПЛЕННЯ */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-300">Зчеплення (Гума Michelin)</span>
                      <span className="font-bold text-white">{stats.grip} / 100</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex-1 bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                        <div className="bg-emerald-500 h-full transition-all" style={{ width: `${stats.grip}%` }} />
                      </div>
                      <button onClick={() => setStats({...stats, grip: Math.min(100, stats.grip + 5)})} className="px-2 py-0.5 bg-zinc-800 text-white rounded text-[10px] font-bold border border-zinc-700">+</button>
                      <button onClick={() => setStats({...stats, grip: Math.max(0, stats.grip - 5)})} className="px-2 py-0.5 bg-zinc-800 text-white rounded text-[10px] font-bold border border-zinc-700">-</button>
                    </div>
                  </div>

                  {/* НІТРО */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-300">Нітро-система бусту</span>
                      <span className="font-bold text-white">{stats.nitro} / 100</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex-1 bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                        <div className="bg-amber-500 h-full transition-all" style={{ width: `${stats.nitro}%` }} />
                      </div>
                      <button onClick={() => setStats({...stats, nitro: Math.min(100, stats.nitro + 5)})} className="px-2 py-0.5 bg-zinc-800 text-white rounded text-[10px] font-bold border border-zinc-700">+</button>
                      <button onClick={() => setStats({...stats, nitro: Math.max(0, stats.nitro - 5)})} className="px-2 py-0.5 bg-zinc-800 text-white rounded text-[10px] font-bold border border-zinc-700">-</button>
                    </div>
                  </div>
                </div>

                <button onClick={() => { alert("Конфігурацію характеристик успішно записано в блокчейн-протокол синдикату."); setActiveTab("home"); }} className="w-full mt-4 py-2.5 bg-zinc-100 hover:bg-white text-black font-black text-xs uppercase rounded-xl tracking-wider transition-all">
                  Зберегти налаштування байку
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3. МОДАЛЬНЕ ВІКНО ДЛЯ ПЕРЕГЛЯДУ ІСТОРІЙ */}
      {activeStory && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4" onClick={() => setActiveStory(null)}>
          <div className="max-w-md w-full relative space-y-2 font-mono" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center text-xs text-zinc-400 px-2">
              <span className="font-bold text-white">@{activeStory.name} ({activeStory.time})</span>
              <button onClick={() => setActiveStory(null)} className="text-red-500 font-bold hover:text-red-400 uppercase text-[10px]">Закрити</button>
            </div>
            
            <div className="w-full h-[520px] bg-zinc-950 rounded-2xl overflow-hidden flex items-center justify-center border border-zinc-900 shadow-2xl relative">
              <img src={activeStory.media} alt="Story view" className="w-full h-full object-cover" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800/80">
                <div className="h-full bg-red-600 animate-pulse" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
