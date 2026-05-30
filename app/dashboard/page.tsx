"use client";
import React, { useState } from "react";
import { 
  Home, Compass, Layers, MessageSquare, Users, Flag, Trophy, Wallet, Star, Settings, 
  Search, Bell, Plus, Image, Send, Heart, MessageCircle, Share2, Shield, Play
} from "lucide-react";

export default function HobotniaDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  
  // Імітація реальних даних з макету для залізобетонного відображення
  const stories = [
    { id: 1, name: "Toretto", active: true },
    { id: 2, name: "NightRider", active: true },
    { id: 3, name: "DriftKing", active: true },
    { id: 4, name: "MotoLife", active: true },
    { id: 5, name: "SpeedDemon", active: true },
    { id: 6, name: "Ghost", active: true },
    { id: 7, name: "BikerBoy", active: true },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e4e4e7] flex font-sans antialiased selection:bg-red-600 selection:text-white">
      
      {/* ЛІВА НАВІГАЦІЙНА ПАНЕЛЬ (SIDEBAR) */}
      <aside className="w-64 bg-[#020203] border-r border-zinc-900 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 flex flex-col gap-1 border-b border-zinc-900">
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
              ХОБОТНЯ
            </h1>
            <span className="text-[9px] font-mono tracking-widest text-red-500 font-bold uppercase">
              Живи на швидкості
            </span>
          </div>
          
          <nav className="p-4 space-y-1.5">
            <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-2">Соцмережа</p>
            <button onClick={() => setActiveTab("home")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all ${activeTab === "home" ? "bg-gradient-to-r from-red-950/40 to-red-900/20 text-red-500 border-l-2 border-red-500" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"}`}>
              <Home className="h-4 w-4" /> Головна
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200">
              <Compass className="h-4 w-4" /> Стрічка
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200">
              <Layers className="h-4 w-4" /> Історії
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200">
              <MessageSquare className="h-4 w-4" /> Повідомлення <span className="ml-auto bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-sans">3</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200">
              <Users className="h-4 w-4" /> Друзі
            </button>

            <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-zinc-600 pt-4 mb-2">Онлайн-перегони</p>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200">
              <Flag className="h-4 w-4 text-red-500" /> Перегони
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200">
              <Trophy className="h-4 w-4 text-amber-500" /> Топ перегонів
            </button>

            <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-zinc-600 pt-4 mb-2">Гаманець</p>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200">
              <Wallet className="h-4 w-4" /> Гаманець
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200">
              <Star className="h-4 w-4 text-amber-400" /> VIP Клуб
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-900">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200">
            <Settings className="h-4 w-4" /> Налаштування
          </button>
        </div>
      </aside>

      {/* ЦЕНТРАЛЬНА ТА ПРАВА ЧАСТИНИ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* ХЕДЕР (ВЕРХНЯ ПАНЕЛЬ) */}
        <header className="h-16 bg-[#020203] border-b border-zinc-900 px-8 flex items-center justify-between shrink-0">
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input type="text" placeholder="Пошук..." className="w-full bg-[#0a0a0c] border border-zinc-900 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-red-600 font-mono transition-all" />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-1.5 text-zinc-400 hover:text-zinc-200">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            
            <div className="flex items-center gap-2 bg-[#0a0a0c] border border-zinc-800 px-4 py-1.5 rounded-xl font-mono text-xs font-bold text-amber-400">
              <span>₴ 12 450.00</span>
              <button className="ml-1 bg-red-600 text-white rounded-md p-0.5 hover:bg-red-700"><Plus className="h-3 w-3" /></button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-bold font-mono text-zinc-200">ХОБОТ</div>
                <div className="text-[9px] font-bold text-amber-500 font-mono tracking-widest">VIP GOLD</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-red-600 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <div className="w-full h-full bg-[#0a0a0c] rounded-full flex items-center justify-center font-black text-xs text-white">ХБ</div>
              </div>
            </div>
          </div>
        </header>

        {/* ОСНОВНИЙ КОНТЕНТ (СКРОЛ) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* ЛЕНТА (ЦЕНТР) */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            
            {/* БЛОК ІСТОРІЙ */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-black uppercase font-mono tracking-wider text-zinc-400">Історії</h3>
                <button className="text-[10px] font-mono text-zinc-600 uppercase hover:text-zinc-400">Дивитися всі</button>
              </div>
              <div className="bg-[#020203] border border-zinc-900/60 p-4 rounded-2xl flex gap-4 items-center overflow-x-auto shadow-sm">
                <div className="flex flex-col items-center min-w-[65px] group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-dashed border-zinc-800 flex items-center justify-center bg-zinc-900/40 group-hover:border-red-500 transition-all">
                    <Plus className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400" />
                  </div>
                  <span className="text-[9px] mt-1.5 text-zinc-500 font-mono font-bold">Ваша історія</span>
                </div>
                {stories.map(s => (
                  <div key={s.id} className="flex flex-col items-center min-w-[65px] cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-red-700 p-[2px] transition-all hover:scale-105">
                      <div className="w-full h-full bg-[#0a0a0c] rounded-full flex items-center justify-center text-[10px] font-bold font-mono text-white">
                        {s.name.substring(0,2).toUpperCase()}
                      </div>
                    </div>
                    <span className="text-[9px] mt-1.5 text-zinc-400 font-mono font-medium truncate w-14 text-center">@{s.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ДВОКОЛОНКОВИЙ ПЛАН: СТРІЧКА + АКТИВНІ ПЕРЕГОНИ */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* ПОСТ В СТРІЧЦІ */}
              <div className="space-y-3">
                <div className="flex gap-4 border-b border-zinc-900 pb-2">
                  <button className="text-xs font-black font-mono uppercase tracking-wider text-red-500 border-b-2 border-red-500 pb-1">Для тебе</button>
                  <button className="text-xs font-black font-mono uppercase tracking-wider text-zinc-500 pb-1 hover:text-zinc-300">Підписки</button>
                  <button className="text-xs font-black font-mono uppercase tracking-wider text-zinc-500 pb-1 hover:text-zinc-300">VIP</button>
                  <button className="text-xs font-black font-mono uppercase tracking-wider text-zinc-500 pb-1 hover:text-zinc-300">Популярне</button>
                </div>

                <div className="bg-[#020203] border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-4 flex items-center justify-between border-b border-zinc-950">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-zinc-300">NR</div>
                      <div>
                        <div className="text-xs font-bold font-mono text-zinc-200">NightRider</div>
                        <div className="text-[9px] font-mono text-zinc-600">2 год тому</div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 text-xs text-zinc-300 leading-relaxed font-sans">
                    Нічне місто. Швидкість. Свобода.
                  </div>
                  <div className="w-full h-64 bg-zinc-950 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80" alt="Motorcycle Night" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 bg-zinc-950/40 border-t border-zinc-950 flex items-center gap-4 text-zinc-500">
                    <button className="flex items-center gap-1.5 text-[11px] font-mono font-bold hover:text-red-500"><Heart className="h-4 w-4 text-red-600 fill-red-600" /> 128</button>
                    <button className="flex items-center gap-1.5 text-[11px] font-mono font-bold hover:text-zinc-300"><MessageCircle className="h-4 w-4" /> 24</button>
                    <button className="flex items-center gap-1.5 text-[11px] font-mono font-bold hover:text-zinc-300 ml-auto"><Share2 className="h-4 w-4" /> Поділитись</button>
                  </div>
                </div>
              </div>

              {/* АКТИВНІ ПЕРЕГОНИ */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-black uppercase font-mono tracking-wider text-zinc-400">Активні перегони</h3>
                  <button className="text-[10px] font-mono text-zinc-600 uppercase hover:text-zinc-400">Дивитися всі</button>
                </div>

                <div className="bg-[#020203] border border-zinc-900 rounded-2xl p-4 space-y-4 shadow-xl relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-black font-mono uppercase text-white flex items-center gap-1.5">
                        КІМНАТА #2781
                        <span className="bg-red-950 text-red-500 text-[9px] px-1.5 py-0.5 rounded border border-red-900/50 font-sans font-bold uppercase tracking-widest animate-pulse">В процесі</span>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 mt-0.5">Гравці: 4/4 | Ставка: ₴ 5 000</div>
                    </div>
                  </div>

                  {/* СТИЛІЗОВАНА МАПА ТРЕКУ ТА СЕТКА ГОНЩИКІВ */}
                  <div className="relative h-40 bg-zinc-950 rounded-xl border border-zinc-900 overflow-hidden flex items-center p-4">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    <div className="w-1/2 space-y-1.5 relative z-10 font-mono text-[10px]">
                      <div className="flex items-center gap-2 px-2 py-1 bg-zinc-900/80 rounded border border-zinc-800"><span className="text-red-500 font-bold">1</span> Toretto</div>
                      <div className="flex items-center gap-2 px-2 py-1 bg-red-950/40 rounded border border-red-900/50 text-red-400 font-bold"><span className="text-red-500">2</span> ХОБОТ</div>
                      <div className="flex items-center gap-2 px-2 py-1 bg-zinc-900/80 rounded border border-zinc-800 text-zinc-400"><span className="text-zinc-600">3</span> Shadow</div>
                      <div className="flex items-center gap-2 px-2 py-1 bg-zinc-900/80 rounded border border-zinc-800 text-zinc-400"><span className="text-zinc-600">4</span> NightRider</div>
                    </div>

                    <div className="w-1/2 h-full flex items-center justify-center relative">
                      <div className="w-24 h-24 border-4 border-dashed border-red-900/30 rounded-full animate-spin [animation-duration:20s]" />
                      <div className="absolute text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Телеметрія</div>
                    </div>
                  </div>

                  {/* РЕКЛАМНИЙ БАНЕР VIP */}
                  <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="text-xs font-black font-mono text-amber-400 tracking-wider uppercase">VIP CLUB</div>
                      <div className="text-[10px] text-zinc-400 font-sans mt-0.5">Стань легендою вулиць прямо зараз</div>
                    </div>
                    <button className="bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black uppercase px-4 py-2 rounded-lg font-mono tracking-wider transition-all">Дізнатись більше</button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ЧАТИ (ПРАВА ПАНЕЛЬ) */}
          <aside className="w-72 bg-[#020203] border-l border-zinc-900 p-4 flex flex-col justify-between shrink-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase font-mono tracking-wider text-zinc-400">Чати</h3>
                <button className="text-zinc-600 hover:text-zinc-400"><Plus className="h-4 w-4" /></button>
              </div>

              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-600" />
                <input type="text" placeholder="Пошук..." className="w-full bg-[#0a0a0c] border border-zinc-900 rounded-lg pl-8 pr-3 py-1.5 text-[11px] focus:outline-none font-mono" />
              </div>

              {/* СПИСОК КОРИСТУВАЧІВ У ЧАТІ */}
              <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
                <div className="p-2 flex items-center justify-between hover:bg-zinc-900/40 rounded-xl cursor-pointer border-l-2 border-red-500 bg-red-950/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-bold font-mono text-white">TO</div>
                    <div>
                      <div className="text-xs font-bold font-mono text-zinc-200">Toretto</div>
                      <div className="text-[10px] text-zinc-500 max-w-[140px] truncate">Давай на перегон?</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] font-mono text-zinc-600">10:30</div>
                    <span className="inline-block bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-0.5">2</span>
                  </div>
                </div>

                <div className="p-2 flex items-center justify-between hover:bg-zinc-900/40 rounded-xl cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-bold font-mono text-zinc-400">NR</div>
                    <div>
                      <div className="text-xs font-bold font-mono text-zinc-300">NightRider</div>
                      <div className="text-[10px] text-zinc-500 max-w-[140px] truncate">Гоу сьогодні ввечері</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] font-mono text-zinc-600">10:21</div>
                    <span className="inline-block bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-0.5">1</span>
                  </div>
                </div>

                {["MotoLife Club", "DriftKing", "BikerBoy"].map((name, idx) => (
                  <div key={idx} className="p-2 flex items-center gap-2.5 hover:bg-zinc-900/40 rounded-xl cursor-pointer">
                    <div className="w-7 h-7 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-[10px] font-mono text-zinc-500">HB</div>
                    <div>
                      <div className="text-xs font-medium font-mono text-zinc-400">{name}</div>
                      <div className="text-[10px] text-zinc-600 truncate max-w-[150px]">Звʼязок зашифровано...</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold font-mono uppercase tracking-wider text-zinc-300 transition-all">
              Показати всі чати
            </button>
          </aside>

        </div>
      </div>
    </div>
  );
}
