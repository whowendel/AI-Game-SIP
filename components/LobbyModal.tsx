"use client";

import React, { useState, useEffect } from "react";
import { STUDENT_AVATARS } from "@/game/playerEngine";
import {
  Users,
  Sparkles,
  Key,
  Play,
  Server,
  CheckCircle2,
  Lock,
  UserCheck,
  UserX,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { sounds } from "@/lib/soundFX";
import {
  LiveTournamentState,
  INITIAL_TOURNAMENT_STATE,
  ROOM_CODES,
  GROUP_THEMES,
  getTournamentBroadcastChannel,
} from "@/lib/tournamentLiveSync";

interface LobbyModalProps {
  currentSessionCode: string;
  currentTeamId: string;
  currentName: string;
  currentAvatar: string;
  isTournamentStarted: boolean;
  onJoinSquad: (
    roomCode: string,
    teamId: string,
    teamName: string,
    playerName: string,
    avatar: string
  ) => void;
  onHostStartTournament?: () => void;
  onOpenHostDashboard?: () => void;
}

export function LobbyModal({
  currentSessionCode,
  currentTeamId,
  currentName,
  currentAvatar,
  isTournamentStarted,
  onJoinSquad,
  onHostStartTournament,
  onOpenHostDashboard,
}: LobbyModalProps) {
  const [tournamentState, setTournamentState] = useState<LiveTournamentState>(INITIAL_TOURNAMENT_STATE);
  const [selectedRoomCode, setSelectedRoomCode] = useState<string>("BSIT3A-G1");
  const [name, setName] = useState<string>(currentName || "Alex Rivera");
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar || "alex");
  const [hasJoinedLounge, setHasJoinedLounge] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Poll server state every 1.5s
  const fetchState = async () => {
    try {
      const res = await fetch("/api/tournament");
      if (res.ok) {
        const data: LiveTournamentState = await res.json();
        setTournamentState(data);

        // If user already joined lounge and host starts tournament, auto-launch!
        if (hasJoinedLounge && data.isGameStarted) {
          const squad = data.squads[selectedRoomCode];
          onJoinSquad(
            selectedRoomCode,
            squad?.id || "squad-1",
            squad?.name || `Group (${selectedRoomCode})`,
            name.trim() || "Student",
            selectedAvatar
          );
        }
      }
    } catch (err) {
      console.warn("Lobby sync error:", err);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 1500);

    const channel = getTournamentBroadcastChannel();
    if (channel) {
      channel.onmessage = (event) => {
        if (event.data?.type === "TOURNAMENT_STATE_UPDATE" && event.data.payload) {
          const updated: LiveTournamentState = event.data.payload;
          setTournamentState(updated);
          if (hasJoinedLounge && updated.isGameStarted) {
            const squad = updated.squads[selectedRoomCode];
            onJoinSquad(
              selectedRoomCode,
              squad?.id || "squad-1",
              squad?.name || `Group (${selectedRoomCode})`,
              name.trim() || "Student",
              selectedAvatar
            );
          }
        }
      };
    }

    return () => {
      clearInterval(interval);
      channel?.close();
    };
  }, [hasJoinedLounge, selectedRoomCode, name, selectedAvatar, onJoinSquad]);

  const currentSquad = tournamentState.squads[selectedRoomCode] || {
    id: "squad-1",
    code: selectedRoomCode,
    name: `Group 1 (${GROUP_THEMES[selectedRoomCode] || "Cyber Sentinels"})`,
    maxMembers: 4,
    members: [],
    score: 0,
    coins: 120,
    solvedCases: [],
    activeCaseId: 1,
    filesEvaluatedCount: 0,
    escaped: false,
  };

  const isSquadFull = currentSquad.members.length >= 4;
  const isComplete = currentSquad.members.length === 4;
  const missingCount = Math.max(0, 4 - currentSquad.members.length);

  const handleJoinLounge = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      sounds.playError();
      setErrorMsg("Please enter your name to register for the squad.");
      return;
    }

    if (isSquadFull && !currentSquad.members.some((m) => m.name.toLowerCase() === trimmedName.toLowerCase())) {
      sounds.playError();
      setErrorMsg(`Room ${selectedRoomCode} is already full (4/4 members). Please choose another room.`);
      return;
    }

    sounds.playStamp();
    setErrorMsg("");

    // Register with server API
    try {
      await fetch("/api/tournament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "JOIN_SQUAD",
          payload: {
            roomCode: selectedRoomCode,
            playerName: trimmedName,
            avatar: selectedAvatar,
          },
        }),
      });
      setHasJoinedLounge(true);

      // If tournament is already started by host, immediately jump into game!
      if (tournamentState.isGameStarted) {
        onJoinSquad(
          selectedRoomCode,
          currentSquad.id,
          currentSquad.name,
          trimmedName,
          selectedAvatar
        );
      }
    } catch (err) {
      console.error("Failed to join squad:", err);
      setHasJoinedLounge(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#091122] rounded-3xl border-4 border-amber-500/90 p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/40 px-3 py-1 rounded-full text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            AFTER HOURS: Can You Trust AI? &bull; Tournament Lobby
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Join Your Investigation Squad
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Sign up into your team&apos;s designated room (BSIT3A-G1 to G10). Each squad accommodates exactly 4 students.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/80 border-2 border-red-500 rounded-2xl text-xs font-bold text-red-200 mb-3 flex items-center gap-2 animate-in fade-in">
            <ShieldAlert size={16} className="text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!hasJoinedLounge ? (
          // ================= REGISTRATION FORM =================
          <form onSubmit={handleJoinLounge} className="space-y-4">
            {/* Room Code Selector (BSIT3A-G1 to G10) */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border-2 border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Key size={14} /> Select Assigned Room Code:
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  (BSIT3A-G1 through BSIT3A-G10)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {ROOM_CODES.map((code) => {
                  const squad = tournamentState.squads[code];
                  const count = squad?.members?.length || 0;
                  const isSelected = selectedRoomCode === code;
                  const isFull = count >= 4;

                  return (
                    <button
                      type="button"
                      key={code}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedRoomCode(code);
                      }}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? "bg-amber-500 border-amber-400 text-slate-950 font-black shadow-lg scale-105"
                          : isFull
                          ? "bg-slate-950/80 border-slate-900 text-slate-500 opacity-60"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700 text-white"
                      }`}
                    >
                      <span className="font-mono text-xs font-bold block">{code}</span>
                      <span className={`text-[9px] font-bold block mt-0.5 ${
                        isSelected ? "text-slate-900" : isFull ? "text-rose-400" : "text-emerald-400"
                      }`}>
                        {count}/4 {isFull ? "Full" : "Joined"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Squad Live Status Card */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between mt-2">
                <div>
                  <span className="text-xs font-black text-white block">
                    {currentSquad.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Room Code: <strong className="text-amber-300 font-mono">{selectedRoomCode}</strong>
                  </span>
                </div>

                <div>
                  {isComplete ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-600 flex items-center gap-1">
                      <UserCheck size={12} /> Ready (4/4)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-950 text-amber-300 border border-amber-600 flex items-center gap-1">
                      <UserX size={12} /> Missing {missingCount} Player{missingCount > 1 ? "s" : ""} ({currentSquad.members.length}/4)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Student Name */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border-2 border-slate-800 space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 block">
                Your Student Full Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your student name..."
                className="w-full bg-slate-950 border-2 border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>

            {/* Avatar Selector */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border-2 border-slate-800 space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 block">
                Choose Your Character:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(STUDENT_AVATARS).map(([key, info]) => {
                  const isSelected = selectedAvatar === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedAvatar(key);
                      }}
                      className={`p-2.5 rounded-2xl border-2 text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? "bg-amber-500/20 border-amber-400 text-white shadow-md scale-102"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="text-2xl">{info.badge}</div>
                      <span className="font-extrabold text-xs text-white">{info.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSquadFull}
              className={`w-full py-3 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
                isSquadFull
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "btn-cartoon-green"
              }`}
            >
              <Users size={18} />
              <span>{isSquadFull ? "Room is Full (Choose Another Room)" : `Register & Enter Room ${selectedRoomCode}`}</span>
            </button>
          </form>
        ) : (
          // ================= SQUAD STANDBY LOUNGE =================
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            <div className="p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-500/80 text-center space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                Registration Confirmed &bull; Room {selectedRoomCode}
              </span>
              <h3 className="text-lg font-black text-white">
                {currentSquad.name}
              </h3>
              <p className="text-xs text-slate-300">
                You are registered as <strong>{name}</strong>. Coordinate with your 4 squad members!
              </p>
            </div>

            {/* 4 Member Slots Preview (Live!) */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border-2 border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-300">
                  Live Squad Members ({currentSquad.members.length}/4)
                </span>
                {isComplete ? (
                  <span className="text-xs font-black text-emerald-400">
                    ✓ All 4 Squad Members Ready
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-300 animate-pulse">
                    Waiting for {missingCount} more student{missingCount > 1 ? "s" : ""}...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((idx) => {
                  const member = currentSquad.members[idx];
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                        member
                          ? "bg-slate-950 border-emerald-500/80 text-white"
                          : "bg-slate-950/60 border-dashed border-slate-800 text-slate-500"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-bold shrink-0">
                        {member ? "👤" : idx + 1}
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold block truncate">
                          {member ? member.name : `Slot ${idx + 1} (Waiting)`}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {member ? `Joined ${member.joinedAt}` : "Open Slot"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Host Standby Banner */}
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-cyan-300 text-xs font-black uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Waiting for Seminar Host to Start Tournament</span>
              </div>
              <p className="text-xs text-slate-300">
                The facilitator controls the master start timer from the Host Command Deck. Your screen will automatically launch the game as soon as the tournament begins!
              </p>
            </div>

            {/* Optional Immediate Start for Solo testing / Fast Facilitator Preview */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setHasJoinedLounge(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                &larr; Change Room / Name
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playFanfare();
                  onJoinSquad(
                    selectedRoomCode,
                    currentSquad.id,
                    currentSquad.name,
                    name.trim() || "Alex",
                    selectedAvatar
                  );
                }}
                className="btn-cartoon-green px-4 py-2 rounded-xl font-black text-xs uppercase cursor-pointer"
              >
                Instant Enter (Demo Mode) &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Footer Link to Dedicated Host Page */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Are you the Seminar Facilitator / Instructor?</span>
          <a
            href="/host"
            target="_blank"
            rel="noreferrer"
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
          >
            <span>Open Dedicated Host Page (/host)</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
