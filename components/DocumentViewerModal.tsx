"use client";

import React from "react";
import { SchoolFile } from "@/game/roomFilesData";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Calendar,
  User,
  HardDrive,
  Bookmark,
  Info,
} from "lucide-react";
import { sounds } from "@/lib/soundFX";

interface DocumentViewerModalProps {
  file: SchoolFile;
  isAlreadyVerified: boolean;
  verdictStatus?: "verified_true" | "flagged_hallucination" | "irrelevant" | "unverified";
  isPinned: boolean;
  onTogglePin: (file: SchoolFile) => void;
  onClose: () => void;
}

export function DocumentViewerModal({
  file,
  isAlreadyVerified,
  verdictStatus,
  isPinned,
  onTogglePin,
  onClose,
}: DocumentViewerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0b1324] rounded-3xl border-4 border-slate-700 p-5 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col justify-between overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-500 hover:bg-red-400 border-2 border-red-700 text-white flex items-center justify-center shadow-lg cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Document Header */}
        <div className="border-b-2 border-slate-800 pb-3 mb-3 pr-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {file.name}
              </span>
              <span className="text-xs text-slate-400 font-mono">({file.size})</span>
            </div>

            {/* SAVE TO INVESTIGATION BOARD BUTTON (Only option allowed in room files) */}
            <button
              onClick={() => {
                sounds.playStamp();
                onTogglePin(file);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-black uppercase flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md ${
                isPinned
                  ? "bg-amber-400 border-amber-500 text-slate-950 font-black shadow-amber-500/30"
                  : "bg-slate-800 hover:bg-slate-700 border-slate-600 text-amber-300"
              }`}
            >
              <Bookmark size={14} className={isPinned ? "fill-slate-950" : ""} />
              <span>{isPinned ? "📌 Saved to Case Board" : "📌 Save to Case Board"}</span>
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-black text-white leading-snug">
            {file.title}
          </h2>

          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <User size={12} className="text-slate-500 shrink-0" />
              <span className="truncate">{file.author}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Calendar size={12} className="text-slate-500 shrink-0" />
              <span>{file.timestamp}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <HardDrive size={12} className="text-slate-500 shrink-0" />
              <span className="truncate">{file.sourceDevice}</span>
            </div>
          </div>
        </div>

        {/* Document Content View Area */}
        <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs text-slate-200 leading-relaxed overflow-y-auto whitespace-pre-wrap select-text mb-3 shadow-inner">
          {file.content}
        </div>

        {/* Bottom Status / Evaluation Notice */}
        <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 flex items-center justify-between gap-3">
          {isAlreadyVerified || (verdictStatus && verdictStatus !== "unverified") ? (
            <div className="flex items-center gap-2 text-xs font-bold">
              {verdictStatus === "verified_true" ? (
                <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> Evaluated: Authentic Fact Verified
                </span>
              ) : verdictStatus === "flagged_hallucination" ? (
                <span className="px-3 py-1 rounded-xl bg-rose-950 text-rose-300 border border-rose-600 flex items-center gap-1.5">
                  <AlertTriangle size={15} /> Evaluated: AI Hallucination Exposed
                </span>
              ) : (
                <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-600 flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> Evaluated: Irrelevant Paperwork
                </span>
              )}
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                (Logged on Shared Investigation Board)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Info size={16} className="text-cyan-400 shrink-0" />
              <span>
                To evaluate this record, click <strong>&ldquo;📌 Save to Case Board&rdquo;</strong> and open your <strong>Case Board [Tab]</strong>.
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white cursor-pointer shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
