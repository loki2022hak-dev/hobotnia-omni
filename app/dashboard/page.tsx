"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Home, MessageSquare, History, Flag, Wallet, 
  Heart, Send, ChevronDown, ArrowDownLeft, ArrowUpRight,
  Zap, Trophy, Play, Skull, RefreshCw, Sparkles
} from "lucide-react";

interface RacingRoom {
  id: string;
  name: string;
  bet: number;
  playersCount: number;
  playersMax: number;
  status: string;
  trackName: string;
  trackLength: string;
  trackType: string;
  turns: number;
  creatorId: string;
}

interface DbTransaction {
  id: string;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL";
  status: string;
  txHash: string;
  createdAt: string;
}

interface RaceParticipant {
  id: string;
  name: string;
  progress: number;
  speedMultiplier: number;
  isBusted: boolean;
  isNitroUsed: boolean;
}

export default function HobotniaDashboard() {
  const [userId] = useState<string>("default-user-id");
  const [userNickname, setUserNickname] = useState<string>("ХОБОТ");
  
  const [balance, setBalance] = useState<number>(12450.00);
  const [stats, setStats] = useState({ speed: 40, grip: 30, nitro: 30 });
  const [vipTier, setVipTier] = useState<string>("GOLD");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Стан створення кімнати
  const [roomNameInput, setRoomNameInput] = useState<string>("Заруба на Жигулях");
  const [roomBetSelect, setRoomBetSelect] = useState<number>(5000);
  const [roomTypeSelect, setRoomTypeSelect] = useState<string>("Дрифт");

  // Списки з БД
  const [rooms, setRooms] = useState<RacingRoom[]>([]);
  const [transactions, setTransactions] = useState<DbTransaction[]>([]);

  // Стан активної симуляції гонки
  const [activeRaceRoom, setActiveRaceRoom] = useState<RacingRoom | null>(null);
  const [raceParticipants, setRaceParticipants] = useState<RaceParticipant[]>([]);
  const [raceStatus, setRaceStatus] = useState<"idle" | "racing" | "finished">("idle");
  const [raceLog, setRaceLog] = useState<string[]>([]);
  const [winnerId, setWinnerId] = useState<string | null>(null);

  // Завантаження профілю та кімнат
  async function loadDashboardData() {
    try {
      setIsLoading(true);
      const vipRes = await fetch(`/api/vip?userId=${userId}`);
      if (vipRes.ok) {
        const vipData = await vipRes.json();
        setBalance(vipData.user.walletBalance);
        setUserNickname(vipData.user.nickname || "ХОБОТ");
        setStats({
          speed: vipData.user.speed,
          grip: vipData.user.grip,
          nitro: vipData.user.nitro
        });
        setVipTier(vipData.vipStatus);
        if (vipData.user.transactions) setTransactions(vipData.user.transactions);
      }

      const roomsRes = await fetch("/api/rooms");
      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        setRooms(roomsData);
      }
    } catch (err) {
      console.error("Помилка синхронізації:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  // Зміна повзунків конфігу автомобіля
  const handleStatSliderChange = async (statName: keyof typeof stats, value: number) => {
    const freshStats = { ...stats, [statName]: value };
    if (freshStats.speed + freshStats.grip + freshStats.nitro <= 100) {
      setStats(freshStats);
      try {
        await fetch("/api/vip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, ...freshStats })
        });
      } catch (err) {
        console.error("Помилка збереження пресету:", err);
      }
    }
  };

  // Створення кімнати (Лобі)
  const handleCreateRoom = async () => {
    if (!roomNameInput.trim() || balance < roomBetSelect) return;
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: roomNameInput,
          bet: roomBetSelect,
          playersMax: 4,
          trackType: roomTypeSelect,
          userId: userId
        })
      });
      if (res.ok) await loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Ініціалізація гонки для вибраної кімнати
  const handleStartRaceSimulation = (room: RacingRoom) => {
    setActiveRaceRoom(room);
    setRaceStatus("racing");
    setWinnerId(null);
    setRaceLog(["🏁 Гонка почалася! Двигуни ревуть на старті..."]);

    // Генеруємо суперників на основі типу траси
    setRaceParticipants([
      { id: userId, name: `${userNickname} (Ти)`, progress: 0, speedMultiplier: 1, isBusted: false, isNitroUsed: false },
      { id: "bot-1", name: "Він Дізель з АТБ", progress: 0, speedMultiplier: 1, isBusted: false, isNitroUsed: false },
      { id: "bot-2", name: "Привид Києва на Секторі", progress: 0, speedMultiplier: 1, isBusted: false, isNitroUsed: false },
      { id: "bot-3", name: "Перекуп з Луцька", progress: 0, speedMultiplier: 1, isBusted: false, isNitroUsed: false },
    ]);
  };

  // Двигун симуляції (Game Loop)
  useEffect(() => {
    if (raceStatus !== "racing") return;

    const interval = setInterval(() => {
      setRaceParticipants(prev => {
        const updated = prev.map(p => {
          if (p.isBusted || p.progress >= 100) return p;

          // Розрахунок випадкових подій на основі конфігу гравця
          let step = Math.random() * 6 + 2; 

          if (p.id === userId) {
            // Вплив Швидкості
            step += (stats.speed / 20);

            // Шанс вильоту на повороті (Зчеплення захищає)
            const crashChance = Math.random() * 100;
            if (crashChance > 80 + (stats.grip / 2)) {
              p.isBusted = true;
              setRaceLog(l => [...l, `💥 О ні! Твоє зчеплення підвело, ти влетів у відбійник!`]);
              return p;
            }
          } else {
            // Логіка для ботів
            step += Math.random() * 2;
            if (Math.random() > 0.96 && !p.isBusted) {
              p.isBusted = true;
              setRaceLog(l => [...l, `💀 Супротивник [${p.name}] не впорався з керуванням і зійшов з дистанції!`]);
            }
          }

          const newProgress = Math.min(p.progress + step * p.speedMultiplier, 100);
          
          // Перевірка фінішу
          if (newProgress >= 100 && !winnerId) {
            setWinnerId(p.id);
            setRaceStatus("finished");
            handleRaceResolution(p.id);
          }

          return { ...p, progress: newProgress };
        });
        return updated;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [raceStatus, winnerId]);

  // Ручна активація НІТРО гравцем під час гонки
  const handleTriggerNitro = () => {
    setRaceParticipants(prev => prev.map(p => {
      if (p.id === userId && !p.isNitroUsed && !p.isBusted) {
        setRaceLog(l => [...l, `🔥 ТИ ТИСНЕШ КНОПКУ НІТРО! Машина зривається в гіперпростір!`]);
        // Даємо колосальний буст до швидкості, але є ризик згоріти (якщо кастомне нітро нестабільне)
        const isSafe = stats.nitro > Math.random() * 30;
        if (!isSafe) {
          setRaceLog(l => [...l, `💥 Двигун не витримав тиску нітро і вибухнув! Повна дискваліфікація.`]);
          return { ...p, isBusted: true, LoganNitroUsed: true };
        }
        return { ...p, speedMultiplier: 2.2, isNitroUsed: true };
      }
      return p;
    }));
  };

  // Відправка результатів на бекенд в ACID-транзакцію
  const handleRaceResolution = async (winningId: string) => {
    if (!activeRaceRoom) return;
    
    const logs = winningId === userId 
      ? `🏆 ТИ ПЕРЕМІГ! Весь призовий фонд твій!` 
      : `❌ Переміг [${raceParticipants.find(p => p.id === winningId)?.name}]. Пощастить наступного разу!`;
    
    setRaceLog(l => [...l, logs]);

    try {
      const res = await fetch("/api/rooms/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: activeRaceRoom.id,
          winnerId: winningId === userId ? userId : "bot-1" // Якщо виграв бот, гроші списуються в дохід системи
        })
      });
      if (res.ok) await loadDashboardData();
    } catch (err) {
      console.error("Помилка фіксації результату:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#060609] text-zinc-100 font-sans antialiased selection:bg-red-600">
      <div className="flex min-h-screen">
        
        {/* SIDEBAR */}
        <aside className="w-[240px] bg-[#0a0a0f] border-r border-zinc-900 flex flex-col justify-between p-4 flex-shrink-0">
          <div className="space-y-6">
            <div className="pt-2 px-2">
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">ХОБОТНЯ</h1>
              <p className="text-[10px] text-red-500 font-bold tracking-widest uppercase italic mt-1">Underground Simulator</p>
            </div>

            <div>
              <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-2">Навігація</p>
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium bg-red-600/10 text-white rounded-lg border-l-2 border-red-600"><Flag className="h-4 w-4 text-red-500" /> Гоночний трек</button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg"><History className="h-4 w-4 text-zinc-500" /> Історія капіталу</button>
              </nav>
            </div>
          </div>

          {/* CAR ENGINE CONFIGURATOR */}
          <div className="bg-gradient-to-b from-zinc-900/60 to-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-3">
            <span className="text-[10px] text-amber-400 font-mono block text-center uppercase tracking-wider font-bold">🛠️ Тюнінг двигуна (Max 100)</span>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] font-mono mb-1"><span className="text-zinc-400">ШВИДКІСТЬ</span><span className="text-red-500 font-bold">{stats.speed}%</span></div>
                <input type="range" min="0" max="100" value={stats.speed} onChange={(e) => handleStatSliderChange("speed", parseInt(e.target.value))} className="w-full accent-red-600 bg-zinc-800 h-1 appearance-none cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-mono mb-1"><span className="text-zinc-400">ЗЧЕПЛЕННЯ</span><span className="text-amber-500 font-bold">{stats.grip}%</span></div>
                <input type="range" min="0" max="100" value={stats.grip} onChange={(e) => handleStatSliderChange("grip", parseInt(e.target.value))} className="w-full accent-amber-500 bg-zinc-800 h-1 appearance-none cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-mono mb-1"><span className="text-zinc-400">СТАБІЛЬНЕ НІТРО</span><span className="text-cyan-500 font-bold">{stats.nitro}%</span></div>
                <input type="range" min="0" max="100" value={stats.nitro} onChange={(e) => handleStatSliderChange("nitro", parseInt(e.target.value))} className="w-full accent-cyan-500 bg-zinc-800 h-1 appearance-none cursor-pointer" />
              </div>
            </div>
            <div className="text-[9px] font-mono flex justify-between text-zinc-500 pt-1 border-t border-zinc-900">
              <span>БАЛАНС ОЧОК:</span>
              <span className={stats.speed + stats.grip + stats.nitro > 100 ? "text-red-500" : "text-emerald-400"}>
                {stats.speed + stats.grip + stats.nitro}/100
              </span>
            </div>
          </div>
        </aside>

        {/* WORKSPACE */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 bg-[#0a0a0f] border-b border-zinc-900 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-1 rounded-md font-mono">NODE STATUS: ACTIVE</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#11111a] border border-zinc-800 rounded-lg px-3 py-1 flex items-center gap-2 font-mono text-xs">
                <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-black">₴ {balance.toLocaleString('uk-UA')}</span>
              </div>
              <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
                <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center font-black text-xs text-white uppercase italic">Х</div>
                <span className="text-xs font-bold text-zinc-200">{userNickname}</span>
                <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase font-bold">{vipTier}</span>
              </div>
            </div>
          </header>

          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            
            {/* RACE LIVE ARENA (ЯКЩО ГРА ПРЯМО ЗАРАЗ АКТИВНА) */}
            {raceStatus !== "idle" && activeRaceRoom && (
              <div className="bg-[#0b0b11] border-2 border-red-600/30 rounded-2xl p-6 space-y-5 shadow-2xl shadow-red-950/20">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                  <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-red-500 animate-pulse" /> СИМУЛЯЦІЯ: {activeRaceRoom.name}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Тип треку: {activeRaceRoom.trackType} | Призовий фонд: <span className="text-emerald-400 font-bold">₴ {activeRaceRoom.bet * 4}</span></p>
                  </div>
                  {raceStatus === "racing" && (
                    <button 
                      onClick={handleTriggerNitro}
                      className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Zap className="h-4 w-4 fill-current text-white animate-bounce" /> ВРУБИТИ НІТРО!
                    </button>
                  )}
                  {raceStatus === "finished" && (
                    <button 
                      onClick={() => setRaceStatus("idle")}
                      className="px-4 py-2 bg-zinc-800 text-zinc-200 text-xs font-bold rounded-lg hover:bg-zinc-700"
                    >
                      Повернутися в лобі
                    </button>
                  )}
                </div>

                {/* TRACK LANES */}
                <div className="space-y-4 bg-zinc-950 p-4 rounded-xl border border-zinc-900 relative">
                  {raceParticipants.map(p => (
                    <div key={p.id} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className={`font-bold ${p.id === userId ? "text-red-400" : "text-zinc-400"}`}>{p.name}</span>
                        <span className="text-zinc-500">{p.isBusted ? "💥 ЗІЙШОВ" : `${Math.round(p.progress)}%`}</span>
                      </div>
                      <div className="h-6 bg-zinc-900 border border-zinc-800/80 rounded-md relative overflow-hidden flex items-center">
                        <div 
                          className={`h-full transition-all duration-300 relative ${p.isBusted ? "bg-red-950/40" : p.id === userId ? "bg-gradient-to-r from-red-600 to-amber-500" : "bg-gradient-to-r from-zinc-700 to-zinc-500"}`}
                          style={{ width: `${p.progress}%` }}
                        >
                          {!p.isBusted && p.progress > 0 && (
                            <span className="absolute right-2 top-1 text-xs">🏎️</span>
                          )}
                        </div>
                        {p.isBusted && <Skull className="h-3.5 w-3.5 text-red-500 absolute left-3" />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* LIVE BROADCAST LOG */}
                <div className="bg-[#07070a] border border-zinc-900 rounded-xl p-3 h-28 overflow-y-auto font-mono text-xs text-zinc-400 space-y-1">
                  {raceLog.map((log, i) => (
                    <div key={i} className={`border-l-2 pl-2 py-0.5 ${log.includes('🏆') || log.includes('🔥') ? 'border-emerald-500 text-zinc-100 font-bold' : log.includes('💥') || log.includes('❌') ? 'border-red-500 text-red-400' : 'border-zinc-800'}`}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ОСНОВНИЙ ДАШБОРД (ЛОБІ ТА УПРАВЛІННЯ) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* СПИСОК КІМНАТ ДЛЯ ГОНОК */}
              <div className="xl:col-span-8 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">🏁 Активні нелегальні лобі</h3>
                  <button onClick={loadDashboardData} className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded hover:text-white"><RefreshCw className="h-3.5 w-3.5" /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rooms.filter(r => r.status === "Очікування").length === 0 ? (
                    <div className="col-span-2 text-center py-12 text-xs font-mono text-zinc-600 border border-dashed border-zinc-900 rounded-xl">Немає доступних заїздів. Створи свій нижче!</div>
                  ) : (
                    rooms.filter(r => r.status === "Очікування").map(room => (
                      <div key={room.id} className="bg-[#0a0a0f] border border-zinc-900 rounded-xl p-4 flex flex-col justify-between space-y-4 hover:border-zinc-800 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-black text-white uppercase font-mono tracking-tight">{room.name}</h4>
                            <p className="text-[10px] text-zinc-500 mt-0.5">Конфігурація траси: <span className="text-zinc-300 font-bold">{room.trackType}</span></p>
                          </div>
                          <span className="text-[9px] bg-red-950/40 text-red-400 border border-red-900/40 px-2 py-0.5 rounded font-black uppercase font-mono">₴ {room.bet}</span>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-zinc-900/60">
                          <span className="text-[10px] font-mono text-zinc-500">Учасники: {room.playersCount}/{room.playersMax} (Заповнено ботами)</span>
                          <button 
                            onClick={() => handleStartRaceSimulation(room)}
                            className="px-3 py-1.5 bg-red-600 text-white font-black text-[10px] uppercase rounded flex items-center gap-1 hover:bg-red-500 transition-all"
                          >
                            <Play className="h-3 w-3 fill-current" /> СТАРТ
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* СТВОРЕННЯ НОВОГО ЗАЇЗДУ */}
                <div className="bg-[#0a0a0f] border border-zinc-900 rounded-xl p-4 space-y-4">
                  <span className="text-xs font-black uppercase text-zinc-400 block border-b border-zinc-900 pb-2">➕ Створити кастомне лобі на ставки</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" value={roomNameInput} onChange={(e) => setRoomNameInput(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-700" placeholder="Назва лобі" />
                    <select value={roomBetSelect} onChange={(e) => setRoomBetSelect(parseInt(e.target.value))} className="bg-zinc-950 border border-zinc-900 rounded px-2 py-1.5 text-xs text-white focus:outline-none">
                      <option value={1000}>Ставка: ₴ 1 000</option>
                      <option value={5000}>Ставка: ₴ 5 000</option>
                      <option value={10000}>Ставка: ₴ 10 000</option>
                    </select>
                    <select value={roomTypeSelect} onChange={(e) => setRoomTypeSelect(e.target.value)} className="bg-zinc-950 border border-zinc-900 rounded px-2 py-1.5 text-xs text-white focus:outline-none">
                      <option value="Дрифт">Тип: Дрифт (Потрібне зчеплення)</option>
                      <option value="Драг">Тип: Драг-рейсинг (Потрібна швидкість)</option>
                      <option value="Кільце">Тип: Кільцеві перегони (Мікс)</option>
                    </select>
                  </div>
                  <button onClick={handleCreateRoom} className="w-full py-2 bg-gradient-to-r from-red-700 to-red-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider rounded-lg transition-all">
                    Опублікувати лобі в андерграунд-мережу
                  </button>
                </div>
              </div>

              {/* ПАНЕЛЬ ФІНАНСОВОЇ ІСТОРІЇ (LEDGER) */}
              <div className="xl:col-span-4 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">📊 Фінансовий Ledger</h3>
                <div className="bg-[#0a0a0f] border border-zinc-900 rounded-xl p-4 h-80 overflow-y-auto space-y-2 pr-1">
                  {transactions.length === 0 ? (
                    <div className="text-center py-12 text-[11px] font-mono text-zinc-600">Історія операцій пуста</div>
                  ) : (
                    transactions.map(tx => (
                      <div key={tx.id} className="p-2.5 bg-zinc-950 rounded border border-zinc-900/60 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          {tx.type === "DEPOSIT" ? (
                            <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-500 bg-emerald-500/10 rounded p-0.5" />
                          ) : (
                            <ArrowUpRight className="h-3.5 w-3.5 text-red-500 bg-red-500/10 rounded p-0.5" />
                          )}
                          <div>
                            <span className="text-zinc-300 block text-[10px] uppercase font-bold">{tx.type === "DEPOSIT" ? "Виграш/Депозит" : "Ставка/Зняття"}</span>
                            <span className="text-[8px] text-zinc-600 block">{tx.txHash.substring(0, 16)}</span>
                          </div>
                        </div>
                        <span className={tx.type === "DEPOSIT" ? "text-emerald-400 font-black" : "text-red-400 font-bold"}>
                          {tx.type === "DEPOSIT" ? "+" : "-"} ₴{tx.amount}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
