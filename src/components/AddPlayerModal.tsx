import { useState } from "react";
import type { Level, PlayerStatus } from "../types";
import { Plus, Database, Pause } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface AddPlayerModalProps {
  onSubmit: (
    e: React.FormEvent,
    status: PlayerStatus,
    playerName: string,
    playerLevel: Level
  ) => void;
  onLoadMock: () => void;
}

export const AddPlayerModal = ({ onSubmit, onLoadMock }: AddPlayerModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<Level>("Intermediate");
  const [isStandby, setIsStandby] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    const status: PlayerStatus = isStandby ? "standby" : "queued";
    onSubmit(e, status, name, level);
    setName("");
    setLevel("Intermediate");
    setIsStandby(false);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setName("");
      setLevel("Intermediate");
      setIsStandby(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="bg-white text-primary p-2 rounded-full shadow-md hover:scale-105 transition-transform">
          <Plus size={24} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-800">
            <Plus className="text-primary" />
            Register Player
          </DialogTitle>
          <DialogDescription>
            Add a new player to the queue or set them as standby.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <button
            onClick={onLoadMock}
            className="w-full text-[10px] font-black text-slate-400 border border-slate-200 px-3 py-2 rounded hover:bg-slate-50 flex items-center gap-1 uppercase transition-colors"
          >
            <Database size={10} /> Load 15 Pro Players (Demo)
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Player Name
              </label>
              <input
                autoFocus
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-lg transition-colors"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Skill Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Beginner", "Intermediate", "Advanced"] as Level[]).map(
                  (l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLevel(l)}
                      className={`py-3 px-2 rounded-lg text-sm font-bold border-2 transition-all ${
                        level === l
                          ? "bg-primary-light border-primary text-primary-dark"
                          : "border-slate-200 text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      {l}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={isStandby}
                  onChange={(e) => setIsStandby(e.target.checked)}
                  className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-slate-600 flex items-center gap-1">
                  <Pause size={14} className="text-amber-500" />
                  Start on standby (not in queue)
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-lg hover:brightness-110 transition-all"
            >
              {isStandby ? "ADD TO STANDBY" : "JOIN THE QUEUE"}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
