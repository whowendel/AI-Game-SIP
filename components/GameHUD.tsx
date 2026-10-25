"use client";

import React from "react";
import { PlayerState, STUDENT_AVATARS, InteractiveTarget } from "@/game/playerEngine";
import { ROOMS } from "@/game/schoolMapData";
import { CartoonCoin } from "@/components/CartoonCharacters";
import {
  MapPin,
  ClipboardList,
  Bot,
  FolderTree,
  Map as MapIcon,
  HelpCircle,
  Target,
  Trophy,
  Sparkles,
} from "lucide-react";

interface GameHUDProps {
  player: PlayerState;
  interactiveTarget: InteractiveTarget | null;
  coins: number;
  activeCaseId: number | null;
  timerSec: number;
  solvedCount: number;
  onOpenBoard: () => void;
  onOpenEcho: () => void;
  onOpenFiles: () => void;
  onOpenMap: () => void;
  onOpenHelp: () => void;
  onOpenHost?: () => void;
  onInteract?: () => void;
}

export function GameHUD({
  player,
  interactiveTarget,
  coins,
  activeCaseId,
  timerSec,
  solvedCount,
  onOpenBoard,
  onOpenEcho,
  onOpenFiles,
  onOpenMap,
  onOpenHelp,
  onOpenHost,
  onInteract,
}: GameHUDProps) {
  const currentRoom = ROOMS.find((r) => r.id === player.currentRoomId);
  const locationName = currentRoom
    ? `Rm ${currentRoom.number}: ${currentRoom.name}`
    : "Central Campus Corridor";

  const avatarInfo = STUDENT_AVATARS[player.avatar] || STUDENT_AVATARS["alex"];

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(Math.max(0, totalSec) / 60);
    const secs = Math.max(0, totalSec) % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* ================= TOP STATUS BAR ================= */}
      <header className="fixed top-3 inset-x-3 z-30 flex items-center justify-between select-none pointer-events-none">
        {/* Left: Player Profile and Coin Balance */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Avatar Profile */}
          <div className="flex items-center gap-2.5 bg-[#090f1e]/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border-2 border-slate-700/80 shadow-2xl">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-inner border-2 bg-slate-800 shrink-0"
              style={{ borderColor: avatarInfo.color }}
            >
              {avatarInfo.badge}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-white">
                  {player.name}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  (Truth Detective)
                </span>
              </div>
              <div className="text-[10px] text-amber-300 font-mono">
                {locationName}
              </div>
            </div>
          </div>

          {/* Shared Coin Purse */}
          <div className="flex items-center gap-1.5 bg-[#090f1e]/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border-2 border-amber-500/80 shadow-xl">
            <CartoonCoin size={20} />
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-amber-300 leading-none">
                AI Budget
              </span>
              <span className="font-black text-xs text-amber-100 font-mono">
                {coins} Coins
              </span>
            </div>
          </div>
        </div>

        {/* Center: Active Sector Mission & Progress */}
        <div className="hidden sm:flex items-center gap-2.5 bg-[#090f1e]/90 backdrop-blur-md px-4 py-1.5 rounded-2xl border-2 border-purple-500/80 shadow-2xl pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-wider text-purple-300">
              Active Focus
            </span>
            <span className="font-extrabold text-xs text-white">
              {activeCaseId ? `Sector #${activeCaseId}` : "Choose Sector on Board"}
            </span>
          </div>

          <div className="h-5 w-px bg-slate-700 mx-1" />

          <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
            <Trophy size={14} className="text-amber-400" />
            <span>{solvedCount}/5 Overridden</span>
          </div>
        </div>

        {/* Right: Tournament Clock & Host Command */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 backdrop-blur-md shadow-xl ${
              timerSec <= 300
                ? "bg-red-950/90 border-red-500 text-red-200 animate-pulse"
                : "bg-[#090f1e]/90 border-slate-700/80 text-white"
            }`}
          >
            <span className="font-mono font-black text-sm tracking-wider">
              ⏱ {formatTimer(timerSec)}
            </span>
          </div>

          {onOpenHost && (
            <button
              onClick={onOpenHost}
              className="bg-amber-500 hover:bg-amber-400 active:scale-95 border-2 border-amber-600 px-3 py-1.5 rounded-2xl text-slate-950 font-black text-xs uppercase shadow-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Trophy size={14} />
              <span>Host</span>
            </button>
          )}
        </div>
      </header>

      {/* ================= INTERACTION PROMPT ================= */}
      {interactiveTarget && (
        <aside className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 select-none animate-in zoom-in-95 duration-100">
          <div
            onClick={onInteract}
            className="flex items-center gap-3 bg-[#0d172e]/95 backdrop-blur-md border-3 border-amber-400 px-4 py-2 rounded-2xl shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-md animate-bounce">
              E
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-300 block leading-tight">
                {interactiveTarget.actionText}
              </span>
              <span className="text-xs font-black text-white">
                {interactiveTarget.name}
              </span>
            </div>
          </div>
        </aside>
      )}

      {/* ================= BOTTOM ACTION DOCK ================= */}
      <footer className="fixed bottom-3 inset-x-3 z-30 flex items-center justify-center select-none pointer-events-none">
        <nav className="flex items-center gap-1 sm:gap-2 bg-[#090f1e]/95 backdrop-blur-md p-1.5 sm:p-2 rounded-3xl border-2 border-slate-700/80 shadow-2xl pointer-events-auto">
          {/* Investigation Board */}
          <button
            onClick={onOpenBoard}
            className="btn-cartoon-purple px-3 sm:px-4 py-2 rounded-2xl font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <ClipboardList size={16} />
            <span className="hidden sm:inline">Case Board</span>
            <span className="font-mono text-[10px] opacity-70">[Tab]</span>
          </button>

          {/* Ask ECHO Terminal */}
          <button
            onClick={onOpenEcho}
            className="btn-cartoon-blue px-3 sm:px-4 py-2 rounded-2xl font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Bot size={16} />
            <span className="hidden sm:inline">Ask ECHO</span>
            <span className="font-mono text-[10px] opacity-70">[Q]</span>
          </button>

          {/* Room Directory Files */}
          <button
            onClick={onOpenFiles}
            className="btn-cartoon-yellow px-3 sm:px-4 py-2 rounded-2xl font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <FolderTree size={16} />
            <span className="hidden sm:inline">Files</span>
            <span className="font-mono text-[10px] opacity-70">[F]</span>
          </button>

          {/* School Map */}
          <button
            onClick={onOpenMap}
            className="btn-cartoon-green px-3 sm:px-4 py-2 rounded-2xl font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <MapIcon size={16} />
            <span className="hidden sm:inline">Map</span>
            <span className="font-mono text-[10px] opacity-70">[M]</span>
          </button>

          {/* Help */}
          <button
            onClick={onOpenHelp}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-2xl border border-slate-700 cursor-pointer shadow-md transition"
          >
            <HelpCircle size={16} />
          </button>
        </nav>
      </footer>
    </>
  );
}
