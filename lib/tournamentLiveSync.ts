export interface SquadMember {
  id: string;
  name: string;
  avatar: string; // "alex" | "sam" | "maya" | "chris"
  joinedAt: string;
}

export interface LiveSquad {
  id: string;
  code: string; // e.g. "BSIT3A-G1"
  name: string; // e.g. "Group 1 (Cyber Sentinels)"
  maxMembers: number; // 4
  members: SquadMember[];
  score: number;
  coins: number;
  solvedCases: number[];
  activeCaseId: number | null;
  filesEvaluatedCount: number;
  escaped: boolean;
  escapedTime?: string;
  timeBonus?: number;
}

export interface LiveTournamentState {
  sessionCode: string;
  teamCapacity: number;
  isGameStarted: boolean;
  timerSec: number;
  isTimerPaused: boolean;
  broadcastMessage: string | null;
  broadcastLog: string[];
  squads: Record<string, LiveSquad>;
  lastUpdated: number;
}

export const ROOM_CODES = [
  "BSIT3A-G1",
  "BSIT3A-G2",
  "BSIT3A-G3",
  "BSIT3A-G4",
  "BSIT3A-G5",
  "BSIT3A-G6",
  "BSIT3A-G7",
  "BSIT3A-G8",
  "BSIT3A-G9",
  "BSIT3A-G10",
] as const;

export const GROUP_THEMES: Record<string, string> = {
  "BSIT3A-G1": "Cyber Sentinels",
  "BSIT3A-G2": "Logic Hunters",
  "BSIT3A-G3": "Truth Wardens",
  "BSIT3A-G4": "Pixel Sleuths",
  "BSIT3A-G5": "Binary Scouts",
  "BSIT3A-G6": "Hallucination Busters",
  "BSIT3A-G7": "Archive Raiders",
  "BSIT3A-G8": "Echo Analyzers",
  "BSIT3A-G9": "Source Hunters",
  "BSIT3A-G10": "Fact Patrol",
};

export function createDefaultSquads(): Record<string, LiveSquad> {
  const squads: Record<string, LiveSquad> = {};
  ROOM_CODES.forEach((code, index) => {
    squads[code] = {
      id: `squad-${index + 1}`,
      code,
      name: `Group ${index + 1} (${GROUP_THEMES[code] || "Investigator Unit"})`,
      maxMembers: 4,
      members: [],
      score: 0,
      coins: 120,
      solvedCases: [],
      activeCaseId: 1,
      filesEvaluatedCount: 0,
      escaped: false,
    };
  });
  return squads;
}

export const INITIAL_TOURNAMENT_STATE: LiveTournamentState = {
  sessionCode: "BSIT3A-SEMINAR",
  teamCapacity: 10,
  isGameStarted: false,
  timerSec: 1800, // 30 minutes
  isTimerPaused: false,
  broadcastMessage: null,
  broadcastLog: [],
  squads: createDefaultSquads(),
  lastUpdated: Date.now(),
};

// Global cross-tab broadcast channel for local real-time sync
const BROADCAST_CHANNEL_NAME = "after_hours_tournament_bus";

export function getTournamentBroadcastChannel(): BroadcastChannel | null {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    try {
      return new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    } catch {
      return null;
    }
  }
  return null;
}

export function broadcastTournamentUpdate(state: LiveTournamentState) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("after_hours_live_tournament", JSON.stringify(state));
      const channel = getTournamentBroadcastChannel();
      if (channel) {
        channel.postMessage({ type: "TOURNAMENT_STATE_UPDATE", payload: state });
        channel.close();
      }
    } catch (err) {
      console.warn("BroadcastChannel error:", err);
    }
  }
}
