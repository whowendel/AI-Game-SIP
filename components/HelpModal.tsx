"use client";

import React from "react";
import { X, Search, AlertTriangle, ShieldCheck } from "lucide-react";
import { MarkDetective } from "./CartoonCharacters";
import { sounds } from "@/lib/soundFX";

export function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#fffdf0] rounded-3xl border-4 border-amber-950 p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-red-500 hover:bg-red-400 border-2 border-red-700 text-white flex items-center justify-center shadow-lg cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 border-b-2 border-amber-200 pb-3 mb-4">
          <MarkDetective mode="avatar" className="w-14 h-14 shrink-0" />
          <div>
            <h2 className="text-xl font-black text-amber-950 uppercase tracking-tight">
              Detective Field Guide
            </h2>
            <p className="text-xs font-bold text-amber-800">
              How to avoid AI traps and escape in time
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-amber-100/80 p-3 rounded-2xl border-2 border-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="text-amber-700 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-xs font-black text-amber-950 uppercase">
                1. Beware of Confident AI
              </h4>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium mt-0.5">
                Byte the AI will give rapid answers that sound 100% convincing, but often contain phantom authors, fake DOIs, or inverted dates!
              </p>
            </div>
          </div>

          <div className="bg-emerald-100/80 p-3 rounded-2xl border-2 border-emerald-300 flex items-start gap-2.5">
            <Search className="text-emerald-700 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-xs font-black text-emerald-950 uppercase">
                2. Cross-Check Primary Sources
              </h4>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium mt-0.5">
                Always switch to the <strong>SOURCES</strong> tab. Cite the historical letter or lab manual that disproves the hallucination to earn bonus tokens!
              </p>
            </div>
          </div>

          <div className="bg-sky-100/80 p-3 rounded-2xl border-2 border-sky-300 flex items-start gap-2.5">
            <ShieldCheck className="text-sky-700 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-xs font-black text-sky-950 uppercase">
                3. High Stakes Door Locks
              </h4>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium mt-0.5">
                Entering Byte&apos;s hallucinated code into the door will trigger a security lockdown penalty (-45s). Find the genuine code from the verified records!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="btn-cartoon-green px-8 py-2.5 rounded-2xl font-black text-xs uppercase cursor-pointer"
          >
            Understood, Detective!
          </button>
        </div>
      </div>
    </div>
  );
}
