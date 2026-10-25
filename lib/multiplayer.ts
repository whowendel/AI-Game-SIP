export interface Player {
  id: string;
  name: string;
  avatar: string;
  stage: number; // 1, 2, 3, or 4 (escaped)
  score: number;
  tokens: number;
  hallucinationsCaught: number;
  escaped: boolean;
  timeTakenSec: number;
  isSelf?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  score: number;
  timeRemainingSec: number;
  hallucinationsCaught: number;
  date: string;
}

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "lead-1",
    name: "Inspector Whiskers",
    avatar: "🐱",
    score: 3450,
    timeRemainingSec: 382,
    hallucinationsCaught: 3,
    date: "Today",
  },
  {
    id: "lead-2",
    name: "Agent Sherlock Fox",
    avatar: "🦊",
    score: 2980,
    timeRemainingSec: 295,
    hallucinationsCaught: 3,
    date: "Today",
  },
  {
    id: "lead-3",
    name: "Officer Pip Pup",
    avatar: "🐶",
    score: 2420,
    timeRemainingSec: 180,
    hallucinationsCaught: 2,
    date: "Yesterday",
  },
  {
    id: "lead-4",
    name: "Professor Owl Fact",
    avatar: "🦉",
    score: 2150,
    timeRemainingSec: 120,
    hallucinationsCaught: 2,
    date: "Yesterday",
  },
];

export class MultiplayerEngine {
  private channel: BroadcastChannel | null = null;
  public roomCode: string = "CASE-1";
  public players: Player[] = [];
  private onUpdateCallback: ((players: Player[]) => void) | null = null;

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel("detective_room_sync");
      this.channel.onmessage = (event) => {
        const { type, room, player, allPlayers } = event.data;
        if (room !== this.roomCode) return;

        if (type === "SYNC" && allPlayers) {
          this.mergePlayers(allPlayers);
        } else if (type === "PLAYER_UPDATE" && player) {
          this.updatePlayer(player);
        }
      };
    }
  }

  initRoom(roomCode: string, selfPlayer: Player, onUpdate: (players: Player[]) => void) {
    this.roomCode = roomCode.toUpperCase().trim() || "CASE-1";
    this.onUpdateCallback = onUpdate;
    this.players = [
      { ...selfPlayer, isSelf: true },
      // Add simulated rival detectives for lively competition
      {
        id: "bot-fox",
        name: "Agent Fox",
        avatar: "🦊",
        stage: 1,
        score: 300,
        tokens: 80,
        hallucinationsCaught: 0,
        escaped: false,
        timeTakenSec: 0,
      },
      {
        id: "bot-owl",
        name: "Prof. Owl",
        avatar: "🦉",
        stage: 1,
        score: 450,
        tokens: 90,
        hallucinationsCaught: 0,
        escaped: false,
        timeTakenSec: 0,
      },
    ];

    this.broadcast({ type: "PLAYER_UPDATE", room: this.roomCode, player: selfPlayer });
    if (this.onUpdateCallback) this.onUpdateCallback([...this.players]);
  }

  // Update self player state and broadcast
  updateSelf(updates: Partial<Player>) {
    const selfIdx = this.players.findIndex((p) => p.isSelf);
    if (selfIdx !== -1) {
      this.players[selfIdx] = { ...this.players[selfIdx], ...updates };
      this.broadcast({
        type: "PLAYER_UPDATE",
        room: this.roomCode,
        player: this.players[selfIdx],
      });
      if (this.onUpdateCallback) this.onUpdateCallback([...this.players]);
    }
  }

  // Simulate rival bots advancing gradually based on time
  tickSimulation() {
    let changed = false;
    this.players = this.players.map((p) => {
      if (p.isSelf || p.escaped) return p;

      // 15% random chance each 4-second tick for a bot to advance
      if (Math.random() < 0.18) {
        changed = true;
        const nextStage = p.stage + 1;
        const caught = p.hallucinationsCaught + (Math.random() > 0.3 ? 1 : 0);
        return {
          ...p,
          stage: nextStage > 3 ? 4 : nextStage,
          score: p.score + Math.floor(Math.random() * 400 + 300),
          hallucinationsCaught: caught,
          escaped: nextStage > 3,
        };
      }
      return p;
    });

    if (changed && this.onUpdateCallback) {
      this.onUpdateCallback([...this.players]);
    }
  }

  private updatePlayer(player: Player) {
    const idx = this.players.findIndex((p) => p.id === player.id);
    if (idx !== -1) {
      this.players[idx] = { ...player, isSelf: this.players[idx].isSelf };
    } else {
      this.players.push({ ...player, isSelf: false });
    }
    if (this.onUpdateCallback) this.onUpdateCallback([...this.players]);
  }

  private mergePlayers(remotePlayers: Player[]) {
    remotePlayers.forEach((rp) => this.updatePlayer(rp));
  }

  private broadcast(data: unknown) {
    if (this.channel) {
      this.channel.postMessage(data);
    }
  }

  static getLeaderboard(): LeaderboardEntry[] {
    if (typeof window === "undefined") return DEFAULT_LEADERBOARD;
    try {
      const stored = localStorage.getItem("detective_leaderboard_v1");
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEFAULT_LEADERBOARD;
  }

  static saveLeaderboard(entry: LeaderboardEntry) {
    if (typeof window === "undefined") return;
    try {
      const list = MultiplayerEngine.getLeaderboard();
      const next = [entry, ...list]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      localStorage.setItem("detective_leaderboard_v1", JSON.stringify(next));
    } catch {
      // ignore
    }
  }
}
