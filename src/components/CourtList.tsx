import type { Player } from "../types";
import { Clock, RotateCcw, CircleSlash } from "lucide-react";

interface CourtListProps {
  courtCount: number;
  gamesByCourt: Record<number, Player[]>;
  now: number;
  onFinishGroup: (playerIds: string[]) => void;
}

export const CourtList = ({
  courtCount,
  gamesByCourt,
  now,
  onFinishGroup,
}: CourtListProps) => {
  return (
    <section>
      <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 px-2">
        Courts
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: courtCount }).map((_, idx) => {
          const courtNumber = idx + 1;
          const gamePlayers = gamesByCourt[courtNumber];
          const isOccupied = !!gamePlayers;

          return (
            <div
              key={courtNumber}
              className={`p-4 rounded-2xl shadow-sm border transition-all ${
                isOccupied
                  ? "bg-white border-emerald-100"
                  : "bg-slate-50 border-dashed border-slate-200 opacity-60"
              } flex flex-col md:flex-row md:items-center gap-4`}
            >
              <div
                className={`flex-shrink-0 w-full md:w-20 h-12 rounded-xl flex flex-col items-center justify-center shadow-inner ${
                  isOccupied
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-300 text-slate-500"
                }`}
              >
                <span className="text-[10px] font-black uppercase opacity-80">
                  Court
                </span>
                <span className="text-xl font-black leading-none">
                  {courtNumber}
                </span>
              </div>

              {isOccupied ? (
                <>
                  <div className="grow grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {gamePlayers.map((p) => (
                      <div
                        key={p.id}
                        className="text-xs font-bold p-2 bg-slate-50 rounded-lg border border-slate-100"
                      >
                        <p className="truncate text-slate-700">{p.name}</p>
                        <p className="text-[8px] text-slate-400 uppercase tracking-tighter">
                          {p.level}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock size={10} />{" "}
                      {Math.round(
                        (now - (gamePlayers[0]?.startedAt || now)) / 60000
                      )}
                      m elapsed
                    </span>
                    <button
                      onClick={() =>
                        onFinishGroup(gamePlayers.map((p) => p.id))
                      }
                      className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl hover:bg-emerald-100 font-bold text-xs flex items-center gap-2"
                    >
                      <RotateCcw size={14} /> FINISH
                    </button>
                  </div>
                </>
              ) : (
                <div className="grow flex items-center gap-3 text-slate-400">
                  <CircleSlash size={16} />
                  <span className="text-xs font-black uppercase tracking-widest italic">
                    Vacant
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
