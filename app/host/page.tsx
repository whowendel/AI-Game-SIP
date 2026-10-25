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
  Minimize2,
  Key,
  Server,
  Settings,
  Flame,
  Award,
  Sparkles,
  UserCheck,
  UserX,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { CartoonCoin } from "@/components/CartoonCharacters";
import { sounds } from "@/lib/soundFX";
import {
  LiveTournamentState,
  INITIAL_TOURNAMENT_STATE,
  ROOM_CODES,
  getTournamentBroadcastChannel,
  broadcastTournamentUpdate,
} from "@/lib/tournamentLiveSync";

export default function HostTournamentPage() {
  const [tournamentState, setTournamentState] = useState<LiveTournamentState>(INITIAL_TOURNAMENT_STATE);
  const [activeTab, setActiveTab] = useState<"control" | "squads" | "projector">("squads");
  const [broadcastText, setBroadcastText] = useState<string>("");
  const [isProjectorFullscreen, setIsProjectorFullscreen] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Just now");

  // Fetch live state from server API
  const fetchState = async () => {
    try {
      const res = await fetch("/api/tournament");
      if (res.ok) {
        const data: LiveTournamentState = await res.json();
        setTournamentState(data);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.warn("Error fetching tournament state:", err);
    }
  };

  // Initial load and periodic polling every 1.5 seconds
  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 1500);

    // Cross-tab broadcast channel listener
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

  // Post update to server
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
    sendAction("START_TOURNAMENT", {});
  };

  const handleToggleTimer = () => {
    sounds.playClick();
    sendAction("UPDATE_TIMER", {
      isTimerPaused: !tournamentState.isTimerPaused,
    });
  };

  const handleAdjustTimer = (deltaSec: number) => {
    sounds.playClick();
    sendAction("UPDATE_TIMER", {
      timerSec: Math.max(60, tournamentState.timerSec + deltaSec),
    });
  };

  const handleResetTimer = () => {
    sounds.playClick();
    sendAction("UPDATE_TIMER", { timerSec: 1800, isTimerPaused: true });
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    sounds.playStamp();
    sendAction("BROADCAST_MESSAGE", { message: broadcastText.trim() });
    setBroadcastText("");
  };

  const handleResetScores = () => {
    if (confirm("🔄 Reset all squad scores, coins, and solved sectors to 0? (Students will remain in their squads)")) {
      sounds.playCoin();
      sendAction("RESET_SCORES", {});
    }
  };

  const handleResetAll = () => {
    if (confirm("⚠️ Are you sure you want to RESET the entire tournament? All squads and scores will be cleared!")) {
      sounds.playError();
      sendAction("RESET_TOURNAMENT", {});
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(Math.max(0, totalSec) / 60);
    const secs = Math.max(0, totalSec) % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const activeSquads = ROOM_CODES.slice(0, tournamentState.teamCapacity).map(
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

  const totalRegisteredStudents = activeSquads.reduce((acc, s) => acc + s.members.length, 0);
  const totalCompletedSquads = activeSquads.filter((s) => s.members.length === 4).length;

  const sortedLeaderboard = [...activeSquads].sort((a, b) => {
    if (a.escaped && !b.escaped) return -1;
    if (!a.escaped && b.escaped) return 1;
    return b.score - a.score;
  });

  return (
    <div className="min-h-screen w-full bg-[#070c17] text-slate-100 flex flex-col justify-between font-sans">
      {/* Top Navbar */}
      <header className="bg-[#0b1325] border-b-2 border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 shadow-md">
            <Trophy size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
                AFTER HOURS &bull; Host Command Deck
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Facilitator Central: Monitor live squads (BSIT3A-G1 to G10), trigger tournament start, and broadcast live alerts.
            </p>
          </div>
        </div>

        {/* Tab Switcher & Quick Links */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("squads")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "squads"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users size={14} />
              <span>Live Squads</span>
            </button>
            <button
              onClick={() => setActiveTab("control")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "control"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Settings size={14} />
              <span>Host Controls</span>
            </button>
            <button
              onClick={() => setActiveTab("projector")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "projector"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Maximize2 size={14} />
              <span>Projector Leaderboard</span>
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
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow"
          >
            <span>Open Student Tab</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-5">
        {/* ================= TAB 1: LIVE SQUADS MONITOR ================= */}
        {activeTab === "squads" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Top Quick Status Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="bg-[#0b1324] border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500 flex items-center justify-center text-purple-300 font-black">
                  {totalRegisteredStudents}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Registered Students</span>
                  <span className="text-sm font-black text-white">{totalRegisteredStudents} / {tournamentState.teamCapacity * 4} Filled</span>
                </div>
              </div>

              <div className="bg-[#0b1324] border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-300 font-black">
                  {totalCompletedSquads}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Complete Squads</span>
                  <span className="text-sm font-black text-emerald-300">{totalCompletedSquads} / {tournamentState.teamCapacity} Ready (4/4)</span>
                </div>
              </div>

              <div className="bg-[#0b1324] border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-300 font-black">
                  ⏱️
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Seminar Timer</span>
                  <span className="text-sm font-mono font-black text-amber-300">{formatTimer(tournamentState.timerSec)}</span>
                </div>
              </div>

              <div className="bg-[#0b1324] border border-slate-800 p-3 rounded-2xl flex items-center justify-center">
                {!tournamentState.isGameStarted ? (
                  <button
                    onClick={handleStartTournament}
                    className="w-full h-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 cursor-pointer animate-pulse"
                  >
                    <Play size={16} />
                    <span>Start Tournament!</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Tournament is Live!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Live Squads Grid (BSIT3A-G1 to G10) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Users size={15} className="text-amber-400" />
                  Live Squads Roster (Rooms BSIT3A-G1 to BSIT3A-G{tournamentState.teamCapacity})
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Last synced: {lastSyncTime}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3.5">
                {activeSquads.map((squad) => {
                  const isComplete = squad.members.length === 4;
                  const isMissing = squad.members.length > 0 && squad.members.length < 4;
                  const missingCount = 4 - squad.members.length;

                  return (
                    <div
                      key={squad.code}
                      className={`p-4 rounded-2xl border-2 transition shadow-lg ${
                        squad.escaped
                          ? "bg-emerald-950/40 border-emerald-500 shadow-emerald-950/40"
                          : isComplete
                          ? "bg-[#0b1426] border-emerald-500/70"
                          : isMissing
                          ? "bg-[#0b1426] border-amber-500/70"
                          : "bg-[#09101f] border-slate-800 opacity-80"
                      }`}
                    >
                      {/* Squad Header */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-700">
                              {squad.code}
                            </span>
                            <h3 className="text-sm font-black text-white">
                              {squad.name}
                            </h3>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {squad.escaped ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-slate-950 shadow">
                              🎉 Escaped ({squad.escapedTime || "Final"})
                            </span>
                          ) : isComplete ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-600 flex items-center gap-1">
                              <UserCheck size={12} /> Ready (4/4)
                            </span>
                          ) : isMissing ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-950 text-amber-300 border border-amber-600 flex items-center gap-1 animate-pulse">
                              <UserX size={12} /> Missing {missingCount} Player{missingCount > 1 ? "s" : ""} ({squad.members.length}/4)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-400">
                              Waiting (0/4)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 4 Member Slots (Live!) */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {[0, 1, 2, 3].map((slotIdx) => {
                          const member = squad.members[slotIdx];
                          return (
                            <div
                              key={slotIdx}
                              className={`p-2 rounded-xl border flex items-center gap-2 ${
                                member
                                  ? "bg-slate-900 border-slate-700 text-white"
                                  : "bg-slate-950/60 border-dashed border-slate-800 text-slate-500"
                              }`}
                            >
                              <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                                {member ? "👤" : `${slotIdx + 1}`}
                              </div>
                              <div className="truncate">
                                <span className="text-xs font-bold block truncate leading-tight">
                                  {member ? member.name : `Slot ${slotIdx + 1} Open`}
                                </span>
                                <span className="text-[9px] font-mono opacity-70 block truncate">
                                  {member ? `Avatar: ${member.avatar}` : "Waiting for player..."}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Live In-Game Metrics */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-300">
                        <div className="flex items-center gap-3">
                          <span className="text-amber-400 font-mono font-black">
                            {squad.score} Pts
                          </span>
                          <span className="text-emerald-400 font-mono text-[11px]">
                            {squad.filesEvaluatedCount} Files Checked
                          </span>
                          <span className="text-purple-400 font-mono text-[11px]">
                            {squad.solvedCases.length}/5 Sectors
                          </span>
                        </div>

                        <span className="font-mono text-amber-200 text-xs">
                          {squad.coins} Coins
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: HOST CONTROLS ================= */}
        {activeTab === "control" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Server Settings Card */}
            <div className="bg-[#0b1324] border-2 border-slate-800 rounded-3xl p-5 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Settings size={16} /> Tournament Server Configuration:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Room / Session Name
                  </label>
                  <input
                    type="text"
                    value={tournamentState.sessionCode}
                    onChange={(e) => sendAction("SET_CAPACITY", { sessionCode: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Active Room Capacity (BSIT3A-G1 to BSIT3A-G10)
                  </label>
                  <select
                    value={tournamentState.teamCapacity}
                    onChange={(e) => sendAction("SET_CAPACITY", { capacity: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                  >
                    <option value={4}>4 Squads (16 Students &bull; BSIT3A-G1 to G4)</option>
                    <option value={6}>6 Squads (24 Students &bull; BSIT3A-G1 to G6)</option>
                    <option value={8}>8 Squads (32 Students &bull; BSIT3A-G1 to G8)</option>
                    <option value={10}>10 Squads (40 Students &bull; BSIT3A-G1 to G10 - All)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  {!tournamentState.isGameStarted ? (
                    <button
                      onClick={handleStartTournament}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                    >
                      <Play size={16} />
                      <span>Start Tournament For All Squads</span>
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleResetScores}
                        className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        <span>Reset Scores</span>
                      </button>
                      <button
                        onClick={handleResetAll}
                        className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-md cursor-pointer"
                        title="Clear all squads and reset everything"
                      >
                        <span>Wipe All</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Seminar Countdown Timer Controls */}
            <div className="bg-[#0b1324] border-2 border-slate-800 rounded-3xl p-5 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                <Clock size={16} /> Seminar Countdown Controller:
              </span>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-3xl font-black text-amber-400 bg-slate-950 px-4 py-2 rounded-2xl border border-amber-500/50">
                    ⏱️ {formatTimer(tournamentState.timerSec)}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">
                      Target Duration: 30:00 (Standard Workshop Session)
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Changes synchronize instantly to all joined student screens.
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleAdjustTimer(300)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 cursor-pointer"
                  >
                    +5 Min
                  </button>
                  <button
                    onClick={() => handleAdjustTimer(-300)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 cursor-pointer"
                  >
                    -5 Min
                  </button>
                  <button
                    onClick={handleResetTimer}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 border border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Reset 30m
                  </button>
                  <button
                    onClick={handleToggleTimer}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-md ${
                      tournamentState.isTimerPaused
                        ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                        : "bg-amber-500 hover:bg-amber-400 text-slate-950"
                    }`}
                  >
                    {tournamentState.isTimerPaused ? <Play size={14} /> : <Pause size={14} />}
                    <span>{tournamentState.isTimerPaused ? "Resume" : "Pause"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Broadcast Live Alert */}
            <div className="bg-[#0b1324] border-2 border-slate-800 rounded-3xl p-5 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-rose-300 flex items-center gap-2">
                <Radio size={16} /> Broadcast Live Alert to All Student Screens:
              </span>

              <form onSubmit={handleBroadcast} className="flex gap-2">
                <input
                  type="text"
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  placeholder="e.g. 'Attention investigators: 10 minutes remain! Check the clinic atomic time!'"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send size={14} /> Send Broadcast
                </button>
              </form>

              {tournamentState.broadcastLog.length > 0 && (
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {tournamentState.broadcastLog.map((log, i) => (
                    <p key={i} className="text-xs font-mono text-rose-300/90 bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-800">
                      {log}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: PROJECTOR LEADERBOARD MODE ================= */}
        {activeTab === "projector" && (
          <div className="space-y-5 animate-in zoom-in-95 duration-200">
            {/* Top Projector Banner */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black uppercase tracking-wider">
                <Trophy size={16} /> Live Tournament Leaderboard &bull; Session: {tournamentState.sessionCode}
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                AFTER HOURS: Can You Trust AI?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Live Multi-Squad Fact-Checking Challenge &bull; Real-Time Points Breakdown
              </p>
            </div>

            {/* Podium Top 3 */}
            <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto w-full pt-2">
              {/* 2nd place */}
              <div className="bg-slate-900/90 rounded-2xl border-2 border-slate-600 p-3 text-center flex flex-col justify-end order-1">
                <span className="text-2xl mb-1">🥈</span>
                <span className="text-xs font-black text-slate-200 truncate">{sortedLeaderboard[1]?.name || "Group 2"}</span>
                <span className="text-[10px] font-mono text-amber-400">{sortedLeaderboard[1]?.code || "BSIT3A-G2"}</span>
                <span className="text-base font-black text-white font-mono mt-1">{sortedLeaderboard[1]?.score || 0} pts</span>
              </div>

              {/* 1st place */}
              <div className="bg-gradient-to-b from-amber-950/80 to-slate-900/90 rounded-2xl border-3 border-amber-400 p-4 text-center flex flex-col justify-end order-2 shadow-2xl scale-105">
                <span className="text-3xl mb-1 animate-bounce">👑</span>
                <span className="text-xs font-black text-amber-300 truncate">{sortedLeaderboard[0]?.name || "Group 1"}</span>
                <span className="text-[10px] font-mono text-amber-400">{sortedLeaderboard[0]?.code || "BSIT3A-G1"}</span>
                <span className="text-xl font-black text-amber-300 font-mono mt-1">{sortedLeaderboard[0]?.score || 0} pts</span>
              </div>

              {/* 3rd place */}
              <div className="bg-slate-900/90 rounded-2xl border-2 border-amber-900/60 p-3 text-center flex flex-col justify-end order-3">
                <span className="text-2xl mb-1">🥉</span>
                <span className="text-xs font-black text-slate-300 truncate">{sortedLeaderboard[2]?.name || "Group 3"}</span>
                <span className="text-[10px] font-mono text-amber-400">{sortedLeaderboard[2]?.code || "BSIT3A-G3"}</span>
                <span className="text-base font-black text-white font-mono mt-1">{sortedLeaderboard[2]?.score || 0} pts</span>
              </div>
            </div>

            {/* Full Leaderboard Table */}
            <div className="bg-[#0b1324] border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Squad Code</th>
                      <th className="py-3 px-4">Team Name</th>
                      <th className="py-3 px-4">Members (4)</th>
                      <th className="py-3 px-4">Files Verified</th>
                      <th className="py-3 px-4">Sectors Overridden</th>
                      <th className="py-3 px-4">Coins</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Total Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-medium">
                    {sortedLeaderboard.map((team, idx) => (
                      <tr
                        key={team.code}
                        className={`transition ${
                          idx === 0
                            ? "bg-amber-950/20"
                            : team.escaped
                            ? "bg-emerald-950/20"
                            : "hover:bg-slate-900/50"
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-black text-sm">
                          {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">
                          {team.code}
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          {team.name}
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                          {team.members.length > 0 ? team.members.map((m) => m.name).join(", ") : "(Empty)"}
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-400">
                          {team.filesEvaluatedCount} (+{team.filesEvaluatedCount * 50} pts)
                        </td>
                        <td className="py-3 px-4 font-mono text-purple-400">
                          {team.solvedCases.length}/5 (+{team.solvedCases.length * 100} pts)
                        </td>
                        <td className="py-3 px-4 font-mono text-amber-200">
                          {team.coins}
                        </td>
                        <td className="py-3 px-4">
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
                        <td className="py-3 px-4 text-right font-mono font-black text-sm text-amber-400">
                          {team.score} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0b1325] border-t border-slate-800 px-6 py-2.5 text-xs text-slate-500 flex items-center justify-between">
        <span>Saint Jude Academy Seminar Workshop &bull; Real-Time Multi-Squad System</span>
        <span>Share Room Codes: BSIT3A-G1 through BSIT3A-G10 with student teams</span>
      </footer>
    </div>
  );
}
