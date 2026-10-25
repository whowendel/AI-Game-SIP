"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, AlertTriangle, Sparkles, Clock, ShieldCheck, ArrowRight, X, KeyRound, Award } from "lucide-react";
import { CartoonCoin } from "@/components/CartoonCharacters";
import { sounds } from "@/lib/soundFX";

export interface TimelineEvent {
  caseId: number;
  timeStr: string;
  order: number;
  title: string;
  verifiedFact: string;
}

const CHRONO_EVENTS: TimelineEvent[] = [
  {
    caseId: 2,
    timeStr: "02:48 PM",
    order: 1,
    title: "Server Storage Maintenance",
    verifiedFact: "Automated batch script safely archived exam draft into sector 2048 (No USB theft).",
  },
  {
    caseId: 3,
    timeStr: "03:30 PM",
    order: 2,
    title: "Track Practice Attendance",
    verifiedFact: "Student Alex Rivera signed into gym; lost keycard #5510 was swiped without him.",
  },
  {
    caseId: 1,
    timeStr: "03:45 PM",
    order: 3,
    title: "Official Council Broadcast",
    verifiedFact: "Student Council logged routine project reminders; no emergency notice authorized.",
  },
  {
    caseId: 4,
    timeStr: "04:05 PM",
    order: 4,
    title: "Clinic NTP Clock Sync",
    verifiedFact: "Student check-in at 04:05 PM proved canteen POS clock was drifting 25 mins fast.",
  },
  {
    caseId: 5,
    timeStr: "04:20 PM",
    order: 5,
    title: "Scheduled HVAC Maintenance",
    verifiedFact: "Authorized filter vacuuming under Ticket #4200 caused harmless dust blowback.",
  },
];

interface FinalOverrideModalProps {
  score: number;
  coins: number;
  timerSec: number;
  onEscapeSuccess: (finalScore: number) => void;
  onClose: () => void;
}

