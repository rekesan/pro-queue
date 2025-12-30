import { useState } from "react";
import type { Level, PlayerStatus } from "../types";
import { Plus, Database, Pause } from "lucide-react";

interface AddPlayerFormProps {
  name: string;
  setName: (name: string) => void;
  level: Level;
  setLevel: (level: Level) => void;
  onSubmit: (e: React.FormEvent, status: PlayerStatus) => void;
  onLoadMock: () => void;
}

export const AddPlayerForm = ({
  name,
  setName,
  level,
  setLevel,
  onSubmit,
  onLoadMock,
}: AddPlayerFormProps) => {
  const [isStandby, setIsStandby] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    const status: PlayerStatus = isStandby ? 'standby' : 'queued';
    onSubmit(e, status);
    setIsStandby(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-primary animate-in fade-in zoom-in duration-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
          <Plus className="text-primary" /> Register Player
        </h2>
        <button
          onClick={onLoadMock}
          className="text-[10px] font-black text-slate-400 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50 flex items-center gap-1 uppercase"
        >
          <Database size={10} /> Demo Mode
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          autoFocus
          className="w-full bg-slate-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none text-lg"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-2">
          {(["Beginner", "Intermediate", "Advanced"] as Level[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={`py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                level === l
                  ? "bg-primary-light border-primary text-primary-dark"
                  : "border-slate-200 text-slate-400"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
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

        <button className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-lg hover:brightness-110 transition-all">
          {isStandby ? 'ADD TO STANDBY' : 'JOIN THE QUEUE'}
        </button>
      </form>
    </div>
  );
};
