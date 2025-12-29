import type { GameHistory as GameHistoryType } from "../types";
import { History, TrendingUp } from "lucide-react";

interface GameHistoryProps {
  history: GameHistoryType[];
  onClearHistory: () => void;
}

export const GameHistory = ({ history, onClearHistory }: GameHistoryProps) => {
  return (
    <section className="bg-slate-100 -mx-4 p-6 rounded-t-[32px] border-t border-slate-200">
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <History size={16} /> Recent Games
        </h2>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="space-y-3">
        {history.map((game) => (
          <div
            key={game.id}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-3"
          >
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <div className="flex items-center gap-3">
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter">
                  Court {game.court}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {new Date(game.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 font-black text-xs">
                <TrendingUp size={14} /> {game.duration}m
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {game.players.map((p, pi) => (
                <span
                  key={pi}
                  className="text-xs font-bold text-slate-600 flex items-center gap-1"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>{" "}
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <TrendingUp size={32} className="mx-auto mb-2 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest opacity-40">
              No games recorded yet
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
