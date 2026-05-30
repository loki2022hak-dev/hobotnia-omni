"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Flag, Wallet, Zap, ShoppingCart, Star, Flame, Volume2, VolumeX, Heart, Camera, PlusCircle, LayoutGrid, ShieldAlert
} from "lucide-react";

export default function HobotniaEliteEdition() {
  const [userId] = useState("default-user-id");
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"instagram" | "race" | "garage" | "vip">("instagram");
  
  const [rooms, setRooms] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  
  const [introStep, setIntroStep] = useState<"check" | "trigger" | "video" | "quote" | "game">("check");
  const [isMuted, setIsMuted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [raceStatus, setRaceStatus] = useState<"idle" | "racing" | "finished">("idle");
  const [logs, setLogs] = useState<string[]>([]);

  const [activeStoryModal, setActiveStoryModal] = useState<any>(null);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImg, setNewPostImg] = useState("");
  const [newStoryImg, setNewStoryImg] = useState("");

  const vipPlans = [
    { id: "vip_week", name: "WEEKLY PASS", price: 150, period: "7 днів", desc: "Швидкий старт, +5% до виграшу, префікс у рації" },
    { id: "vip_month", name: "MONTHLY BOSS", price: 350, period: "30 днів", desc: "Вибір авторитетів, +15% до виграшу, пріоритет у кімнатах" },
    { id: "vip_forever", name: "INFINITE HUSTLE", price: 990, period: "Назавжди", desc: "Повний безліміт, +25% до каси, золотий нік" }
  ];

  const garageItems = [
    { id: "turbo_v1", name: "Турбіна Garrett", price: 15000, desc: "+10 до Швидкості" },
    { id: "tires_pro", name: "Сліки Michelin", price: 8000, desc: "+15 до Зчеплення" }
  ];

  useEffect(() => {
    if (introStep === "check") {
      const hasSeenIntro = localStorage.getItem("hobotnia_intro_seen");
      if (hasSeenIntro) {
        setIntroStep("game");
      } else {
        setIntroStep("trigger");
      }
    }
  }, [introStep]);

  useEffect(() => {
    if (introStep === "video") {
      const t = setTimeout(() => {
        setIntroStep("quote");
        if (audioRef.current) audioRef.current.volume = 0.2;
      }, 9500);
      return () => clearTimeout(t);
    }
    if (introStep === "quote") {
      const t = setTimeout(() => {
        setIntroStep("game");
        localStorage.setItem("hobotnia_intro_seen", "true");
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = "";
        }
      }, 8500);
      return () => clearTimeout(t);
    }
  }, [introStep]);

  const startCinematic = () => {
    setIntroStep("video");
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
        videoRef.current.muted = false;
      }
      if (audioRef.current) {
        audioRef.current.volume = 0.7;
        audioRef.current.play().catch(() => {});
      }
      setIsMuted(false);
    }, 150);
  };

  const skipIntro = () => {
    setIntroStep("game");
    localStorage.setItem("hobotnia_intro_seen", "true");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  };

  const loadData = async () => {
    try {
      const uRes = await fetch(`/api/user/profile?userId=${userId}`);
      if (uRes.ok) {
        const data = await uRes.json();
        if (data && data.profile) setUser(data.profile);
        else throw new Error();
      } else throw new Error();
    } catch (err) {
      setUser({ nickname: "Hobot_Gamer", balance: 12450.00, purchasedItems: [], vip: { isActive: true } });
    }
    try {
      fetch("/api/rooms").then(r => r.ok && r.json()).then(setRooms).catch(() => {});
      fetch("/api/instagram/posts").then(r => r.ok && r.json()).then(setPosts).catch(() => {});
      fetch("/api/instagram/stories").then(r => r.ok && r.json()).then(setStories).catch(() => {});
    } catch (e) {}
  };

  useEffect(() => { loadData(); }, []);

  const handleBuyVip = async (plan: any) => {
    try {
      const res = await fetch("/api/vip/buy", { method: "POST", body: JSON.stringify({ userId, planId: plan.id, amount: plan.price }) });
      const data = await res.json();
      alert(data.message || data.error || "Статус оновлено");
      loadData();
    } catch (e) {
      alert(`Локальний режим: статус ${plan.name} активовано!`);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostImg.trim()) return;
    try {
      const res = await fetch("/api/instagram/posts", { method: "POST", body: JSON.stringify({ userId, imageUrl: newPostImg, caption: newPostText }) });
      if (res.ok) { setNewPostImg(""); setNewPostText(""); loadData(); }
    } catch (e) {
      setPosts([{ id: Date.now().toString(), imageUrl: newPostImg, caption: newPostText, likes: 0, user: { nickname: user.nickname } }, ...posts]);
      setNewPostImg(""); setNewPostText("");
    }
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    fetch("/api/instagram/posts/like", { method: "POST", body: JSON.stringify({ postId }) }).catch(() => {});
  };

  const handleStartServerRace = (room: any) => {
    setRaceStatus("racing");
    setLogs(["⚡ [СЕРВЕР]: Запуск телеметрії...", "🏁 Гонщики вишикувалися на старті..."]);
    setTimeout(() => {
      setLogs([
        "⚡ [СЕРВЕР]: Запуск телеметрії...",
        "🏁 Гонщики вишикувалися на старті...",
        "🔥 Зчеплення зловило асфальт!",
        `🏆 Заїзд завершено! Переміг @${user.nickname}`,
        `💰 Каса + ₴ ${room.bet * 2} зараховано на баланс синдикату.`
      ]);
      setRaceStatus("finished");
    }, 2500);
  };

  if (introStep === "check" || introStep === "trigger") {
    return (
      <div className="fixed inset-0 bg-[#020203] z-50 flex flex-col items-center justify-center p-4 select-none h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.03)_0%,transparent_80%)]" />
        <div className="relative mb-12 animate-fade-in-down">
          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 via-zinc-400 to-zinc-600 uppercase drop-shadow-[0_0_25px_rgba(220,38,38,0.5)]">
            ХОБОТНЯ
          </h1>
          <h1 className="absolute inset-0 text-7xl md:text-9xl font-black italic tracking-tighter text-red-600 uppercase blur-[20px] opacity-70 -z-10">
            ХОБОТНЯ
          </h1>
        </div>
        <div className="text-center space-y-6 max-w-sm relative z-10 font-mono">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest animate-pulse">Ініціалізація зашифрованого протоколу синдикату...</p>
          <div className="pt-4 h-[70px]">
            {introStep === "trigger" && (
              <button onClick={startCinematic} className="w-full py-4 bg-gradient-to-r from-red-700 to-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98]">
                Увійти в синдикат
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (introStep === "video") {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-hidden flex items-center justify-center select-none">
        <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" loop />
        <video ref={videoRef} src="https://assets.mixkit.co/videos/preview/mixkit-motorcyclist-riding-fast-on-a-highway-at-night-40348-large.mp4" className="absolute w-screen h-screen object-cover scale-105 pointer-events-none" loop playsInline autoPlay />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/80" />
        <div className="absolute bottom-10 right-10 flex gap-4 z-50">
          <button onClick={() => { if (audioRef.current && videoRef.current) { setIsMuted(!isMuted); audioRef.current.muted = !audioRef.current.muted; videoRef.current.muted = !videoRef.current.muted; } }} className="p-3.5 bg-black/50 text-white rounded-full backdrop-blur-md border border-white/10">
            {isMuted ? <VolumeX className="h-5 w-5 text-red-500" /> : <Volume2 className="h-5 w-5 text-emerald-400" />}
          </button>
          <button onClick={skipIntro} className="px-6 py-3.5 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-2xl">Пропустити</button>
        </div>
      </div>
    );
  }

  if (introStep === "quote") {
    return (
      <div className="fixed inset-0 bg-[#020203] z-50 flex flex-col items-center justify-center p-6 select-none animate-fade-in font-sans">
        <div className="max-w-4xl text-center space-y-8 relative z-10 h-screen flex flex-col items-center justify-center">
          <p className="text-3xl md:text-5xl font-black italic text-zinc-100 tracking-tight leading-relaxed animate-quote-line1 opacity-0">
            «Гроші приходять і йдуть...»
          </p>
          <p className="text-xl md:text-2xl font-bold italic text-zinc-400 tracking-tight leading-relaxed animate-quote-line2 opacity-0">
            А зрада... зрада завжди б'є в спину руками тих,
          </p>
          <p className="text-3xl md:text-5xl font-black italic text-white tracking-tight leading-relaxed animate-quote-line3 opacity-0">
            кому ти довіряв свій руль.
          </p>
          <div className="h-[3px] w-28 bg-red-600 mx-auto mt-10 animate-fade-in-delayed opacity-0" />
          <p className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase animate-fade-in-delayed opacity-0">Синхронізація з серверами синдикату...</p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.04)_0%,transparent_70%)] -z-10" />
      </div>
    );
  }

  if (!user) return <div className="h-screen bg-[#050507] flex items-center justify-center font-mono text-red-600">ЗАВАНТАЖЕННЯ БАЗИ...</div>;

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 flex font-sans animate-fade-in">
      <nav className="w-20 bg-black border-r border-zinc-900 flex flex-col items-center py-8 gap-8">
        <div className="text-red-600 font-black text-2xl italic">Х</div>
        <button onClick={() => setActiveTab("instagram")} className={`p-3 rounded-xl ${activeTab === 'instagram' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><LayoutGrid /></button>
        <button onClick={() => setActiveTab("race")} className={`p-3 rounded-xl ${activeTab === 'race' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><Flag /></button>
        <button onClick={() => setActiveTab("garage")} className={`p-3 rounded-xl ${activeTab === 'garage' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><ShoppingCart /></button>
        <button onClick={() => setActiveTab("vip")} className={`p-3 rounded-xl ${activeTab === 'vip' ? 'bg-amber-500 text-black font-black' : 'text-zinc-600'}`}><Star /></button>
      </nav>

      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-zinc-900 px-8 flex items-center justify-between bg-black/50 backdrop-blur-md">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
               <Wallet className="h-4 w-4 text-emerald-400" />
               <span className="text-emerald-400 font-mono font-bold">₴ {user.balance.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-xs font-bold italic text-zinc-400 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>@{user.nickname}</span>
          </div>
        </header>

        <div className="p-8 overflow-y-auto h-[calc(100vh-64px)]">
          {activeTab === "instagram" && (
            <div className="max-w-2xl mx-auto space-y-8">
               <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-2xl flex gap-4 items-center overflow-x-auto">
                  <div className="flex flex-col items-center min-w-[70px] relative">
                     <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center border border-dashed border-zinc-700 hover:border-red-500 cursor-pointer">
                        <PlusCircle className="h-6 w-6 text-zinc-500" />
                     </div>
                     <span className="text-[10px] mt-1 text-zinc-500 font-mono truncate w-16 text-center">Додати</span>
                     <input type="text" placeholder="URL" value={newStoryImg} onChange={e => setNewStoryImg(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  {stories.map((story: any) => (
                    <div key={story.id} onClick={() => setActiveStoryModal(story)} className="flex flex-col items-center min-w-[70px] cursor-pointer">
                       <div className="w-14 h-14 p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-red-600 to-purple-600">
                          <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-xs font-mono text-white">
                             {story.user?.nickname?.substring(0, 2).toUpperCase() || "HB"}
                          </div>
                       </div>
                       <span className="text-[10px] mt-1 text-zinc-300 font-mono truncate w-16 text-center">@{story.user?.nickname}</span>
                    </div>
                  ))}
               </div>

               <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-zinc-400"><Camera className="text-red-500" /> Поділитися стилем синдикату</div>
                  <div className="grid grid-cols-2 gap-3">
                     <input type="text" placeholder="URL зображення..." value={newPostImg} onChange={e => setNewPostImg(e.target.value)} className="bg-black border border-zinc-800 text-xs rounded-xl px-4 py-2.5 text-white font-mono" />
                     <input type="text" placeholder="Підпис до фото..." value={newPostText} onChange={e => setNewPostText(e.target.value)} className="bg-black border border-zinc-800 text-xs rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <button onClick={handleCreatePost} className="w-full py-3 bg-zinc-100 hover:bg-white text-black text-xs font-black uppercase rounded-xl">Закинути в стрічку</button>
               </div>

               <div className="space-y-6">
                  {posts.map((post: any) => (
                    <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                       <div className="p-4 flex items-center gap-3 bg-black/20 border-b border-zinc-800/50 font-mono">
                          <span className="text-xs font-black text-white">@{post.user?.nickname || "anonymous"}</span>
                       </div>
                       <div className="w-full max-h-[400px] bg-black overflow-hidden flex items-center justify-center">
                          <img src={post.imageUrl} alt="Post" className="w-full object-cover" />
                       </div>
                       <div className="p-4 space-y-2">
                          <button onClick={() => handleLikePost(post.id)} className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-red-500">
                             <Heart className="h-4 w-4 text-red-600 fill-red-600" /> {post.likes}
                          </button>
                          <p className="text-xs text-zinc-300"><span className="font-black font-mono text-white mr-2">@{post.user?.nickname || "anon"}</span>{post.caption}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === "vip" && (
            <div className="max-w-4xl mx-auto space-y-6">
               <div className="bg-gradient-to-r from-amber-500/10 to-red-600/10 border border-amber-500/20 p-8 rounded-3xl text-center space-y-3">
                  <ShieldAlert className="h-10 w-10 text-amber-500 mx-auto" />
                  <h2 className="text-3xl font-black uppercase text-white tracking-tight">Привілеї синдикату</h2>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto font-mono">Множник каси, авторитет у чатах та Даркнет імунітет.</p>
               </div>
               <div className="grid grid-cols-3 gap-6">
                  {vipPlans.map(plan => (
                    <div key={plan.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-between hover:border-amber-500/40 transition-all space-y-4 shadow-xl">
                       <div>
                          <div className="flex justify-between items-center font-mono">
                             <span className="text-xs font-black uppercase text-amber-400 tracking-wider">{plan.name}</span>
                             <span className="text-[10px] text-zinc-500">{plan.period}</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-4 leading-relaxed">{plan.desc}</p>
                       </div>
                       <div>
                          <div className="text-2xl font-mono font-black text-white mb-3">₴ {plan.price}</div>
                          <button onClick={() => handleBuyVip(plan)} className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase text-xs rounded-xl">Активувати</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === "race" && (
            <div className="max-w-4xl mx-auto space-y-6">
                {raceStatus !== "idle" ? (
                  <div className="bg-zinc-900/50 rounded-3xl p-8 border border-red-600/20 shadow-2xl">
                    <h2 className="text-xl font-black italic mb-6 uppercase flex items-center gap-2"><Flame className="text-red-600" /> Телеметрія заїзду (Сервер)</h2>
                    <div className="bg-black p-6 rounded-xl font-mono text-sm text-zinc-300 min-h-[180px] space-y-2 border border-zinc-800">{logs.map((l, i) => <div key={i}>{l}</div>)}</div>
                    {raceStatus === "finished" && <button onClick={() => setRaceStatus("idle")} className="mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold font-mono">Назад в лобі</button>}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                         <div className="flex justify-between items-start">
                            <div>
                               <h3 className="font-black uppercase italic text-sm text-white">Чернігівська Траса (Ніч)</h3>
                               <p className="text-[11px] text-zinc-500 mt-1 font-mono">Дистанція: 400 км. Покриття: сухий асфальт.</p>
                            </div>
                            <span className="text-emerald-400 font-mono text-sm font-bold">₴ 2,500</span>
                         </div>
                         <button onClick={() => handleStartServerRace({ id: "room1", bet: 2500 })} className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl uppercase tracking-wider">Залетіти на старт</button>
                     </div>
                  </div>
                )}
            </div>
          )}

          {activeTab === "garage" && (
            <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
               {garageItems.map(item => (
                 <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex justify-between items-center shadow-xl">
                    <div>
                       <div className="text-sm font-bold text-white uppercase">{item.name}</div>
                       <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{item.desc}</div>
                    </div>
                    <div className="text-right space-y-2">
                       <div className="text-sm font-mono text-emerald-400 font-bold">₴ {item.price.toLocaleString()}</div>
                       <button className="px-4 py-1.5 bg-zinc-800 text-white text-[11px] font-black uppercase rounded-lg border border-zinc-700">Купити</button>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </main>

      {activeStoryModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 animate-fade-in" onClick={() => setActiveStoryModal(null)}>
           <div className="max-w-md w-full relative space-y-2" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center text-xs font-mono text-zinc-400 px-2">
                 <span>@{activeStoryModal.user?.nickname || "ХОБОТ"}</span>
                 <button onClick={() => setActiveStoryModal(null)} className="text-red-500 font-bold hover:text-red-400">ЗАКРИТИ</button>
              </div>
              <div className="w-full h-[500px] bg-zinc-950 rounded-2xl overflow-hidden flex items-center justify-center border border-zinc-800 shadow-2xl">
                 <img src={activeStoryModal.mediaUrl} alt="Story" className="max-w-full max-h-full object-contain" onError={(e:any)=>{e.target.src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80"}}/>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
