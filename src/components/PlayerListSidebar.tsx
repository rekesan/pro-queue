import type { Player, PlayerStatus } from "../types";
import { Users, Clock, Pause, Play, Trash2 } from "lucide-react";
import {
  SidebarContent,
  SidebarHeader,
} from "./ui/sidebar";

interface PlayerListSidebarProps {
  allPlayers: Player[];
  onToggleStatus: (playerId: string, newStatus: PlayerStatus) => void;
  onRemovePlayer: (id: string) => void;
}

export const PlayerListSidebar = ({
  allPlayers,
  onToggleStatus,
  onRemovePlayer,
}: PlayerListSidebarProps) => {
  const queuedCount = allPlayers.filter(p => p.status === 'queued').length;
  const standbyCount = allPlayers.filter(p => p.status === 'standby').length;
  const playingCount = allPlayers.filter(p => p.status === 'playing').length;

  return (
    <>
      <SidebarHeader className="p-4 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-400 uppercase tracking-wider">
            Player Management
          </h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
              <Users size={12} className="text-slate-600" />
              <span className="font-bold text-slate-700">{allPlayers.length}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
          <div className="flex items-center gap-1 text-primary">
            <Play size={10} /> {queuedCount} Queued
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Pause size={10} /> {standbyCount} Standby
          </div>
          <div className="flex items-center gap-1 text-emerald-500">
            <Clock size={10} /> {playingCount} Playing
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <div className="space-y-3">
          {allPlayers
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((player) => (
              <div
                key={player.id}
                className={`p-3 rounded-xl border transition-all hover:shadow-md ${
                  player.status === 'playing'
                    ? 'bg-primary-light border-primary/20 shadow-sm'
                    : player.status === 'standby'
                    ? 'bg-amber-50 border-amber-200 hover:bg-amber-100'
                    : 'bg-white border-slate-100 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      player.status === 'playing'
                        ? 'bg-primary text-white'
                        : player.status === 'standby'
                        ? 'bg-amber-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}>
                      {player.status === 'playing' ? (
                        <Clock size={12} />
                      ) : player.status === 'standby' ? (
                        <Pause size={12} />
                      ) : (
                        <Play size={12} />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-800 leading-tight">
                        {player.name}
                      </div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                        {player.level}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {player.status !== 'playing' && (
                      <button
                        onClick={() => onToggleStatus(
                          player.id,
                          player.status === 'queued' ? 'standby' : 'queued'
                        )}
                        className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                          player.status === 'queued'
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                        title={player.status === 'queued' ? 'Move to standby' : 'Move to queue'}
                      >
                        {player.status === 'queued' ? (
                          <Pause size={12} />
                        ) : (
                          <Play size={12} />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => onRemovePlayer(player.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                      title="Remove player"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {allPlayers.length === 0 && (
          <div className="text-center py-12 bg-slate-100 border-2 border-dashed border-slate-200 rounded-3xl opacity-50">
            <Users size={32} className="mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              No players registered
            </p>
          </div>
        )}
      </SidebarContent>
    </>
  );
};
