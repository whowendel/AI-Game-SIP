"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Radio,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  Maximize2,
  X,
  Key,
  Server,
  Settings,
  Flame,
  Award,
  Sparkles,
  UserCheck,
  UserX,
  ExternalLink,
} from "lucide-react";
import { sounds } from "@/lib/soundFX";
import { TeamState } from "@/game/teamState";
import {
  LiveTournamentState,
  INITIAL_TOURNAMENT_STATE,
  ROOM_CODES,
  getTournamentBroadcastChannel,
  broadcastTournamentUpdate,
} from "@/lib/tournamentLiveSync";

interface HostDashboardModalProps {
  currentTimerSec: number;
  currentTeamState: TeamState;
  isGameStarted: boolean;
  sessionCode: string;
  teamCapacity: number;
  onSetTimerSec: React.Dispatch<React.SetStateAction<number>>;
  onSetSessionCode: (code: string) => void;
  onSetTeamCapacity: (cap: number) => void;
  onStartTournament: () => void;
  onBroadcastAnnouncement: (message: string) => void;
  onClose: () => void;
}

export function HostDashboardModal({
  currentTimerSec,
  currentTeamState,
  isGameStarted,
  sessionCode,
  teamCapacity,
  onSetTimerSec,
  onSetSessionCode,
  onSetTeamCapacity,
  onStartTournament,
  onBroadcastAnnouncement,
  onClose,
}: HostDashboardModalProps) {
  const [tournamentState, setTournamentState] = useState<LiveTournamentState>(INITIAL_TOURNAMENT_STATE);
  const [activeTab, setActiveTab] = useState<"squads" | "control" | "projector">("squads");
  const [broadcastText, setBroadcastText] = useState<string>("");

  const fetchLiveState = async () => {
    try {
      const res = await fetch("/api/tournament");
      if (res.ok) {
        const data: LiveTournamentState = await res.json();
        setTournamentState(data);
      }
    } catch (err) {
      console.warn("Host modal sync error:", err);
    }
  };

  useEffect(() => {
    fetchLiveState();
    const interval = setInterval(fetchLiveState, 1500);

    const channel = getTournamentBroadcastChannel();
    if (channel) {
      channel.onmessage = (event) => {
        if (event.data?.type === "TOURNAMENT_STATE_UPDATE" && event.data.payload) {
          setTournamentState(event.data.payload);
        }
      };
    }

    return () => {
      clearInterval(interval);
      channel?.close();
    };
  }, []);

  const sendAction = async (action: string, payload: any) => {
    try {
      const res = await fetch("/api/tournament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      if (res.ok) {
        const updated: LiveTournamentState = await res.json();
        setTournamentState(updated);
        broadcastTournamentUpdate(updated);
      }
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  const handleStartTournament = () => {
    sounds.playFanfare();
    onStartTournament();
    sendAction("START_TOURNAMENT", {});
  };

  const handleResetScores = () => {
    if (confirm("🔄 Reset all squad scores, coins, and sector progress to 0? (Students will remain in their squads)")) {
      sounds.playCoin();
      sendAction("RESET_SCORES", {});
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    sounds.playStamp();
    onBroadcastAnnouncement(broadcastText.trim());
    sendAction("BROADCAST_MESSAGE", { message: broadcastText.trim() });
    setBroadcastText("");
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(Math.max(0, totalSec) / 60);
    const secs = Math.max(0, totalSec) % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const activeSquads = ROOM_CODES.slice(0, tournamentState.teamCapacity || teamCapacity).map(
    (code) => tournamentState.squads[code] || {
      id: code,
      code,
      name: `Group (${code})`,
      maxMembers: 4,
      members: [],
      score: 0,
      coins: 120,
      solvedCases: [],
      activeCaseId: 1,
      filesEvaluatedCount: 0,
      escaped: false,
    }
  );

  const sortedLeaderboard = [...activeSquads].sort((a, b) => {
    if (a.escaped && !b.escaped) return -1;
    if (!a.escaped && b.escaped) return 1;
    return b.score - a.score;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl bg-[#080e1c] rounded-3xl border-4 border-amber-500/90 shadow-2xl text-slate-100 h-[92vh] flex flex-col justify-between overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-500 hover:bg-red-400 border-2 border-red-700 text-white flex items-center justify-center shadow-lg cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-800 flex flex-wrap items-center justify-between gap-3 pr-14 select-none shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 shadow-md">
              <Trophy size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
                  Host Tournament Control Deck
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage live squad check-in, broadcast live seminar alerts, and stream the leaderboard.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab("squads")}
                className={`px-3 py-1.5 rounded-lg uppercase transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "squads" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
                }`}
              >
                <Users size={14} />
                <span>Squads</span>
              </button>
              <button
                onClick={() => setActiveTab("control")}
                className={`px-3 py-1.5 rounded-lg uppercase transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "control" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
                }`}
              >
                <Settings size={14} />
                <span>Controls</span>
              </button>
              <button
                onClick={() => setActiveTab("projector")}
                className={`px-3 py-1.5 rounded-lg uppercase transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "projector" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
                }`}
              >
                <Maximize2 size={14} />
                <span>Projector</span>
              </button>
            </div>

            <button
              onClick={handleResetScores}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/50 text-xs font-black uppercase text-amber-300 flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset Scores</span>
            </button>

            <a
              href="/host"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow"
            >
              <span>Dedicated /host Page</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Tab 1: Live Squads */}
        {activeTab === "squads" && (
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 min-h-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Users size={15} className="text-amber-400" />
                Live Squad Roster (BSIT3A-G1 to BSIT3A-G10)
              </span>
              <span className="text-xs text-amber-300 font-mono font-bold">
                Capacity: {activeSquads.length} Rooms &bull; 4 Members Each
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeSquads.map((squad) => {
                const isComplete = squad.members.length === 4;
                const isMissing = squad.members.length > 0 && squad.members.length < 4;
                const missingCount = 4 - squad.members.length;

                return (
                  <div
                    key={squad.code}
                    className={`p-3 rounded-2xl border-2 transition ${
                      squad.escaped
                        ? "bg-emerald-950/40 border-emerald-500"
                        : isComplete
                        ? "bg-slate-900 border-emerald-500/70"
                        : isMissing
                        ? "bg-slate-900 border-amber-500/70"
                        : "bg-slate-950/80 border-slate-800 opacity-75"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-700">
                          {squad.code}
                        </span>
                        <h4 className="text-sm font-black text-white">{squad.name}</h4>
                      </div>

                      <div>
                        {squad.escaped ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-slate-950">
                            Escaped!
                          </span>
                        ) : isComplete ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-600 flex items-center gap-1">
                            <UserCheck size={11} /> 4/4 Ready
                          </span>
                        ) : isMissing ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-950 text-amber-300 border border-amber-600 flex items-center gap-1 animate-pulse">
                            <UserX size={11} /> Missing {missingCount}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-400">
                            0/4 Empty
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Member Slots */}
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      {[0, 1, 2, 3].map((idx) => {
                        const m = squad.members[idx];
                        return (
                          <div
                            key={idx}
                            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 ${
                              m
                                ? "bg-slate-950 border-slate-700 text-white font-bold"
                                : "bg-slate-950/50 border-dashed border-slate-800 text-slate-500"
                            }`}
                          >
                            <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                            <span className="truncate">{m ? m.name : "Open Slot"}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Score Breakdown */}
                    <div className="flex items-center justify-between text-xs font-bold pt-1.5 border-t border-slate-800 text-slate-300">
                      <span className="text-amber-400 font-mono">{squad.score} pts</span>
                      <span className="text-emerald-400 font-mono text-[11px]">{squad.filesEvaluatedCount} Files</span>
                      <span className="text-purple-400 font-mono text-[11px]">{squad.solvedCases.length}/5 Cases</span>
                      <span className="text-amber-200 font-mono text-[11px]">{squad.coins} Coins</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Host Controls */}
        {activeTab === "control" && (
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 min-h-0">
            <div className="bg-slate-900/90 rounded-2xl border-2 border-slate-800 p-4 space-y-3">
              <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-2">
                <Settings size={16} /> Tournament Server Controls:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Room Capacity
                  </label>
                  <select
                    value={teamCapacity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onSetTeamCapacity(val);
                      sendAction("SET_CAPACITY", { capacity: val });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-amber-300"
                  >
                    <option value={4}>4 Rooms (BSIT3A-G1 to G4)</option>
                    <option value={6}>6 Rooms (BSIT3A-G1 to G6)</option>
                    <option value={8}>8 Rooms (BSIT3A-G1 to G8)</option>
                    <option value={10}>10 Rooms (BSIT3A-G1 to G10 - All)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  {!isGameStarted ? (
                    <button
                      onClick={handleStartTournament}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase cursor-pointer shadow-lg"
                    >
                      Start Tournament Now!
                    </button>
                  ) : (
                    <button
                      onClick={handleResetScores}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={14} />
                      <span>Reset Scores & Cases</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    onClick={() => {
                      onSetTimerSec(1800);
                      sendAction("UPDATE_TIMER", { timerSec: 1800, isTimerPaused: true });
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-xs uppercase cursor-pointer border border-slate-700 flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw size={14} /> Reset 30m Timer
                  </button>
                </div>
              </div>
            </div>

            {/* Broadcast Console */}
            <div className="bg-slate-900/90 rounded-2xl border-2 border-slate-800 p-4 space-y-3">
              <span className="text-xs font-black uppercase text-rose-300 flex items-center gap-2">
                <Radio size={16} /> Broadcast Alert to All Teams:
              </span>
              <form onSubmit={handleSendBroadcast} className="flex gap-2">
                <input
                  type="text"
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  placeholder="Type an announcement to flash on student screens..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: Projector Mode */}
        {activeTab === "projector" && (
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 min-h-0">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black uppercase">
                <Trophy size={14} /> Official Seminar Tournament Standings
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase">
                AFTER HOURS: Can You Trust AI?
              </h3>
            </div>

            {/* Table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Room Code</th>
                    <th className="py-2.5 px-3">Squad Name</th>
                    <th className="py-2.5 px-3">Members (4)</th>
                    <th className="py-2.5 px-3">Files Verified</th>
                    <th className="py-2.5 px-3">Sectors Overridden</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {sortedLeaderboard.map((team, idx) => (
                    <tr key={team.code} className={idx === 0 ? "bg-amber-950/20" : "hover:bg-slate-900/40"}>
                      <td className="py-2.5 px-3 font-mono font-black">
                        {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">{team.code}</td>
                      <td className="py-2.5 px-3 text-white font-bold">{team.name}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">
                        {team.members.length > 0 ? team.members.map((m) => m.name).join(", ") : "(Empty)"}
                      </td>
                      <td className="py-2.5 px-3 text-emerald-400 font-mono">{team.filesEvaluatedCount} (+{team.filesEvaluatedCount * 50} pts)</td>
                      <td className="py-2.5 px-3 text-purple-400 font-mono">{team.solvedCases.length}/5 (+{team.solvedCases.length * 100} pts)</td>
                      <td className="py-2.5 px-3">
                        {team.escaped ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-slate-950">
                            Escaped!
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-400">
                            Investigating
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-black text-amber-400">{team.score} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Seminar Facilitator Command Deck</span>
          <button
            onClick={onClose}
            className="btn-cartoon-green px-4 py-1.5 rounded-xl font-black text-xs uppercase cursor-pointer"
          >
            Close Deck
          </button>
        </div>
      </div>
    </div>
  );
}
