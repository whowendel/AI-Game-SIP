"use client";

import React from "react";
import {
  CartoonCoin,
  CartoonGem,
} from "./CartoonCharacters";
import { Trophy, Volume2, VolumeX, HelpCircle, Users, Clock } from "lucide-react";
import { sounds } from "@/lib/soundFX";

interface HeaderBarProps {
  coins: number;
  tokens: number;
  timerSec: number;
  roomCode: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenLeaderboard: () => void;
  onOpenLobby: () => void;
  onOpenHelp: () => void;
}

export function HeaderBar({
  coins,
  tokens,
  timerSec,
  roomCode,
  soundEnabled,
  onToggleSound,
  onOpenLeaderboard,
  onOpenLobby,
  onOpenHelp,
}: HeaderBarProps) {
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(Math.max(0, totalSec) / 60);
    const secs = Math.max(0, totalSec) % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isTimeCritical = timerSec < 90;

  return (
    <header className="w-full max-w-4xl mx-auto px-3 py-2 flex flex-wrap items-center justify-between gap-2.5 z-20">
      {/* Left side: Currencies & Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Token / Gem Counter */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-xs border-2 border-purple-500/80 rounded-full px-3 py-1 shadow-md">
          <CartoonGem size={22} />
          <span className="font-extrabold text-purple-200 text-xs sm:text-sm tracking-wide">
            {tokens}
          </span>
          <span className="text-[10px] text-purple-400 uppercase font-semibold hidden xs:inline">
            Tokens
          </span>
        </div>

        {/* Gold Coin Counter */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-xs border-2 border-amber-500/80 rounded-full px-3 py-1 shadow-md">
          <CartoonCoin size={22} />
          <span className="font-extrabold text-amber-200 text-xs sm:text-sm tracking-wide">
            {coins.toLocaleString()}
          </span>
          <span className="text-[10px] text-amber-400 uppercase font-semibold hidden xs:inline">
            G
          </span>
        </div>

        {/* Room Code Badge */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenLobby();
          }}
          title="Click to view Room Lobby"
          className="hidden sm:flex items-center gap-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-200 border-2 border-amber-600 rounded-full px-3 py-1 text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Users size={14} className="text-amber-400" />
          <span>{roomCode}</span>
        </button>
      </div>

      {/* Center: Countdown Escape Timer */}
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full border-2 shadow-lg transition-all ${
          isTimeCritical
            ? "bg-red-950/90 border-red-500 text-red-200 animate-pulse"
            : "bg-slate-900/80 border-slate-700 text-slate-200"
        }`}
      >
        <Clock
          size={16}
          className={isTimeCritical ? "text-red-400 animate-spin" : "text-amber-400"}
        />
        <span className="font-mono font-black text-sm tracking-widest">
          {formatTime(timerSec)}
        </span>
      </div>

      {/* Right side: Circular Cartoon Buttons (as seen in reference image 2) */}
      <div className="flex items-center gap-2">
        {/* Lobby Button (Mobile) */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenLobby();
          }}
          className="sm:hidden w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 border-2 border-amber-700 text-amber-950 flex items-center justify-center shadow-md active:translate-y-0.5"
          title="Room Lobby"
        >
          <Users size={17} />
        </button>

        {/* Leaderboard Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenLeaderboard();
          }}
          className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 border-2 border-emerald-700 text-white flex items-center justify-center shadow-md active:translate-y-0.5 transition"
          title="Leaderboard & Room Standings"
        >
          <Trophy size={17} />
        </button>

        {/* Sound Toggle Button */}
        <button
          onClick={() => {
            onToggleSound();
          }}
          className="w-9 h-9 rounded-full bg-sky-500 hover:bg-sky-400 border-2 border-sky-700 text-white flex items-center justify-center shadow-md active:translate-y-0.5 transition"
          title={soundEnabled ? "Mute Sound" : "Enable Sound"}
        >
          {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>

        {/* How to Play / Settings Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenHelp();
          }}
          className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 border-2 border-amber-700 text-amber-950 flex items-center justify-center shadow-md active:translate-y-0.5 transition"
          title="How to Play"
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </header>
  );
}
