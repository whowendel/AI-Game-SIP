"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Trophy, Clock, ShieldCheck, AlertCircle, RotateCcw } from "lucide-react";
import { CartoonCoin, MarkDetective } from "./CartoonCharacters";
import { sounds } from "@/lib/soundFX";

interface EscapeVictoryModalProps {
  won: boolean;
  score: number;
  timeRemainingSec: number;
  hallucinationsCaught: number;
  penalties: number;
  onPlayAgain: () => void;
  onOpenLeaderboard: () => void;
}

export function EscapeVictoryModal({
  won,
  score,
  timeRemainingSec,
  hallucinationsCaught,
  penalties,
  onPlayAgain,
  onOpenLeaderboard,
}: EscapeVictoryModalProps) {
  useEffect(() => {
    if (won) {
      sounds.playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      sounds.playError();
    }
  }, [won]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#fffdf2] rounded-3xl border-4 border-amber-950 p-6 shadow-2xl text-center animate-in zoom-in-95 duration-200">
        {/* Peeking character on top */}
        <div className="flex justify-center -mt-3 mb-2">
          <MarkDetective mode="avatar" className="w-20 h-20" />
        </div>

        <h2 className="text-2xl font-black text-amber-950 uppercase tracking-tight">
          {won ? "🎉 LOCKDOWN BREACHED!" : "⚠️ MISSION TIMED OUT"}
        </h2>
        <p className="text-xs font-bold text-amber-800 mt-1">
          {won
            ? "You successfully escaped without falling for AI hallucinations!"
            : "The laboratory locked down permanently. Practice your fact-checking and try again!"}
        </p>

        {/* Score Breakdown Card */}
        <div className="mt-4 bg-amber-100/90 rounded-2xl p-4 border-3 border-amber-300 space-y-2 text-left">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-sky-600" /> Time Remaining Bonus:
            </span>
            <span className="font-mono text-amber-950 font-black">
              +{timeRemainingSec * 10} pts
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" /> Hallucinations Busted:
            </span>
            <span className="font-mono text-emerald-800 font-black">
              {hallucinationsCaught} / 3 (+{hallucinationsCaught * 150})
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <AlertCircle size={14} className="text-red-600" /> Lockout Penalties:
            </span>
            <span className="font-mono text-red-800 font-black">
              -{penalties * 100} pts
            </span>
          </div>

          <div className="pt-2 border-t-2 border-amber-300 flex items-center justify-between">
            <span className="text-sm font-black text-amber-950 uppercase">
              Final Score:
            </span>
            <div className="flex items-center gap-1.5 text-lg font-black text-amber-950">
              <CartoonCoin size={22} />
              <span>{Math.max(0, score).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex gap-2.5">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenLeaderboard();
            }}
            className="flex-1 btn-cartoon-blue py-3 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trophy size={16} />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onPlayAgain();
            }}
            className="flex-1 btn-cartoon-green py-3 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
