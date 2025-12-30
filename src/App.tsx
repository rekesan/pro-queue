import { useState, useEffect, useRef } from "react";
import { Settings, RotateCcw, Eye } from "lucide-react";
import type {
  Player,
  GameHistory as GameHistoryType,
  Level,
  PlayerStatus,
} from "./types";
import { AddPlayerModal } from "./components/AddPlayerModal";
import { CourtList } from "./components/CourtList";
import { Waitlist } from "./components/Waitlist";
import { PlayerListSidebar } from "./components/PlayerListSidebar";
import { GameHistoryModal } from "./components/GameHistoryModal";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";

// Configuration constants
const AVG_GAME_MINS = 15;
const STORAGE_KEY = "pickleball_queue_v3";
const PLAYERS_PER_GAME = 4;

const App = () => {
  // --- State ---
  const [queue, setQueue] = useState<Player[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + "_queue");
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<GameHistoryType[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + "_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [courtCount, setCourtCount] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY + "_courts");
    return saved ? Number(saved) : 2;
  });

  const [now, setNow] = useState<number>(() => Date.now());
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const isInitialMount = useRef(true);

  // Update current time via interval
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  // --- Persistence ---
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY + "_queue", JSON.stringify(queue));
    localStorage.setItem(STORAGE_KEY + "_history", JSON.stringify(history));
    localStorage.setItem(STORAGE_KEY + "_courts", courtCount.toString());
  }, [queue, history, courtCount]);

  // --- Derived State (React Compiler handles memoization) ---
  const playingPlayers = queue.filter((item) => item.status === "playing");

  const gamesByCourt = playingPlayers.reduce((acc, player) => {
    if (player.courtNumber) {
      if (!acc[player.courtNumber]) acc[player.courtNumber] = [];
      acc[player.courtNumber].push(player);
    }
    return acc;
  }, {} as Record<number, Player[]>);

  const occupiedCount = Object.keys(gamesByCourt).length;

  const groupedWaitlist = (() => {
    const pool = [...queue]
      .filter((item) => item.status === "queued")
      .sort((a, b) => a.joinedAt - b.joinedAt);

    const groups: Player[][] = [];
    const processedIds = new Set<string>();

    while (processedIds.size < pool.length) {
      const remaining = pool.filter((p) => !processedIds.has(p.id));
      if (remaining.length === 0) break;

      const currentGroup: Player[] = [];
      const firstPlayer = remaining[0];

      currentGroup.push(firstPlayer);
      processedIds.add(firstPlayer.id);

      for (let i = 0; i < 3; i++) {
        const others = pool.filter((p) => !processedIds.has(p.id));
        if (others.length === 0) break;
        const candidate =
          others.find((p) => !firstPlayer.lastPartnerIds.includes(p.id)) ||
          others[0];
        currentGroup.push(candidate);
        processedIds.add(candidate.id);
      }
      groups.push(currentGroup);
    }
    return groups;
  })();

  const queuedCount = queue.filter((p) => p.status === "queued").length;

  // --- Actions ---
  const addToQueue = (
    e: React.FormEvent,
    status: PlayerStatus = "queued",
    playerName: string = "",
    playerLevel: Level = "Intermediate"
  ) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setQueue((prev) => {
      const ts = Date.now();
      const newEntry: Player = {
        id: crypto.randomUUID(),
        name: playerName.trim(),
        level: playerLevel,
        status,
        joinedAt: ts,
        startedAt: null,
        courtNumber: null,
        lastPartnerIds: [],
      };
      return [...prev, newEntry];
    });
  };

  const loadMockData = () => {
    const mockNames = [
      "Ben Johns",
      "Anna Leigh",
      "Tyson McGuffin",
      "Catherine Parenteau",
      "JW Johnson",
      "Lea Jansen",
      "Riley Newman",
      "Parris Todd",
      "Zane Navratil",
      "Lucy Kovalova",
      "Matt Wright",
      "Callie Smith",
      "Dekel Bar",
      "Vivienne David",
      "Jay Devilliers",
    ];

    const levels: Level[] = ["Advanced", "Intermediate", "Beginner"];

    setQueue(() => {
      const ts = Date.now();
      return mockNames.map((name, index) => {
        const isPlaying = index < 4;
        return {
          id: crypto.randomUUID(),
          name,
          level: levels[index % 3],
          status: isPlaying ? "playing" : "queued",
          joinedAt: ts - index * 60000,
          startedAt: isPlaying ? ts - 900000 : null,
          courtNumber: isPlaying ? 1 : null,
          lastPartnerIds: [],
        };
      });
    });
  };

  const startGroup = (playerIds: string[]) => {
    let assignedCourt: number | null = null;
    for (let i = 1; i <= courtCount; i++) {
      if (!gamesByCourt[i]) {
        assignedCourt = i;
        break;
      }
    }

    if (!assignedCourt) return;

    setQueue((prev) => {
      const ts = Date.now();
      return prev.map((item) => {
        if (playerIds.includes(item.id)) {
          const partners = playerIds.filter((id) => id !== item.id);
          return {
            ...item,
            status: "playing",
            startedAt: ts,
            courtNumber: assignedCourt,
            lastPartnerIds: partners,
          };
        }
        return item;
      });
    });
  };

  const finishGroupAndRequeue = (playerIds: string[]) => {
    const playersInGame = queue.filter((p) => playerIds.includes(p.id));
    const courtUsed = playersInGame[0]?.courtNumber;

    if (courtUsed) {
      setHistory((prev) => {
        const ts = Date.now();
        const gameStart = playersInGame[0]?.startedAt || ts;
        const durationMins = Math.round((ts - gameStart) / 60000);

        const historyEntry: GameHistoryType = {
          id: crypto.randomUUID(),
          timestamp: ts,
          duration: durationMins,
          court: courtUsed,
          players: playersInGame.map((p) => ({ name: p.name, level: p.level })),
        };
        return [historyEntry, ...prev].slice(0, 50);
      });
    }

    setQueue((prev) => {
      const ts = Date.now();
      const otherPlayers = prev.filter((p) => !playerIds.includes(p.id));
      const finishedPlayers = prev
        .filter((p) => playerIds.includes(p.id))
        .map((p) => ({
          ...p,
          status: "queued" as const,
          startedAt: null,
          courtNumber: null,
          joinedAt: ts,
        }));

      return [...otherPlayers, ...finishedPlayers];
    });
  };

  const removeItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const togglePlayerStatus = (playerId: string, newStatus: PlayerStatus) => {
    setQueue((prev) =>
      prev.map((player) => {
        if (player.id === playerId) {
          const updatedPlayer: Player = {
            ...player,
            status: newStatus,
            joinedAt: newStatus === "queued" ? Date.now() : player.joinedAt,
          };
          return updatedPlayer;
        }
        return player;
      })
    );
  };

  const clearHistory = () => {
    if (window.confirm("Clear all game history?")) {
      setHistory([]);
    }
  };

  const resetApplication = () => {
    if (window.confirm("Reset all data and start fresh? This will clear all players, history, and settings.")) {
      localStorage.removeItem(STORAGE_KEY + "_queue");
      localStorage.removeItem(STORAGE_KEY + "_history");
      localStorage.removeItem(STORAGE_KEY + "_courts");
      window.location.reload(); // Reload to reset state
    }
  };

  const getWaitTimeForGroup = (groupIndex: number) =>
    Math.ceil((groupIndex + 1) / courtCount) * AVG_GAME_MINS;

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-1">
        <Sidebar className="border-r border-slate-200">
          <PlayerListSidebar
            allPlayers={queue}
            onToggleStatus={togglePlayerStatus}
            onRemovePlayer={removeItem}
          />
        </Sidebar>

        <div className="flex-1">
          <header className="bg-primary text-white p-6 py-3.5 shadow-lg sticky top-0 z-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-white hover:bg-primary/20" />
                <div>
                  <h1 className="text-2xl font-black italic tracking-wider flex items-center gap-2">
                    PRO<span className="text-blue-200">QUEUE</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-1 opacity-90">
                    <label className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <Settings size={10} /> {courtCount} Courts Configured
                    </label>
                    <select
                      value={courtCount}
                      onChange={(e) => setCourtCount(Number(e.target.value))}
                      className="bg-sky-800 text-[10px] border-none rounded px-1 py-0.5 outline-none font-bold cursor-pointer appearance-none text-sky-100"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} Courts
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={resetApplication}
                      className="bg-red-600 hover:bg-red-700 text-[10px] border-none rounded px-2 py-0.5 outline-none font-bold cursor-pointer text-white ml-2 flex items-center gap-1 transition-colors"
                      title="Reset all data"
                    >
                      <RotateCcw size={10} />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
              <AddPlayerModal onSubmit={addToQueue} onLoadMock={loadMockData} />
            </div>
          </header>

          <main className="p-4 space-y-8 max-w-4xl min-h-[84.76%] mx-auto">
            <CourtList
              courtCount={courtCount}
              gamesByCourt={gamesByCourt}
              now={now}
              onFinishGroup={finishGroupAndRequeue}
            />

            <Waitlist
              groupedWaitlist={groupedWaitlist}
              occupiedCount={occupiedCount}
              courtCount={courtCount}
              onStartGroup={startGroup}
              onRemoveItem={removeItem}
              playersPerGame={PLAYERS_PER_GAME}
              queuedCount={queuedCount}
            />
          </main>

          <footer className="sticky bottom-0 bg-slate-900 text-white p-4 shadow-2xl z-50">
            <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
              <div className="flex gap-6">
                <div className="text-left">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                    Est. Wait
                  </p>
                  <p className="text-sm font-black italic text-accent">
                    {groupedWaitlist.length > 0
                      ? getWaitTimeForGroup(groupedWaitlist.length - 1)
                      : 0}{" "}
                    MINS
                  </p>
                </div>
                <div className="w-px h-8 bg-slate-800 self-center"></div>
                <div
                  className="relative text-left cursor-pointer rounded transition-colors before:-inset-1 before:-z-10 before:absolute hover:before:bg-slate-800"
                  onClick={() => setHistoryModalOpen(true)}
                  title="Click to view game history"
                >
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                    Games Completed
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-black text-sky-400">
                      {history.length} SESSIONS
                    </p>
                    <Eye size={14} className="text-sky-400 opacity-80" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                  Court Load
                </p>
                <p className="text-sm font-black">
                  <span className="text-accent">{occupiedCount}</span>
                  <span className="text-slate-600 mx-1">/</span>
                  {courtCount}
                </p>
              </div>
            </div>
          </footer>
        </div>

        <GameHistoryModal
          history={history}
          onClearHistory={clearHistory}
          open={historyModalOpen}
          onOpenChange={setHistoryModalOpen}
        />
      </div>
    </SidebarProvider>
  );
};

export default App;
