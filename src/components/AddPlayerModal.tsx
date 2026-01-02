import { useState } from "react";
import type { Level, PlayerStatus } from "../types";
import { Plus, Database, Pause, Users } from "lucide-react";
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
  onBulkSubmit: (
    players: Array<{ name: string; level: Level; status: PlayerStatus }>
  ) => void;
  onLoadMock: () => void;
}

export const AddPlayerModal = ({
  onSubmit,
  onBulkSubmit,
  onLoadMock,
}: AddPlayerModalProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [name, setName] = useState("");
  const [level, setLevel] = useState<Level>("Intermediate");
  const [isStandby, setIsStandby] = useState(false);
  const [bulkNames, setBulkNames] = useState("");
  const [bulkLevel, setBulkLevel] = useState<Level>("Intermediate");
  const [bulkIsStandby, setBulkIsStandby] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    const status: PlayerStatus = isStandby ? "standby" : "queued";
    onSubmit(e, status, name, level);
    setName("");
    setLevel("Intermediate");
    setIsStandby(false);
    setOpen(false);
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkNames.trim()) return;

    // Parse names from textarea (split by newlines or commas)
    const names = bulkNames
      .split(/[\n,]/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length === 0) return;

    const status: PlayerStatus = bulkIsStandby ? "standby" : "queued";
    const players = names.map((name) => ({
      name,
      level: bulkLevel,
      status,
    }));

    onBulkSubmit(players);
    setBulkNames("");
    setBulkLevel("Intermediate");
    setBulkIsStandby(false);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setName("");
      setLevel("Intermediate");
      setIsStandby(false);
      setBulkNames("");
      setBulkLevel("Intermediate");
      setBulkIsStandby(false);
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
            Add players
          </DialogTitle>
          <DialogDescription>
            Add new players to the queue or set them as standby.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tab Buttons */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab("single")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeTab === "single"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Single Add
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bulk")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeTab === "bulk"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Bulk Add
            </button>
          </div>

          <button
            onClick={onLoadMock}
            className="w-full text-[10px] font-black text-slate-400 border border-slate-200 px-3 py-2 rounded hover:bg-slate-50 flex items-center gap-1 uppercase transition-colors"
          >
            <Database size={10} /> Load 15 Pro Players (Demo)
          </button>

          {activeTab === "single" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Player Name
                </label>
                <input
                  autoFocus
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm transition-colors"
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
                        className={`py-2 px-2 rounded-lg text-xs font-bold border-2 transition-all ${
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
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                {isStandby ? "ADD TO STANDBY" : "JOIN THE QUEUE"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Player Names (one per line or comma-separated)
                </label>
                <textarea
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm transition-colors resize-none"
                  placeholder="John Doe&#10;Jane Smith&#10;Bob Johnson"
                  rows={4}
                  value={bulkNames}
                  onChange={(e) => setBulkNames(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Skill Level (for all players)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Beginner", "Intermediate", "Advanced"] as Level[]).map(
                    (l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setBulkLevel(l)}
                        className={`py-2 px-2 rounded-lg text-xs font-bold border-2 transition-all ${
                          bulkLevel === l
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
                    checked={bulkIsStandby}
                    onChange={(e) => setBulkIsStandby(e.target.checked)}
                    className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-slate-600 flex items-center gap-1">
                    <Pause size={14} className="text-amber-500" />
                    Start all on standby (not in queue)
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!bulkNames.trim()}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <Users size={16} />
                {bulkIsStandby ? "ADD ALL TO STANDBY" : "ADD ALL TO QUEUE"}
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
