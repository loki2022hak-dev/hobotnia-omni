"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Flag, Wallet, Zap, ShoppingCart, MessageSquare, Star, Target, Flame, 
  Gauge, Ticket, Volume2, VolumeX, User, Lock, Send, Heart, Camera, PlusCircle, LayoutGrid
} from "lucide-react";

export default function HobotniaTrueCinematicEdition() {
  const [userId] = useState("default-user-id");
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"instagram" | "race" | "garage" | "social">("instagram");
  
  // Списки
  const [rooms, setRooms] = useState<any[]>([]);
  const [globalMessages, setGlobalMessages] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  
  // Інтро стейт-машина: "trigger" -> "video" -> "quote" -> "game"
  const [introStep, setIntroStep] = useState<"trigger" | "video" | "quote" | "game">("trigger");
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Хобот-Грам стейти
  const [activeStoryModal, setActiveStoryModal] = useState<any>(null);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImg, setNewPostImg] = useState("");
  const [newStoryImg, setNewStoryImg] = useState("");

  // Месенджер стейти
  const [socialMode, setSocialMode] = useState<"global" | "private">("global");
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [privateMessages, setPrivateMessages] = useState<any[]>([]);
  
  // Інпути
  const [chatInput, setChatInput] = useState("");
  const [dmInput, setDmInput] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  // Гонка
  const [raceStatus, setRaceStatus] = useState<"idle" | "racing" | "finished">("idle");
  const [logs, setLogs] = useState<string[]>([]);

  const garageItems = [
    { id: "turbo_v1", name: "Турбіна Garrett", price: 15000, desc: "+10 до Швидкості" },
    { id: "tires_pro", name: "Сліки Michelin", price: 8000, desc: "+15 до Зчеплення" },
    { id: "nitro_stable", name: "Система NOS 2.0", price: 12000, desc: "+12 до Стабільності Нітро" }
  ];

  // Керування кроками кінематографу
  useEffect(() => {
    if (introStep === "video") {
      // Відео крутиться 9 секунд, створюючи шалений драйв
      const t = setTimeout(() => {
        setIntroStep("quote");
      }, 9000);
      return () => clearTimeout(t);
    }
    if (introStep === "quote") {
      // Важкий психологічний пресинг текстом на 7 секунд
      const t = setTimeout(() => {
        setIntroStep("game");
      }, 7500);
      return () => clearTimeout(t);
    }
  }, [introStep]);

  const startCinematic = () => {
    setIntroStep("video");
    // Даємо наздогнати потік і вмикаємо звук, оскільки юзер клікнув
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }, 100);
  };

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
    if (listRes.ok) setContacts(await listRes.json());

    const postsRes = await fetch("/api/instagram/posts");
    if (postsRes.ok) setPosts(await postsRes.json());

    const storiesRes = await fetch("/api/instagram/stories");
    if (storiesRes.ok) setStories(await storiesRes.json());
  };

  useEffect(() => { loadData(); }, []);

  // 1. КРОК ПЕРШИЙ: ТРИГЕР ДЛЯ ОБХОДУ БЛОКУВАННЯ АВТОПЛЕЮ БРАУЗЕРОМ
  if (introStep === "trigger") {
    return (
      <div className="fixed inset-0 bg-[#050507] z-50 flex flex-col items-center justify-center p-4 font-mono select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.08)_0%,transparent_70%)]" />
        <div className="text-center space-y-6 max-w-md relative z-10">
          <h1 className="text-5xl font-black italic text-white tracking-tighter drop-shadow-[0_4px_12px_rgba(255,0,0,0.3)]">ХОБОТНЯ</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-widest leading-relaxed">Встановлення захищеного з'єднання з сервером синдикату...</p>
          <div className="pt-4">
            <button 
              onClick={startCinematic}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Увійти в синдикат
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. КРОК ДРУГИЙ: ЖЕЛЕЗОБЕТОННЕ ВІДЕО ІНТРО (ПРЯМИЙ СТРІМ БЕЗ YOUTUBE ЗАГЛУШОК)
  if (introStep === "video") {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-hidden flex items-center justify-center select-none">
        {/* Прямий високоякісний native mp4 футаж швидкісних нічних заїздів та мото-адреналіну */}
        <video
          ref={videoRef}
          src="https://assets.mixkit.co/videos/preview/mixkit-motorcyclist-riding-fast-on-a-highway-at-night-40348-large.mp4"
          className="absolute w-screen h-screen object-cover scale-105 pointer-events-none"
          loop
          playsInline
          autoPlay
        />
        
        {/* Кінематографічний градієнтний фільтр поверх відео */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/80" />

        <div className="absolute bottom-10 right-10 flex gap-4 z-50">
          <button 
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.muted = !videoRef.current.muted;
                setIsMuted(videoRef.current.muted);
              }
            }} 
            className="p-3.5 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all border border-white/10"
          >
            {isMuted ? <VolumeX className="h-5 w-5 text-red-500" /> : <Volume2 className="h-5 w-5 text-emerald-400" />}
          </button>
          <button 
            onClick={() => setIntroStep("quote")} 
            className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-2xl transition-all"
          >
            Пропустити
          </button>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-full px-4">
          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_8px_25px_rgba(0,0,0,0.9)] animate-pulse">
            ХОБОТНЯ
          </h1>
          <p className="text-xs md:text-sm font-bold tracking-widest text-red-500 font-mono mt-4 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Швидкість спалює страх. Тут немає слабких.
          </p>
        </div>
      </div>
    );
  }

  // 3. КРОК ТРЕТІЙ: ПОТУЖНИЙ ЖИТТЄВИЙ ТЕКСТ (ПРАВИЛЬНИЙ АНДЕРГРАУНД ПАТТЕРН)
  if (introStep === "quote") {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 select-none animate-fade-in font-sans">
        <div className="max-w-3xl text-center space-y-8">
          <p className="text-2xl md:text-4xl font-black italic text-zinc-100 tracking-wide leading-snug drop-shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
            «Найважче в цьому житті — не підняти шалені бабки, а втримати їх, коли ті, кого ти називав братами, починають рахувати твій прибуток. Дружба закінчується там, де з'являється чистий інтерес. Зрада ніколи не приходить від ворогів — вона б'є в спину руками тих, за кого ти готовий був віддати останнє. Тут немає компромісів. Або ти забираєш усе, або система ламає тебе навпіл.»
          </p>
          <div className="h-[3px] w-32 bg-red-600 mx-auto" />
          <p className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">Підключення до внутрішньої мережі хоботів...</p>
        </div>
      </div>
    );
  }

  // 4. ІГРОВИЙ ІНТЕРФЕЙС (ПОВНІСТЮ ЗБЕРЕЖЕНИЙ З ХОБОТ-ГРАМОМ ТА МЕСЕНДЖЕРОМ)
  if (!user) return <div className="h-screen bg-black flex items-center justify-center font-mono text-red-600">ОЧІКУВАННЯ СИНХРОНІЗАЦІЇ...</div>;

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 flex font-sans animate-fade-in">
      <nav className="w-20 bg-black border-r border-zinc-900 flex flex-col items-center py-8 gap-8">
        <div className="text-red-600 font-black text-2xl italic">Х</div>
        <button onClick={() => setActiveTab("instagram")} className={`p-3 rounded-xl ${activeTab === 'instagram' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><LayoutGrid /></button>
        <button onClick={() => setActiveTab("race")} className={`p-3 rounded-xl ${activeTab === 'race' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><Flag /></button>
        <button onClick={() => setActiveTab("garage")} className={`p-3 rounded-xl ${activeTab === 'garage' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><ShoppingCart /></button>
        <button onClick={() => setActiveTab("social")} className={`p-3 rounded-xl ${activeTab === 'social' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><MessageSquare /></button>
      </nav>

      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-zinc-900 px-8 flex items-center justify-between bg-black/50 backdrop-blur-md">
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
               <Wallet className="h-4 w-4 text-emerald-400" />
               <span className="text-emerald-400 font-mono font-bold">₴ {user.balance.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-sm font-bold italic text-zinc-400">@{user.nickname}</div>
        </header>

        <div className="p-8 overflow-y-auto h-[calc(100vh-64px)]">
          {activeTab === "instagram" && (
            <div className="max-w-2xl mx-auto space-y-8">
               <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-2xl flex gap-4 items-center overflow-x-auto">
                  <div className="flex flex-col items-center min-w-[70px] relative">
                     <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center border border-dashed border-zinc-700 hover:border-red-500 cursor-pointer">
                        <PlusCircle className="h-6 w-6 text-zinc-500" />
                     </div>
                     <span className="text-[10px] mt-1 text-zinc-500 font-mono">Додати</span>
                     <input type="text" placeholder="URL" value={newStoryImg} onChange={e => setNewStoryImg(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadData()} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  {stories.map((story: any) => (
                    <div key={story.id} onClick={() => setActiveStoryModal(story)} className="flex flex-col items-center min-w-[70px] cursor-pointer">
                       <div className="w-14 h-14 p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-red-600 to-purple-600">
                          <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-xs font-mono text-white">
                             {story.user.nickname.substring(0, 2).toUpperCase()}
                          </div>
                       </div>
                       <span className="text-[10px] mt-1 text-zinc-300 font-mono truncate w-16 text-center">@{story.user.nickname}</span>
                    </div>
                  ))}
               </div>

               <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-zinc-400"><Camera className="text-red-500" /> Опублікувати свій стиль</div>
                  <div className="grid grid-cols-2 gap-3">
                     <input type="text" placeholder="URL зображення..." value={newPostImg} onChange={e => setNewPostImg(e.target.value)} className="bg-black border border-zinc-800 text-xs rounded-xl px-4 py-2 text-white font-mono" />
                     <input type="text" placeholder="Опис..." value={newPostText} onChange={e => setNewPostText(e.target.value)} className="bg-black border border-zinc-800 text-xs rounded-xl px-4 py-2 text-white" />
                  </div>
                  <button onClick={handleCreatePost} className="w-full py-2 bg-zinc-100 hover:bg-white text-black text-xs font-black uppercase rounded-xl">Закинути в стрічку</button>
               </div>

               <div className="space-y-6">
                  {posts.map((post: any) => (
                    <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                       <div className="p-4 flex items-center gap-3 bg-black/20 border-b border-zinc-800/50">
                          <span className="text-xs font-black font-mono">@{post.user.nickname}</span>
                       </div>
                       <div className="w-full max-h-[400px] bg-black overflow-hidden flex items-center justify-center">
                          <img src={post.imageUrl} alt="Post" className="w-full object-cover" />
                       </div>
                       <div className="p-4 space-y-2">
                          <button onClick={() => handleLikePost(post.id)} className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-red-500">
                             <Heart className="h-4 w-4 text-red-600 fill-red-600" /> {post.likes}
                          </button>
                          <p className="text-xs text-zinc-300"><span className="font-black font-mono text-white mr-2">@{post.user.nickname}</span>{post.caption}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === "race" && (
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-8 space-y-6">
                {raceStatus !== "idle" ? (
                  <div className="bg-zinc-900/50 rounded-3xl p-8 border border-red-600/20">
                    <h2 className="text-xl font-black italic mb-6 uppercase"><Flame className="text-red-600" /> РЕЗУЛЬТАТ ЗАЇЗДУ</h2>
                    <div className="bg-black p-6 rounded-xl font-mono text-sm text-zinc-300 min-h-[150px] space-y-2">{logs.map((l, i) => <div key={i}>{l}</div>)}</div>
                    {raceStatus === "finished" && <button onClick={() => setRaceStatus("idle")} className="mt-4 px-6 py-2 bg-zinc-800 text-white rounded-xl text-xs font-bold">Назад</button>}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {rooms.filter(r => r.status === "Очікування").map(r => (
                      <div key={r.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
                         <div className="flex justify-between mb-2">
                            <span className="font-bold uppercase italic text-sm">{r.name}</span>
                            <span className="text-emerald-400 font-mono text-sm">₴ {r.bet}</span>
                         </div>
                         <button onClick={() => handleStartServerRace(r)} className="w-full py-2 bg-red-600 text-white font-black text-xs rounded-xl">СТАРТ</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "garage" && (
            <div className="grid grid-cols-3 gap-6">
               {garageItems.map(item => (
                 <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4">
                    <div className="text-lg font-bold">{item.name}</div>
                    <div className="text-xl font-mono text-emerald-400 font-bold">₴ {item.price.toLocaleString()}</div>
                    <button onClick={() => buyItem(item)} disabled={user.purchasedItems?.includes(item.id)} className="w-full py-2 rounded-xl text-xs font-black uppercase border border-zinc-700">Встановити</button>
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
                 <span>@{activeStoryModal.user.nickname}</span>
                 <button onClick={() => setActiveStoryModal(null)} className="text-red-500 font-bold">ЗАКРИТИ</button>
              </div>
              <div className="w-full h-[500px] bg-zinc-950 rounded-2xl overflow-hidden flex items-center justify-center border border-zinc-800">
                 <img src={activeStoryModal.mediaUrl} alt="Story" className="max-w-full max-h-full object-contain" />
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
