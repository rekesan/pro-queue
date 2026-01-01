import type { Player, Court } from "../types";
import { Clock, RotateCcw, CircleSlash, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface CourtListProps {
  courts: Court[];
  gamesByCourt: Record<number, Player[]>;
  now: number;
  onFinishGroup: (playerIds: string[]) => void;
  onAddCourt: () => void;
  onRemoveCourt: (courtId: number) => void;
  className?: string;
}

export const CourtList = ({
  courts,
  gamesByCourt,
  now,
  onFinishGroup,
  onAddCourt,
  onRemoveCourt,
  className,
}: CourtListProps) => {
  return (
    <section className={className}>
      <div className="flex flex-row items-center justify-between mb-4">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">
          Courts
        </h2>
        <Button onClick={onAddCourt} variant="secondary" size="sm" className="text-xs h-fit bg-transparent hover:bg-transparent hover:text-primary">
          <Plus />
          Add court
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 @container">
        {courts.map((court) => {
          const courtNumber = court.id;
          const gamePlayers = gamesByCourt[courtNumber];
          const isOccupied = !!gamePlayers;

          return (
            <div
              key={court.id}
              className={`p-4 rounded-2xl shadow-sm border transition-all ${
                isOccupied
                  ? "bg-white border-primary/20"
                  : "bg-slate-50 border-dashed border-slate-200 opacity-80"
              } flex flex-col gap-4 relative`}
            >
              <div className="relative flex flex-row justify-between">
                <span className="text-sm font-black opacity-80">
                  {court.name || `Court ${court.id}`}
                </span>

                {courts.length > 1 && !isOccupied && (
                  <button
                    onClick={() => onRemoveCourt(court.id)}
                    className="w-6 h-6 hover:bg-red-500 text-red-500 hover:text-white rounded-full flex items-center justify-center"
                    title={`Remove ${court.name || `Court ${court.id}`}`}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>

              {isOccupied ? (
                <>
                  <div className="grow grid grid-cols-2 @lg:grid-cols-4 gap-2">
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
                  <div className="flex flex-row items-center justify-end gap-2">
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
                      className="bg-primary/10 text-primary px-4 py-2 rounded-xl hover:bg-primary/20 font-bold text-xs flex items-center gap-2 transition-colors"
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
