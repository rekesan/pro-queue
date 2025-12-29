import type { Player } from "../types";
import { Lock, Shuffle, Trash2 } from "lucide-react";

interface WaitlistProps {
  groupedWaitlist: Player[][];
  occupiedCount: number;
  courtCount: number;
  onStartGroup: (playerIds: string[]) => void;
  onRemoveItem: (id: string) => void;
  playersPerGame: number;
}

export const Waitlist = ({
  groupedWaitlist,
  occupiedCount,
  courtCount,
  onStartGroup,
  onRemoveItem,
  playersPerGame,
}: WaitlistProps) => {
  return (
    <section>
      <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 px-2">
        Waitlist
      </h2>
      <div className="space-y-6">
        {groupedWaitlist.map((group, gIdx) => (
          <div
            key={gIdx}
            className={`relative p-4 rounded-2xl border-2 transition-all ${
              group.length === playersPerGame
                ? "bg-white border-primary/20 shadow-md"
                : "bg-slate-50 border-dashed border-slate-200"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                    group.length === playersPerGame
                      ? "bg-primary text-white"
                      : "bg-slate-300 text-white"
                  }`}
                >
                  {gIdx + 1}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tight flex items-center gap-1">
                  {gIdx === 0 && group.length === playersPerGame ? (
                    <span className="text-primary flex items-center gap-1">
                      <Lock size={10} /> Stacked
                    </span>
                  ) : group.length === playersPerGame ? (
                    <span className="text-primary/70 flex items-center gap-1">
                      <Shuffle size={10} /> Mixed Pairings
                    </span>
                  ) : (
                    `Waiting (${group.length}/${playersPerGame})`
                  )}
                </span>
              </div>
              {group.length === playersPerGame && (
                <button
                  onClick={() => onStartGroup(group.map((p) => p.id))}
                  disabled={occupiedCount >= courtCount}
                  className={`px-4 py-1.5 rounded-lg font-black text-xs transition-all ${
                    occupiedCount >= courtCount
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  {occupiedCount >= courtCount ? "FULL" : "START"}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {group.map((player) => (
                <div
                  key={player.id}
                  className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
                >
                  <span className="font-bold text-sm text-slate-700">
                    {player.name}{" "}
                    <span className="text-[10px] text-slate-300 ml-2">
                      {player.level}
                    </span>
                  </span>
                  <button
                    onClick={() => onRemoveItem(player.id)}
                    className="text-slate-200 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
