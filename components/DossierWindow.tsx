"use client";

import React, { useState } from "react";
import { CaseData, SourceDocument } from "@/data/casesData";
import {
  ByteRobot,
  RibbonBanner,
  TopSecretStamp,
  ScotchTape,
  CartoonGem,
} from "./CartoonCharacters";
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  KeyRound,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { sounds } from "@/lib/soundFX";

interface DossierWindowProps {
  currentCase: CaseData;
  tokens: number;
  hallucinationBusted: boolean;
  onSpendTokens: (amount: number) => boolean;
  onBustHallucination: () => void;
  onSubmitLockCode: (code: string) => void;
  onResetCase: () => void;
}

export function DossierWindow({
  currentCase,
  tokens,
  hallucinationBusted,
  onSpendTokens,
  onBustHallucination,
  onSubmitLockCode,
  onResetCase,
}: DossierWindowProps) {
  const [activeTab, setActiveTab] = useState<"ai" | "evidence" | "lock">("ai");
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [enteredCode, setEnteredCode] = useState<string>("");
  const [aiExpanded, setAiExpanded] = useState<boolean>(true);
  const [verificationFeedback, setVerificationFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleKeypadPress = (digit: string) => {
    if (enteredCode.length < 4) {
      sounds.playClick();
      setEnteredCode((prev) => prev + digit);
    }
  };

  const handleKeypadBackspace = () => {
    sounds.playClick();
    setEnteredCode((prev) => prev.slice(0, -1));
  };

  const handleVerifySource = (source: SourceDocument) => {
    sounds.playStamp();
    setSelectedSourceId(source.id);

    if (source.isDebunkSource) {
      sounds.playBusted();
      setVerificationFeedback({
        type: "success",
        message: `BINGO! ${currentCase.debunkExplanation}`,
      });
      onBustHallucination();
    } else {
      sounds.playError();
      setVerificationFeedback({
        type: "error",
        message:
          "This document is accurate, but it doesn't directly contradict the AI's fake claim. Keep investigating!",
      });
    }
  };

  const handleAskForExtraHint = () => {
    if (tokens < 10) {
      sounds.playError();
      setVerificationFeedback({
        type: "error",
        message: "Not enough Compute Tokens! Catch hallucinations to earn more.",
      });
      return;
    }
    const success = onSpendTokens(10);
    if (success) {
      sounds.playCoin();
      setVerificationFeedback({
        type: "success",
        message: `💡 Clue: "${currentCase.clueHint}"`,
      });
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto my-3 px-2 sm:px-4">
      {/* Visual Airmail Border Elements peeking behind folder (Reference Image 2) */}
      <div className="absolute -top-3 -right-2 w-28 h-20 rounded-lg airmail-stripes -rotate-6 opacity-80 pointer-events-none shadow-md hidden sm:block" />
      <div className="absolute -bottom-3 -left-2 w-32 h-14 rounded-lg airmail-stripes rotate-3 opacity-75 pointer-events-none shadow-md hidden sm:block" />

      {/* Top Secret Stamp (Reference Image 1) */}
      <div className="absolute -top-6 right-8 z-30 pointer-events-none">
        <TopSecretStamp />
      </div>

      {/* Top Folder Tabs (Image 2 design: Quests/Journal/Items style) */}
      <div className="flex items-end gap-1.5 px-4 z-10 relative">
        {/* Tab 1: AI Assistant */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab("ai");
          }}
          className={`relative px-4 sm:px-6 py-2 rounded-t-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "ai"
              ? "bg-[#fed7aa] text-amber-950 border-t-4 border-x-4 border-amber-800 -mb-[2px] pb-3 shadow-md z-20"
              : "bg-amber-600/90 text-amber-100 hover:bg-amber-500 border-t-2 border-x-2 border-amber-800 opacity-90"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span>🤖 AI CHAT</span>
            {!hallucinationBusted && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
            )}
          </div>
        </button>

        {/* Tab 2: Evidence Archive */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab("evidence");
          }}
          className={`relative px-4 sm:px-6 py-2 rounded-t-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "evidence"
              ? "bg-[#bbf7d0] text-emerald-950 border-t-4 border-x-4 border-emerald-800 -mb-[2px] pb-3 shadow-md z-20"
              : "bg-emerald-700/90 text-emerald-100 hover:bg-emerald-600 border-t-2 border-x-2 border-emerald-900 opacity-90"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Search size={15} />
            <span>SOURCES</span>
          </div>
        </button>

        {/* Tab 3: Keypad Lock */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab("lock");
          }}
          className={`relative px-4 sm:px-6 py-2 rounded-t-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "lock"
              ? "bg-[#bae6fd] text-sky-950 border-t-4 border-x-4 border-sky-800 -mb-[2px] pb-3 shadow-md z-20"
              : "bg-sky-700/90 text-sky-100 hover:bg-sky-600 border-t-2 border-x-2 border-sky-900 opacity-90"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <KeyRound size={15} />
            <span>ESCAPE LOCK</span>
          </div>
        </button>

        {/* Reset / Clear Button on far right */}
        <div className="ml-auto flex items-center gap-2 pb-1">
          <button
            onClick={() => {
              sounds.playClick();
              onResetCase();
            }}
            title="Reset current room notes"
            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-400 border-2 border-red-700 text-white flex items-center justify-center shadow-md active:translate-y-0.5"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Main Folder Body (Cream paper notebook styling like Image 2) */}
      <div className="relative bg-[#fffdf0] rounded-3xl border-4 border-amber-950 p-4 sm:p-6 folder-shadow z-10 min-h-[460px] flex flex-col justify-between">
        {/* Ribbon Banner Chapter Title */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-amber-200 pb-3">
          <RibbonBanner text={currentCase.chapter} color="orange" />
          <span className="text-xs font-bold text-amber-900/80 italic">
            📍 {currentCase.location}
          </span>
        </div>

        {/* Feedback Alert Bar */}
        {verificationFeedback.type && (
          <div
            className={`mt-3 p-3 rounded-2xl border-2 flex items-start gap-2.5 text-xs font-bold animate-in fade-in duration-200 ${
              verificationFeedback.type === "success"
                ? "bg-emerald-100 border-emerald-500 text-emerald-900"
                : "bg-red-100 border-red-500 text-red-900"
            }`}
          >
            {verificationFeedback.type === "success" ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
            )}
            <p className="leading-snug">{verificationFeedback.message}</p>
          </div>
        )}

        {/* ================= TAB 1: AI ASSISTANT (BYTE) ================= */}
        {activeTab === "ai" && (
          <div className="mt-4 flex-1 flex flex-col justify-between gap-4">
            <div className="bg-amber-100/70 border-3 border-amber-300 rounded-2xl p-4 shadow-inner">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 shrink-0">
                  <ByteRobot glitching={!hallucinationBusted} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-amber-950 uppercase tracking-wider">
                      {currentCase.aiSpeaker}
                    </span>
                    {!hallucinationBusted ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
                        ⚡ Generating response...
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck size={12} /> Hallucination Exposed!
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-200">
                    &ldquo;{currentCase.aiStatement}&rdquo;
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <div className="bg-red-50 border border-red-300 text-red-800 text-xs px-2.5 py-1 rounded-lg font-bold">
                      Byte&apos;s Suggested Override:{" "}
                      <span className="font-mono text-sm underline decoration-wavy font-black">
                        {currentCase.aiSuggestedCode}
                      </span>
                    </div>
                    {!hallucinationBusted && (
                      <span className="text-[11px] text-amber-800 font-bold italic">
                        (Be careful! Byte may be hallucinating facts!)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons for AI Tab */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleAskForExtraHint}
                className="btn-cartoon-blue px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <CartoonGem size={18} />
                <span>Ask Byte For Clue (-10 Tokens)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab("evidence");
                }}
                className="btn-cartoon-green px-5 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <Search size={16} />
                <span>Cross-Check Primary Sources</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: EVIDENCE ARCHIVE ================= */}
        {activeTab === "evidence" && (
          <div className="mt-4 flex-1 flex flex-col md:flex-row gap-4">
            {/* Left: Polaroid Snapshot (Reference Image 2) */}
            <div className="w-full md:w-56 flex flex-col items-center">
              <div className="relative bg-white p-2.5 pb-5 rounded-lg border border-slate-300 shadow-md rotate-[-2deg] w-48 sm:w-52">
                <ScotchTape className="absolute -top-3 left-1/2 -translate-x-1/2" />
                <div className="w-full h-32 bg-amber-950/10 rounded border border-slate-200 flex flex-col items-center justify-center p-2 text-center overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center mb-1 text-2xl shadow-inner">
                    {currentCase.polaroidTheme === "library"
                      ? "📜"
                      : currentCase.polaroidTheme === "lab"
                      ? "🔬"
                      : "🗝️"}
                  </div>
                  <span className="text-[10px] font-bold text-amber-900 leading-tight">
                    {currentCase.polaroidCaption}
                  </span>
                </div>
                <p className="mt-2 text-[10px] text-center font-bold text-slate-600 uppercase tracking-wider">
                  ARCHIVE PHOTO #0{currentCase.id}
                </p>
              </div>

              <div className="mt-3 text-center">
                <span className="text-[11px] font-extrabold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-full">
                  3 Primary Records Available
                </span>
              </div>
            </div>

            {/* Right: Primary Source Records */}
            <div className="flex-1 space-y-2.5">
              {currentCase.sources.map((src, idx) => (
                <div
                  key={src.id}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedSourceId === src.id
                      ? "bg-amber-100/90 border-amber-600 shadow-md"
                      : "bg-white/80 hover:bg-amber-50 border-amber-200"
                  }`}
                  onClick={() => handleVerifySource(src)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                      <FileText size={14} className="text-amber-700" />
                      {src.title}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
                      Record #{idx + 1}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-medium">
                    &ldquo;{src.snippet}&rdquo;
                  </p>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerifySource(src);
                      }}
                      className="text-[11px] font-black text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-lg border border-emerald-400 flex items-center gap-1 transition"
                    >
                      <Sparkles size={12} />
                      Cite As Fact-Check Proof
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: ESCAPE LOCKPAD ================= */}
        {activeTab === "lock" && (
          <div className="mt-4 flex-1 flex flex-col md:flex-row items-center justify-around gap-6">
            {/* Lock Display & Status */}
            <div className="w-full md:w-1/2 space-y-3 text-center md:text-left">
              <h3 className="text-lg font-black text-amber-950">
                Door Override Keypad
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Enter the verified 4-digit code to breach the lockdown.
                <br />
                <span className="text-red-700 font-bold">
                  ⚠️ Entering a hallucinated code triggers security lockdown (-45s penalty)!
                </span>
              </p>

              {hallucinationBusted ? (
                <div className="p-3 bg-emerald-100 border-2 border-emerald-500 rounded-2xl text-emerald-950 text-xs font-bold">
                  ✅ Hallucination debunked! Use the verified fact date from the archival records.
                </div>
              ) : (
                <div className="p-3 bg-amber-100 border-2 border-amber-400 rounded-2xl text-amber-900 text-xs font-semibold">
                  🔍 Check the sources tab first to confirm whether Byte&apos;s code is genuine or a hallucination.
                </div>
              )}
            </div>

            {/* Tactile Keypad */}
            <div className="w-64 bg-slate-900 p-4 rounded-3xl border-4 border-slate-700 shadow-2xl flex flex-col items-center">
              {/* Digit Screen */}
              <div className="w-full bg-slate-950 border-2 border-emerald-500/80 rounded-xl py-2 px-3 text-center mb-3">
                <span className="font-mono text-2xl tracking-[0.4em] font-black text-emerald-400">
                  {enteredCode.padEnd(4, "-")}
                </span>
              </div>

              {/* Number Grid */}
              <div className="grid grid-cols-3 gap-2 w-full">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeypadPress(num)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-black text-lg border-b-3 border-slate-950 active:translate-y-0.5 active:border-b-0 transition cursor-pointer"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={handleKeypadBackspace}
                  className="py-2.5 rounded-xl bg-red-900/80 hover:bg-red-800 text-red-200 font-bold text-xs flex items-center justify-center border-b-3 border-red-950 active:translate-y-0.5 transition"
                >
                  DEL
                </button>
                <button
                  onClick={() => handleKeypadPress("0")}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-black text-lg border-b-3 border-slate-950 active:translate-y-0.5 active:border-b-0 transition cursor-pointer"
                >
                  0
                </button>
                <button
                  onClick={() => {
                    if (enteredCode.length === 4) {
                      onSubmitLockCode(enteredCode);
                    } else {
                      sounds.playError();
                    }
                  }}
                  disabled={enteredCode.length !== 4}
                  className="btn-cartoon-green py-2.5 rounded-xl font-black text-xs uppercase flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Folder Footer Ribbons */}
        <div className="mt-4 pt-3 border-t-2 border-amber-200/80 flex items-center justify-between text-[11px] font-bold text-amber-900/70">
          <span>CASE PROTOCOL: CRITICAL-THINKING ESCAPE</span>
          <span>STAGE {currentCase.id} / 3</span>
        </div>
      </div>
    </div>
  );
}
