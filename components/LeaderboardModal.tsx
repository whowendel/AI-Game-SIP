"use client";

import React from "react";
import { LeaderboardEntry, Player } from "@/lib/multiplayer";
import { Trophy, Clock, ShieldCheck, X } from "lucide-react";
import { sounds } from "@/lib/soundFX";
import { CartoonCoin } from "./CartoonCharacters";

interface LeaderboardModalProps {
  roomCode: string;
  roomPlayers: Player[];
  globalLeaderboard: LeaderboardEntry[];
  onClose: () => void;
}

export function LeaderboardModal({
  roomCode,
  roomPlayers,
  globalLeaderboard,
  onClose,
}: LeaderboardModalProps) {
  const [tab, setTab] = React.useState<"room" | "global">("room");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#fffdf0] rounded-3xl border-4 border-amber-950 p-5 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-red-500 hover:bg-red-400 border-2 border-red-700 text-white flex items-center justify-center shadow-lg cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400 border-3 border-amber-600 flex items-center justify-center shadow-md text-amber-950 mb-1">
            <Trophy size={26} />
          </div>
          <h2 className="text-xl font-black text-amber-950 uppercase tracking-tight">
            Truth Detective Standings
          </h2>
          <p className="text-xs font-bold text-amber-800">
            Room Code: <span className="font-mono text-amber-950">{roomCode}</span>
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-amber-200/80 p-1 mb-3">
          <button
            onClick={() => {
              sounds.playClick();
              setTab("room");
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold uppercase transition cursor-pointer ${
              tab === "room"
                ? "bg-amber-500 text-amber-950 shadow-xs"
                : "text-amber-800 hover:text-amber-950"
            }`}
          >
            Live Room Race ({roomPlayers.length})
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setTab("global");
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold uppercase transition cursor-pointer ${
              tab === "global"
                ? "bg-amber-500 text-amber-950 shadow-xs"
                : "text-amber-800 hover:text-amber-950"
            }`}
          >
            All-Time Hall of Fame
          </button>
        </div>

        {/* List Content */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {tab === "room" ? (
            roomPlayers
              .slice()
              .sort((a, b) => b.score - a.score)
              .map((p, idx) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border-2 ${
                    p.isSelf
                      ? "bg-amber-200/90 border-amber-600 shadow-sm"
                      : "bg-white/80 border-amber-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-xs text-amber-900 w-4 text-center">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                    </span>
                    <span className="text-xl">{p.avatar}</span>
                    <div>
                      <span className="font-black text-xs text-amber-950 flex items-center gap-1">
                        {p.name} {p.isSelf && "(You)"}
                      </span>
                      <span className="text-[10px] font-bold text-amber-800">
                        {p.escaped
                          ? "🎉 ESCAPED!"
                          : `In Sector ${p.stage}/3`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1 font-black text-amber-950 text-xs">
                        <CartoonCoin size={15} />
                        <span>{p.score.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                        <ShieldCheck size={11} />
                        <span>{p.hallucinationsCaught} caught</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            globalLeaderboard.map((entry, idx) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-2.5 rounded-2xl border-2 bg-white/80 border-amber-200"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-xs text-amber-900 w-4 text-center">
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                  </span>
                  <span className="text-xl">{entry.avatar}</span>
                  <div>
                    <span className="font-black text-xs text-amber-950">{entry.name}</span>
                    <span className="text-[10px] font-bold text-amber-700 block">
                      {entry.date}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 font-black text-amber-950 text-xs">
                    <CartoonCoin size={15} />
                    <span>{entry.score.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-sky-700">
                    <Clock size={11} />
                    <span>{entry.timeRemainingSec}s left</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-2 border-t-2 border-amber-200 text-center">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="btn-cartoon-green px-6 py-2 rounded-xl text-xs font-black uppercase cursor-pointer"
          >
            Back to Investigation
          </button>
        </div>
      </div>
    </div>
  );
}
