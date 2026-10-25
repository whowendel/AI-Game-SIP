"use client";

import React, { useState } from "react";
import { X, KeyRound, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";
import { sounds } from "@/lib/soundFX";

interface KeypadModalProps {
  activeCaseId: number;
  echoFakePasscode: string;
  truePasscode: string;
  riddle?: string;
  onCodeSuccess: () => void;
  onCodeFailure: () => void;
  onClose: () => void;
}

export function KeypadModal({
  activeCaseId,
  echoFakePasscode,
  truePasscode,
  riddle,
  onCodeSuccess,
  onCodeFailure,
  onClose,
}: KeypadModalProps) {
  const [wordInput, setWordInput] = useState<string>("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleKeyPress = (char: string) => {
    if (wordInput.length < 12) {
      sounds.playClick();
      setWordInput((prev) => prev + char);
    }
  };

  const handleBackspace = () => {
    sounds.playClick();
    setWordInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    sounds.playClick();
    setWordInput("");
    setFeedback({ type: null, message: "" });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = wordInput.trim().toUpperCase();

    if (!clean) {
      sounds.playError();
      return;
    }

    if (clean === echoFakePasscode.toUpperCase()) {
      sounds.playBusted();
      sounds.playError();
      onCodeFailure();
      setFeedback({
        type: "error",
        message: `🚨 AI TRAP! "${clean}" was ECHO's hallucinated passcode! Do not trust unverified AI outputs (-25 Pts).`,
      });
      setWordInput("");
    } else if (clean === truePasscode.toUpperCase()) {
      sounds.playFanfare();
      onCodeSuccess();
      onClose();
    } else {
      sounds.playError();
      setFeedback({
        type: "error",
        message: `❌ Passcode "${clean}" is incorrect! Re-read your verified records to solve the riddle.`,
      });
      setWordInput("");
    }
  };

  // Quick virtual keyboard for touch/mouse or physical typing
  const KEYBOARD_ROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0a1120] rounded-3xl border-4 border-slate-700 p-5 shadow-2xl text-slate-100 animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-red-500 hover:bg-red-400 border-2 border-red-700 text-white flex items-center justify-center shadow-lg cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-3">
          <div className="w-10 h-10 mx-auto rounded-xl bg-purple-950 border-2 border-purple-400 flex items-center justify-center shadow-md mb-1 text-purple-300">
            <KeyRound size={20} />
          </div>
          <h3 className="text-base font-black uppercase text-white tracking-wide">
            Sector #{activeCaseId} Override Terminal
          </h3>
          <p className="text-xs text-slate-400">
            Enter the secret word passcode deduced from your verified files.
          </p>
        </div>

        {riddle && (
          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 mb-3 text-center">
            <span className="text-[10px] font-black uppercase text-purple-300 flex items-center justify-center gap-1 mb-0.5">
              <Sparkles size={11} /> Sector Riddle
            </span>
            <p className="text-xs italic text-purple-100 leading-snug">
              &ldquo;{riddle}&rdquo;
            </p>
          </div>
        )}

        {/* Display */}
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="bg-slate-950 border-2 border-amber-500/80 rounded-2xl p-2.5 flex items-center justify-between mb-2">
            <input
              type="text"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value.toUpperCase())}
              placeholder="TYPE PASSCODE..."
              className="bg-transparent w-full text-center font-mono text-xl font-black tracking-widest text-amber-300 uppercase focus:outline-none placeholder:text-slate-700"
            />
            {wordInput && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-500 hover:text-slate-300 font-bold px-1"
              >
                CLEAR
              </button>
            )}
          </div>

          {feedback.message && (
            <div
              className={`p-2 rounded-xl text-xs font-bold text-center mb-2 animate-in fade-in ${
                feedback.type === "error"
                  ? "bg-rose-950/80 border border-rose-600 text-rose-200"
                  : "bg-emerald-950/80 border border-emerald-600 text-emerald-200"
              }`}
            >
              {feedback.message}
            </div>
          )}
        </form>

        {/* Virtual Keyboard */}
        <div className="space-y-1.5 mb-3 select-none">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1">
              {row.map((char) => (
                <button
                  key={char}
                  onClick={() => handleKeyPress(char)}
                  className="w-8 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-amber-600 border border-slate-700 text-xs font-mono font-bold text-white transition cursor-pointer shadow flex items-center justify-center"
                >
                  {char}
                </button>
              ))}
            </div>
          ))}
          <div className="flex justify-center gap-2 pt-1">
            <button
              onClick={handleBackspace}
              className="px-4 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
            >
              ⌫ DEL
            </button>
            <button
              onClick={() => handleSubmit()}
              className="px-6 h-9 rounded-lg btn-cartoon-green text-xs font-black uppercase cursor-pointer"
            >
              SUBMIT OVERRIDE
            </button>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500">
          ⚠️ Caution: Submitting ECHO&apos;s unverified fake passcode triggers an alert.
        </div>
      </div>
    </div>
  );
}
