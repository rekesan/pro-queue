import type { GameHistory as GameHistoryType } from "../types";
import { History, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface GameHistoryModalProps {
  history: GameHistoryType[];
  onClearHistory: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GameHistoryModal = ({
  history,
  onClearHistory,
  open,
  onOpenChange,
}: GameHistoryModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-800">
            <History className="text-primary" />
            Game History
          </DialogTitle>
          <DialogDescription>
            View all completed games and session details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {history.length > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">
                {history.length} game{history.length !== 1 ? 's' : ''} completed
              </span>
              <button
                onClick={() => {
                  if (window.confirm("Clear all game history?")) {
                    onClearHistory();
                    onOpenChange(false);
                  }
                }}
                className="text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
              >
                Clear All History
              </button>
            </div>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((game) => (
              <div
                key={game.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200"
              >
                <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                      Court {game.court}
                    </span>
                    <span className="text-sm text-slate-600 font-medium">
                      {new Date(game.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-bold text-sm">
                    <TrendingUp size={16} />
                    {game.duration}m
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {game.players.map((p, pi) => (
                    <div
                      key={pi}
                      className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                      <span className="text-sm font-medium text-slate-700">
                        {p.name}
                      </span>
                      <span className="text-xs text-slate-500 uppercase">
                        {p.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {history.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <TrendingUp size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg font-bold uppercase tracking-wider mb-2">
                No Games Yet
              </p>
              <p className="text-sm text-slate-500">
                Completed games will appear here
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