export function FinalOverrideModal({
  score,
  coins,
  timerSec,
  onEscapeSuccess,
  onClose,
}: FinalOverrideModalProps) {
  // Scrambled timeline event indices for the player to arrange
  const [selectedOrder, setSelectedOrder] = useState<number[]>([3, 1, 5, 2, 4]);
  const [selectedDeduction, setSelectedDeduction] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });
  const [escaped, setEscaped] = useState<boolean>(false);
  const [totalCalculatedScore, setTotalCalculatedScore] = useState<number>(0);

  const moveUp = (index: number) => {
    if (index === 0) return;
    sounds.playClick();
    const updated = [...selectedOrder];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setSelectedOrder(updated);
  };

  const moveDown = (index: number) => {
    if (index === selectedOrder.length - 1) return;
    sounds.playClick();
    const updated = [...selectedOrder];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setSelectedOrder(updated);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if timeline is ordered [1, 2, 3, 4, 5]
    const isTimelineCorrect = selectedOrder.every((val, idx) => val === idx + 1);

    if (!isTimelineCorrect) {
      sounds.playError();
      setFeedback({
        type: "error",
        message: "Timeline error! The 5 incidents are not in chronological order. Check the AM/PM timestamps.",
      });
      return;
    }

    if (selectedDeduction !== 2) {
      sounds.playError();
      setFeedback({
        type: "error",
        message: "Incorrect root cause diagnosis! Review what actually occurred across the 5 cases.",
      });
      return;
    }

    // Success! Calculate final score: Max 1,000 points
    sounds.playFanfare();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
    });

    const casesScore = 500;
    const finalEscapeScore = 300;
    const timeRemainingBonus = Math.floor(timerSec / 60) * 10;
    const coinsBonus = Math.min(100, Math.floor(coins * 1.5));
    const grandTotal = Math.min(1000, casesScore + finalEscapeScore + timeRemainingBonus + coinsBonus);

    setTotalCalculatedScore(grandTotal);
    setEscaped(true);
    onEscapeSuccess(grandTotal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#090f1d] rounded-3xl border-4 border-amber-500 p-6 shadow-2xl text-slate-100 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {!escaped && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-500 hover:bg-red-400 border-2 border-red-700 text-white flex items-center justify-center shadow-lg cursor-pointer"
          >
            <X size={18} />
          </button>
        )}

        {escaped ? (
          // ================= VICTORY SCREEN & FACT-CHECK CERTIFICATE =================
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400 border-3 border-amber-600 flex items-center justify-center shadow-xl text-amber-950">
              <Award size={36} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-amber-300 uppercase tracking-tight">
                CAMPUS LOCKDOWN OVERRIDDEN!
              </h2>
              <p className="text-xs text-emerald-300 font-bold mt-1">
                ECHO has verified your factual timeline and unlocked the main gates.
              </p>
            </div>

            {/* Score Breakdown Card */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border-2 border-slate-700 max-w-md mx-auto space-y-2 text-xs font-bold text-slate-300 text-left">
              <div className="flex items-center justify-between">
                <span>5 Sector Investigations:</span>
                <span className="font-mono text-emerald-400 font-black">+500 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Final Timeline Reconstruction:</span>
                <span className="font-mono text-emerald-400 font-black">+300 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Time Remaining Bonus ({Math.floor(timerSec / 60)} mins left):</span>
                <span className="font-mono text-cyan-400 font-black">+{Math.floor(timerSec / 60) * 10} pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Saved Coins Bonus ({coins} Coins):</span>
                <span className="font-mono text-amber-400 font-black">+{Math.min(100, Math.floor(coins * 1.5))} pts</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-base">
                <span className="font-black text-white uppercase">Grand Total Score:</span>
                <span className="font-mono text-xl font-black text-amber-400">
                  {totalCalculatedScore} / 1,000 PTS
                </span>
              </div>
            </div>

            {/* Educational Debrief Banner */}
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-600 rounded-2xl max-w-md mx-auto text-left text-xs text-emerald-100 font-medium leading-relaxed">
              <strong>Core Critical-Thinking Lesson:</strong>
              <p className="mt-1">
                AI systems like ECHO process data without human context. By independently evaluating source metadata, cross-referencing timestamps, and questioning assumptions, your team proved that critical human reasoning is essential before accepting AI conclusions.
              </p>
            </div>

            <button
              onClick={onClose}
              className="btn-cartoon-green px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer shadow-xl"
            >
              Exit Campus &bull; Complete Investigation
            </button>
          </div>
        ) : (
          // ================= RECONSTRUCTION PUZZLE =================
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div className="border-b border-amber-900/80 pb-3 pr-8">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                <Sparkles size={16} /> Final Mystery: The Lockdown Override
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight mt-0.5">
                Reconstruct the True Sequence of Events
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Arrange the 5 verified incidents chronologically to prove to ECHO what actually caused the lockdown.
              </p>
            </div>

            {feedback.message && (
              <div
                className={`p-3 rounded-xl border-2 flex items-center gap-2 text-xs font-bold ${
                  feedback.type === "error"
                    ? "bg-red-950/80 border-red-500 text-red-200"
                    : "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                }`}
              >
                <AlertTriangle size={16} className="shrink-0" />
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Drag & Move Chronological Timeline */}
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 block mb-1.5">
                Step 1: Order Events from Earliest to Latest (Use ▲ ▼):
              </span>
              <div className="space-y-1.5">
                {selectedOrder.map((orderNum, idx) => {
                  const ev = CHRONO_EVENTS.find((e) => e.order === orderNum)!;
                  return (
                    <div
                      key={ev.caseId}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-amber-400 bg-slate-950 px-2 py-0.5 rounded-md">
                          #{idx + 1}
                        </span>
                        <div>
                          <span className="font-mono font-bold text-xs text-emerald-400 mr-2">
                            {ev.timeStr}
                          </span>
                          <span className="font-bold text-xs text-white">
                            {ev.title}
                          </span>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            {ev.verifiedFact}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveUp(idx)}
                          disabled={idx === 0}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-[10px] font-bold"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDown(idx)}
                          disabled={idx === selectedOrder.length - 1}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-[10px] font-bold"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Root Cause Diagnosis Multiple Choice */}
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 block mb-1.5">
                Step 2: What Actually Caused the Security Lockdown?
              </span>
              <div className="space-y-2">
                {[
                  {
                    id: 1,
                    text: "An external cyber-sabotage group breached the school's server to steal exams.",
                  },
                  {
                    id: 2,
                    text: "A series of routine events (server backup, lost keycard, drifting POS clock, and air filter maintenance) were misinterpreted by AI as a coordinated attack.",
                  },
                  {
                    id: 3,
                    text: "Student Alex Rivera intentionally hacked the campus air conditioning and gates.",
                  },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedDeduction(opt.id);
                    }}
                    className={`p-3 rounded-xl border-2 transition cursor-pointer text-xs font-medium leading-snug flex items-center gap-2.5 ${
                      selectedDeduction === opt.id
                        ? "bg-purple-950/60 border-purple-400 text-purple-100 font-bold shadow-md"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedDeduction === opt.id ? "border-purple-400 bg-purple-600" : "border-slate-600"
                      }`}
                    >
                      {selectedDeduction === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span>{opt.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full btn-cartoon-green py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <KeyRound size={16} />
                <span>Submit Final Master Override to ECHO</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
