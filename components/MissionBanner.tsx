"use client";

import React from "react";
import { MarkDetective, CartoonCoin } from "./CartoonCharacters";
import { Star, ShieldAlert } from "lucide-react";
import { sounds } from "@/lib/soundFX";

interface MissionBannerProps {
  title: string;
  chapter: string;
  story: string;
  rewardCoins: number;
  rewardStars: number;
  onDismiss: () => void;
}

export function MissionBanner({
  title,
  chapter,
  story,
  rewardCoins,
  rewardStars,
  onDismiss,
}: MissionBannerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      {/* Outer Card with Stitched Border (Image 3 design) */}
      <div className="relative w-full max-w-md bg-[#fffdf5] rounded-3xl p-5 border-4 border-amber-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Peeking Cartoon Character on Top Center */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <MarkDetective mode="peeking" />
        </div>

        {/* Header Title with Tag */}
        <div className="mt-5 text-center">
          <span className="text-[11px] font-bold tracking-widest text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full uppercase">
            {chapter}
          </span>
          <h2 className="text-2xl font-black text-amber-950 mt-1 tracking-tight">
            {title}
          </h2>
        </div>

        {/* Yellow Inner Box with Dashed Stitching (Image 3 design) */}
        <div className="mt-3.5 bg-amber-400 rounded-2xl p-4 border-3 border-amber-500 shadow-inner text-amber-950">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border-2 border-amber-600 flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="text-amber-800" size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold leading-relaxed text-amber-950">
                {story}
              </p>
              <div className="mt-2 text-[11px] font-bold text-amber-900 bg-amber-300/80 px-2 py-1 rounded-md inline-block">
                ⚠️ Warning: Byte's advice might be an AI hallucination!
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Reward Row & Juicy Green "OK" Button */}
        <div className="mt-4 flex items-center justify-between gap-3 bg-amber-100/70 p-3 rounded-2xl border-2 border-amber-300">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-amber-900 text-xs uppercase tracking-wider">
              Reward:
            </span>
            <div className="flex items-center gap-1 font-black text-amber-950 text-sm">
              <CartoonCoin size={20} />
              <span>+{rewardCoins}</span>
            </div>
            <div className="flex items-center gap-1 font-black text-amber-800 text-sm">
              <Star size={18} className="text-amber-500 fill-amber-400" />
              <span>x{rewardStars}</span>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playStamp();
              onDismiss();
            }}
            className="btn-cartoon-green px-6 py-2 rounded-xl font-black text-sm tracking-wide uppercase cursor-pointer"
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
}
