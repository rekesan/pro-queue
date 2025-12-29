export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface Player {
  id: string;
  name: string;
  level: Level;
  status: "waiting" | "playing";
  joinedAt: number;
  startedAt: number | null;
  courtNumber: number | null;
  lastPartnerIds: string[];
}

export interface GameHistory {
  id: string;
  timestamp: number;
  duration: number;
  court: number;
  players: Array<{
    name: string;
    level: Level;
  }>;
}
