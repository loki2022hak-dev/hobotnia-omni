"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Flag, Wallet, Zap, ShoppingCart, MessageSquare, Star, Target, Flame, 
  Gauge, Ticket, Volume2, VolumeX, User, Lock, Send, Heart, Camera, PlusCircle, LayoutGrid
} from "lucide-react";

export default function HobotniaInstagramEdition() {
  const [userId] = useState("default-user-id");
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"race" | "garage" | "social" | "instagram">("instagram");
  
  // Списки
  const [rooms, setRooms] = useState<any[]>([]);
  const [globalMessages, setGlobalMessages] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  
  // Хобот-Грам стейти
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [activeStoryModal, setActiveStoryModal] = useState<any>(null);
  
  // Створення контенту
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
    if (listRes.ok) setContacts(await listRes.json());

    // Завантаження Хобот-Грама
    const postsRes = await fetch("/api/instagram/posts");
    if (postsRes.ok) setPosts(await postsRes.json());

    const storiesRes = await fetch("/api/instagram/stories");
    if (storiesRes.ok) setStories(await storiesRes.json());
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (selectedContact) {
      fetch(`/api/messages/dm?userId=${userId}&contactId=${selectedContact.id}`)
        .then(res => res.json())
        .then(data => setPrivateMessages(Array.isArray(data) ? data : []));
    }
  }, [selectedContact]);

  const handleCreatePost = async () => {
    if (!newPostImg.trim()) return;
    const res = await fetch("/api/instagram/posts", {
      method: "POST",
      body: JSON.stringify({ userId, imageUrl: newPostImg, caption: newPostText })
    });
    if (res.ok) { setNewPostImg(""); setNewPostText(""); loadData(); }
  };

  const handleAddStory = async () => {
    if (!newStoryImg.trim()) return;
    const res = await fetch("/api/instagram/stories", {
      method: "POST",
      body: JSON.stringify({ userId, mediaUrl: newStoryImg })
    });
    if (res.ok) { setNewStoryImg(""); loadData(); }
  };

  const handleLikePost = async (postId: string) => {
    const res = await fetch("/api/instagram/posts/like", {
      method: "POST",
      body: JSON.stringify({ postId })
    });
    if (res.ok) loadData();
  };

  const sendGlobalMessage = async () => {
    if (!chatInput.trim()) return;
    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ userId, text: chatInput }) });
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
      const freshDMs = await fetch(`/api/messages/dm?userId=${userId}&contactId=${selectedContact.id}`).then(r => r.json());
      setPrivateMessages(freshDMs);
    }
  };

  const handleActivatePromo = async () => {
    if (!promoInput.trim()) return;
    const res = await fetch("/api/promo", { method: "POST", body: JSON.stringify({ userId, code: promoInput }) });
    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) { setPromoInput(""); loadData(); }
  };

  const handleStartServerRace = async (room: any) => {
    setRaceStatus("racing");
    setLogs(["⚡ [СЕРВЕР]: Запуск симуляції..."]);
    const res = await fetch("/api/rooms/simulate", { method: "POST", body: JSON.stringify({ roomId: room.id, userId }) });
    const data = await res.json();
    setTimeout(() => { setRaceStatus("finished"); setLogs(data.logs); loadData(); }, 2000);
  };

  if (introStep === "video") {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-hidden flex items-center justify-center">
        <iframe className="absolute w-screen h-screen object-cover scale-125 pointer-events-none border-0" src={`https://www.youtube.com/embed/5-b076HhYF4?autoplay=1&controls=0&mute=${isMuted ? 1 : 0}&loop=1&playlist=5-b076HhYF4&start=12`} allow="autoplay; encrypted-media" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
        <div className="absolute bottom-10 right-10 flex gap-4 z-50">
          <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-white/10 text-white rounded-full backdrop-blur-md border border-white/20">{isMuted ? <VolumeX /> : <Volume2 />}</button>
          <button onClick={() => setIntroStep("quote")} className="px-6 py-3 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl">Пропустити інтро</button>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white uppercase">ХОБОТНЯ</h1>
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
      {/* SIDEBAR */}
      <nav className="w-20 bg-black border-r border-zinc-900 flex flex-col items-center py-8 gap-8">
        <div className="text-red-600 font-black text-2xl italic">Х</div>
        <button onClick={() => setActiveTab("instagram")} className={`p-3 rounded-xl ${activeTab === 'instagram' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><LayoutGrid /></button>
        <button onClick={() => setActiveTab("race")} className={`p-3 rounded-xl ${activeTab === 'race' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><Flag /></button>
        <button onClick={() => setActiveTab("garage")} className={`p-3 rounded-xl ${activeTab === 'garage' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><ShoppingCart /></button>
        <button onClick={() => setActiveTab("social")} className={`p-3 rounded-xl ${activeTab === 'social' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}><MessageSquare /></button>
      </nav>

      {/* CORE WORKSPACE */}
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
          
          {/* ХОБОТ-ГРАМ ІНТЕРФЕЙС */}
          {activeTab === "instagram" && (
            <div className="max-w-2xl mx-auto space-y-8">
               
               {/* СТОРІС СТРІЧКА */}
               <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-2xl flex gap-4 items-center overflow-x-auto">
                  <div className="flex flex-col items-center min-w-[70px] relative">
                     <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center border border-dashed border-zinc-700 hover:border-red-500 cursor-pointer">
                        <PlusCircle className="h-6 w-6 text-zinc-500" />
                     </div>
                     <span className="text-[10px] mt-1 text-zinc-500 font-mono">Додати</span>
                     <input 
                       type="text" 
                       placeholder="URL картики" 
                       value={newStoryImg}
                       onChange={e => setNewStoryImg(e.target.value)}
                       onKeyDown={e => e.key === 'Enter' && handleAddStory()}
                       className="absolute inset-0 opacity-0 cursor-pointer" 
                     />
                  </div>

                  {stories.map((story: any) => (
                    <div key={story.id} onClick={() => setActiveStoryModal(story)} className="flex flex-col items-center min-w-[70px] cursor-pointer">
                       <div className="w-14 h-14 p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-red-600 to-purple-600">
                          <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-xs font-mono border border-black text-white">
                             {story.user.nickname.substring(0, 2).toUpperCase()}
                          </div>
                       </div>
                       <span className="text-[10px] mt-1 text-zinc-300 font-mono truncate w-16 text-center">@{story.user.nickname}</span>
                    </div>
                  ))}
               </div>

               {/* СТВОРЕННЯ НОВОГО ПОСТУ */}
               <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-zinc-400"><Camera className="text-red-500" /> Опублікувати свій контент</div>
                  <div className="grid grid-cols-2 gap-3">
                     <input type="text" placeholder="URL зображення машини / кешу..." value={newPostImg} onChange={e => setNewPostImg(e.target.value)} className="bg-black border border-zinc-800 text-xs rounded-xl px-4 py-2 focus:outline-none focus:border-red-600 text-white font-mono" />
                     <input type="text" placeholder="Життєвий підпис до фото..." value={newPostText} onChange={e => setNewPostText(e.target.value)} className="bg-black border border-zinc-800 text-xs rounded-xl px-4 py-2 focus:outline-none focus:border-red-600 text-white" />
                  </div>
                  <button onClick={handleCreatePost} className="w-full py-2 bg-zinc-100 hover:bg-white text-black text-xs font-black uppercase rounded-xl transition-all">Закинути в стрічку</button>
               </div>

               {/* СТРІЧКА ПОСТІВ СИНДИКАТУ */}
               <div className="space-y-6">
                  {posts.length === 0 ? (
                    <div className="text-center py-12 text-xs font-mono text-zinc-600">Постів поки немає. Будь першим, хто закине контент!</div>
                  ) : (
                    posts.map((post: any) => (
                      <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                         <div className="p-4 flex items-center gap-3 bg-black/20 border-b border-zinc-800/50">
                            <div className="w-7 h-7 bg-red-600/20 rounded-full border border-red-600/30 flex items-center justify-center text-[10px] font-black text-red-500">H</div>
                            <span className="text-xs font-black font-mono">@{post.user.nickname}</span>
                         </div>
                         <div className="w-full max-h-[400px] bg-black overflow-hidden flex items-center justify-center">
                            <img src={post.imageUrl} alt="Post image" className="w-full object-cover" onError={(e:any)=>{e.target.src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80"}} />
                         </div>
                         <div className="p-4 space-y-2">
                            <div className="flex items-center gap-4">
                               <button onClick={() => handleLikePost(post.id)} className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-red-500 transition-colors">
                                  <Heart className="h-4 w-4 text-red-600 fill-red-600" /> {post.likes}
                               </button>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed"><span className="font-black font-mono text-white mr-2">@{post.user.nickname}</span>{post.caption}</p>
                         </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
          )}

          {/* МОДАЛКА ДЛЯ ПЕРЕГЛЯДУ СТОРІС */}
          {activeStoryModal && (
            <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 animate-fade-in" onClick={() => setActiveStoryModal(null)}>
               <div className="max-w-md w-full relative space-y-2" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center text-xs font-mono text-zinc-400 px-2">
                     <span>СВІЖА СТОРІС ВІД @{activeStoryModal.user.nickname}</span>
                     <button onClick={() => setActiveStoryModal(null)} className="text-red-500 font-bold">ЗАКРИТИ</button>
                  </div>
                  <div className="w-full h-[500px] bg-zinc-950 rounded-2xl overflow-hidden flex items-center justify-center border border-zinc-800">
                     <img src={activeStoryModal.mediaUrl} alt="Story content" className="max-w-full max-h-full object-contain" />
                  </div>
               </div>
            </div>
          )}

          {/* ІНШІ ТАБИ (БЕЗ ЗМІН ЛОГІКИ) */}
          {activeTab === "race" && (
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-8 space-y-6">
                {raceStatus !== "idle" ? (
                  <div className="bg-zinc-900/50 rounded-3xl p-8 border border-red-600/20">
                    <h2 className="text-xl font-black italic mb-6 uppercase flex items-center gap-2"><Flame className="text-red-600" /> СЕРВЕРНИЙ РЕЗУЛЬТАТ</h2>
                    <div className="bg-black p-6 rounded-xl font-mono text-sm text-zinc-300 min-h-[150px] space-y-2 border border-zinc-800">{logs.map((l, i) => <div key={i}>{l}</div>)}</div>
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
              <div className="col-span-4">
                 <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                    <input type="text" value={promoInput} onChange={e => setPromoInput(e.target.value)} placeholder="Промокод" className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white" />
                    <button onClick={handleActivatePromo} className="w-full py-2 bg-zinc-100 text-black font-black text-xs rounded-xl">OK</button>
                 </div>
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

          {activeTab === "social" && (
            <div className="grid grid-cols-12 gap-6 h-[500px] bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
               <div className="col-span-4 border-r border-zinc-800 flex flex-col bg-black/20">
                  <div className="p-4 border-b border-zinc-800 flex gap-2">
                     <button onClick={() => setSocialMode("global")} className={`flex-1 py-1.5 text-xs font-black uppercase rounded-lg ${socialMode === 'global' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>Глобальний</button>
                     <button onClick={() => setSocialMode("private")} className={`flex-1 py-1.5 text-xs font-black uppercase rounded-lg ${socialMode === 'private' ? 'bg-red-600 text-white' : 'text-zinc-400 bg-zinc-800'}`}>DM</button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2">
                     {socialMode === "private" && contacts.map(c => (
                       <button key={c.id} onClick={() => setSelectedContact(c)} className={`w-full p-2.5 rounded-xl font-mono text-xs text-left ${selectedContact?.id === c.id ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}>@{c.nickname}</button>
                     ))}
                  </div>
               </div>
               <div className="col-span-8 flex flex-col h-full bg-black/40">
                  {socialMode === "global" ? (
                    <>
                      <div className="flex-1 overflow-y-auto p-4 space-y-2">
                         {globalMessages.map((m: any) => <div key={m.id} className="text-xs font-mono"><span className="text-red-500">@{m.user.nickname}:</span> {m.text}</div>)}
                      </div>
                      <div className="p-3 bg-black/60 border-t border-zinc-800 flex gap-2">
                         <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendGlobalMessage()} placeholder="Рація..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-xs text-white outline-none" />
                         <button onClick={sendGlobalMessage} className="p-2 bg-red-600 rounded-xl text-white"><Send className="h-3.5 w-3.5" /></button>
                      </div>
                    </>
                  ) : selectedContact ? (
                    <>
                      <div className="flex-1 overflow-y-auto p-4 space-y-2">
                         {privateMessages.map((m: any) => <div key={m.id} className="text-xs font-mono"><span className="text-zinc-500">@{m.sender.nickname}:</span> {m.text}</div>)}
                      </div>
                      <div className="p-3 bg-black/60 border-t border-zinc-800 flex gap-2">
                         <input type="text" value={dmInput} onChange={e => setDmInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendPrivateMessage()} placeholder="Приват..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-xs text-white outline-none" />
                         <button onClick={sendPrivateMessage} className="p-2 bg-red-600 rounded-xl text-white"><Send className="h-3.5 w-3.5" /></button>
                      </div>
                    </>
                  ) : <div className="text-center p-12 text-xs text-zinc-600 font-mono">Виберіть контакт</div>}
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
