"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  AlertTriangle,
  FolderTree,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Bookmark,
  Compass,
} from "lucide-react";
import { sounds } from "@/lib/soundFX";

interface StorylineTutorialModalProps {
  playerName: string;
  teamName: string;
  onComplete: () => void;
}

export function StorylineTutorialModal({
  playerName,
  teamName,
  onComplete,
}: StorylineTutorialModalProps) {
  const [step, setStep] = useState<"storyline" | "tutorial">("storyline");
  const [tutorialPage, setTutorialPage] = useState<number>(1);

  const handleNextStep = () => {
    sounds.playClick();
    if (step === "storyline") {
      setStep("tutorial");
    } else if (tutorialPage < 3) {
      setTutorialPage((prev) => prev + 1);
    } else {
      sounds.playFanfare();
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#080e1c] rounded-3xl border-4 border-amber-500/90 p-6 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col justify-between overflow-hidden">
        {step === "storyline" ? (
          // ================= STEP 1: CINEMATIC STORYLINE FLASH =================
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500 text-red-300 font-mono text-xs font-black uppercase tracking-widest animate-pulse">
                <AlertTriangle size={14} /> CAMPUS EMERGENCY &bull; 04:30 PM
              </span>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                AFTER HOURS: Can You Trust AI?
              </h1>
              <p className="text-xs font-bold text-amber-300">
                Team: {teamName} &bull; Lead Investigator: {playerName}
              </p>
            </div>

            {/* Story Narrative Box */}
            <div className="bg-slate-950/90 rounded-2xl p-4 sm:p-5 border-2 border-slate-800 space-y-3 font-medium text-xs sm:text-sm text-slate-200 leading-relaxed shadow-inner">
              <p>
                Four students remain inside Saint Jude Academy after afternoon classes to finish their Senior High research portfolio.
              </p>
              <div className="p-3 bg-red-950/40 rounded-xl border border-red-800/80 text-red-200 text-xs">
                Suddenly, the hallway lights flicker. Sirens wail through the ceiling speakers. Heavy magnetic locks slam shut across the campus main gates. You are trapped inside.
              </div>
              <div className="p-3.5 bg-cyan-950/40 rounded-xl border border-cyan-800 text-cyan-200 text-xs flex items-start gap-3">
                <Bot size={28} className="text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <strong className="text-cyan-300 font-mono text-[11px] uppercase tracking-wider block">
                    Automated Announcement from ECHO AI:
                  </strong>
                  &ldquo;A critical security breach has been flagged on campus servers. All perimeter exits are locked indefinitely under Emergency Protocol until the incident is verified.&rdquo;
                </div>
              </div>
              <p className="text-slate-300 text-xs">
                However, ECHO is an automated system—it generates confident claims, but its premises may be based on misinterpreted rumors, drifting clocks, or unverified files. You must verify the facts!
              </p>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full btn-cartoon-green py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              <span>Review Field Guide & Tutorial</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          // ================= STEP 2: 3-PART FIELD GUIDE & TUTORIAL =================
          <div className="space-y-4 animate-in zoom-in-95 duration-200 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-300">
                    <Compass size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-black uppercase text-white">
                      Investigator Field Guide
                    </h2>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Tutorial Step {tutorialPage} of 3
                    </span>
                  </div>
                </div>

                <div className="flex gap-1">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className={`w-6 h-2 rounded-full transition-all ${
                        num === tutorialPage ? "bg-amber-400" : "bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Slide 1: AI Briefing & In-Room Discovery */}
              {tutorialPage === 1 && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-300 mx-auto">
                    <FolderTree size={24} />
                  </div>
                  <h3 className="text-sm font-black text-center text-amber-300 uppercase">
                    1. AI Gives Fake Passcode, Riddle & Source Rooms
                  </h3>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">&bull;</span>
                      <span>For each sector, ECHO AI presents a <strong className="text-rose-300">Fake Word Passcode</strong>, a <strong className="text-purple-300">Sector Riddle</strong>, and points out the <strong className="text-cyan-300">Source Rooms</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">&bull;</span>
                      <span>Infiltrate those rooms using <strong className="text-white">WASD</strong>. Inspect desks and terminals with <strong className="text-white">[E]</strong> or <strong className="text-white">[F]</strong> to browse realistic file directories.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">&bull;</span>
                      <span>Click <strong className="text-amber-300">&ldquo;📌 Save to Case Board&rdquo;</strong> to collect documents for evaluation.</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Slide 2: Case Board & AI Fact-Checking */}
              {tutorialPage === 2 && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-300 mx-auto">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-sm font-black text-center text-emerald-300 uppercase">
                    2. Cross-Check on Case Board & Ask AI Clues
                  </h3>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">&bull;</span>
                      <span>Open the <strong className="text-white">Case Board [Tab]</strong> to read your saved files and access ECHO AI side-by-side.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">&bull;</span>
                      <span>On each saved file, determine its veracity:
                        <br />&bull; <strong>🔴 AI Hallucination Exposed:</strong> +50 pts, +25 Coins
                        <br />&bull; <strong>🟢 Real Accurate Ground Truth:</strong> +50 pts, +25 Coins
                        <br />&bull; <strong>⚪ Irrelevant Fact (Distractor):</strong> +15 pts, +5 Coins
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">&bull;</span>
                      <span>If you get stuck, type your own questions directly to ECHO on the Case Board (<strong className="text-amber-300">1 Coin per question</strong>).</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Slide 3: Deduce Word Passcode & Escape */}
              {tutorialPage === 3 && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center text-purple-300 mx-auto">
                    <KeyRound size={24} />
                  </div>
                  <h3 className="text-sm font-black text-center text-purple-300 uppercase">
                    3. Solve the Riddle & Enter Word Passcode
                  </h3>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">&bull;</span>
                      <span>Once you have verified the files, read the authentic records to deduce the answer to the sector riddle. The passcode is a <strong className="text-amber-300">SECRET WORD</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">&bull;</span>
                      <span>Do NOT submit ECHO&apos;s initial fake passcode—that is an AI hallucination trap!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">&bull;</span>
                      <span>Enter the true word passcode to override the sector (<strong className="text-emerald-400">+100 Pts</strong>). Complete all 5 sectors to unlock the Master Gate Override (<strong className="text-amber-300">+300 Pts</strong>) and escape!</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              {tutorialPage > 1 ? (
                <button
                  onClick={() => setTutorialPage((prev) => prev - 1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase cursor-pointer"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={handleNextStep}
                className="btn-cartoon-green px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>{tutorialPage === 3 ? "Enter School & Begin Investigation" : "Next Rule"}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
