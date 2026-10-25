import { NextResponse } from "next/server";
import {
  LiveTournamentState,
  INITIAL_TOURNAMENT_STATE,
  createDefaultSquads,
  ROOM_CODES,
} from "@/lib/tournamentLiveSync";

// Persistent in-memory global state for the server session
declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_TOURNAMENT_STATE__: LiveTournamentState | undefined;
}

if (!global.__GLOBAL_TOURNAMENT_STATE__) {
  global.__GLOBAL_TOURNAMENT_STATE__ = {
    ...INITIAL_TOURNAMENT_STATE,
    squads: createDefaultSquads(),
  };
}

const state = global.__GLOBAL_TOURNAMENT_STATE__;

export async function GET() {
  return NextResponse.json(state);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    switch (action) {
      case "START_TOURNAMENT": {
        state.isGameStarted = true;
        state.isTimerPaused = false;
        state.lastUpdated = Date.now();
        break;
      }

      case "JOIN_SQUAD": {
        const { roomCode, playerName, avatar } = payload;
        const squad = state.squads[roomCode];
        if (squad) {
          // If member already exists with same name, update their avatar
          const existingIdx = squad.members.findIndex((m) => m.name.toLowerCase() === playerName.toLowerCase());
          if (existingIdx >= 0) {
            squad.members[existingIdx].avatar = avatar;
          } else if (squad.members.length < squad.maxMembers) {
            squad.members.push({
              id: `member-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              name: playerName,
              avatar,
              joinedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            });
          }
          state.lastUpdated = Date.now();
        }
        break;
      }

      case "LEAVE_SQUAD": {
        const { roomCode, playerName } = payload;
        const squad = state.squads[roomCode];
        if (squad) {
          squad.members = squad.members.filter((m) => m.name.toLowerCase() !== playerName.toLowerCase());
          state.lastUpdated = Date.now();
        }
        break;
      }

      case "UPDATE_SQUAD_PROGRESS": {
        const { roomCode, score, coins, solvedCaseId, filesEvaluatedInc, escaped, timeBonus } = payload;
        const squad = state.squads[roomCode];
        if (squad) {
          if (typeof score === "number") squad.score = score;
          if (typeof coins === "number") squad.coins = coins;
          if (typeof filesEvaluatedInc === "number") squad.filesEvaluatedCount += filesEvaluatedInc;
          if (solvedCaseId && !squad.solvedCases.includes(solvedCaseId)) {
            squad.solvedCases.push(solvedCaseId);
            squad.score += 100;
          }
          if (escaped) {
            squad.escaped = true;
            squad.escapedTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            if (typeof timeBonus === "number") squad.timeBonus = timeBonus;
          }
          state.lastUpdated = Date.now();
        }
        break;
      }

      case "UPDATE_TIMER": {
        const { timerSec, isTimerPaused } = payload;
        if (typeof timerSec === "number") state.timerSec = timerSec;
        if (typeof isTimerPaused === "boolean") state.isTimerPaused = isTimerPaused;
        state.lastUpdated = Date.now();
        break;
      }

      case "SET_CAPACITY": {
        const { capacity } = payload;
        if (typeof capacity === "number") state.teamCapacity = capacity;
        state.lastUpdated = Date.now();
        break;
      }

      case "BROADCAST_MESSAGE": {
        const { message } = payload;
        if (message) {
          state.broadcastMessage = message;
          state.broadcastLog = [
            `[${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}] ${message}`,
            ...state.broadcastLog.slice(0, 19),
          ];
          state.lastUpdated = Date.now();
        }
        break;
      }

      case "RESET_SCORES": {
        state.timerSec = 1800;
        state.isTimerPaused = false;
        state.broadcastMessage = "Host has reset all tournament scores. Starting fresh round!";
        state.broadcastLog = [
          `[${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}] 🔄 All squad scores and sector progress were reset by host.`,
          ...state.broadcastLog.slice(0, 19),
        ];
        Object.values(state.squads).forEach((squad) => {
          squad.score = 0;
          squad.coins = 120;
          squad.solvedCases = [];
          squad.activeCaseId = 1;
          squad.filesEvaluatedCount = 0;
          squad.escaped = false;
          squad.escapedTime = undefined;
          squad.timeBonus = undefined;
        });
        state.lastUpdated = Date.now();
        break;
      }

      case "RESET_TOURNAMENT": {
        state.isGameStarted = false;
        state.timerSec = 1800;
        state.isTimerPaused = false;
        state.broadcastMessage = null;
        state.broadcastLog = [];
        state.squads = createDefaultSquads();
        state.lastUpdated = Date.now();
        break;
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json(state);
  } catch (error) {
    console.error("API Tournament Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
