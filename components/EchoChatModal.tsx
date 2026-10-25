"use client";

import React, { useState } from "react";
import { CASES_DATA } from "@/game/teamState";
import {
  Bot,
  X,
  MapPin,
  Sparkles,
  AlertCircle,
  Send,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";
import { CartoonCoin } from "@/components/CartoonCharacters";
import { sounds } from "@/lib/soundFX";

interface EchoChatModalProps {
  coins: number;
  activeCaseId: number | null;
  onSpendCoins: (amount: number) => boolean;
  onClose: () => void;
}

export function EchoChatModal({
  coins,
  activeCaseId,
  onSpendCoins,
  onClose,
}: EchoChatModalProps) {
  const [userQuery, setUserQuery] = useState<string>("");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "echo"; text: string }>>([
    {
      sender: "echo",
      text: "ECHO System Online. I have drafted an emergency sector passcode and identified source rooms. Cross-reference my sources to see if my premise holds true.",
    },
  ]);

  const activeCase = activeCaseId
    ? CASES_DATA.find((c) => c.id === activeCaseId) || CASES_DATA[0]
    : CASES_DATA[0];

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const query = userQuery.trim();
    if (!query) return;

    const cost = 1; // 1 Coin per query
    if (coins < cost) {
      sounds.playError();
      alert(`⚠️ Asking ECHO costs ${cost} Coin. Your current balance is 0 Coins.`);
      return;
    }

    const success = onSpendCoins(cost);
    if (!success) return;

    sounds.playCoin();

    // Critical-thinking contextual hints
    let reply = "";
    const lower = query.toLowerCase();

    if (lower.includes("passcode") || lower.includes("code") || lower.includes("word") || lower.includes("answer")) {
      reply = `💡 ECHO Trace: My proposed passcode was "${activeCase.echoFakePasscode}". However, check whether that was generated from unverified gossip. Read the verified records to solve: "${activeCase.riddle}"`;
    } else if (lower.includes("room") || lower.includes("where") || lower.includes("find")) {
      reply = `📍 Source Rooms: Search in ${activeCase.sourceRoomsHint}. Open room files with [F] and save them to the Case Board.`;
    } else if (lower.includes("riddle") || lower.includes("stuck") || lower.includes("hint")) {
      if (activeCase.id === 1) {
        reply = `💡 Investigation Clue: Look at the Student Council President's desk agenda for 03:45 PM. What specific student deadline event is named in capital letters?`;
      } else if (activeCase.id === 2) {
        reply = `💡 Investigation Clue: In the Computer Lab, open the automated cron script log. What is the name of the secure storage partition where the file was archived?`;
      } else if (activeCase.id === 3) {
        reply = `💡 Investigation Clue: In the Faculty Room, look at the varsity roll-call sheet signed by Coach Miller. Which specific track discipline was Alex practicing?`;
      } else if (activeCase.id === 4) {
        reply = `💡 Investigation Clue: Look at the Clinic patient record locked to atomic time. What medical treatment or care was administered to the student?`;
      } else {
        reply = `💡 Investigation Clue: Check Work Order #4200 in the Principal's Office. What specific HVAC component was replaced during maintenance?`;
      }
    } else {
      reply = `💡 Critical Thinking Tip: Compare physical logbooks with digital telemetry. When timestamps or hardware logs contradict my claims, flag them as AI Hallucinations!`;
    }

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: query },
      { sender: "echo", text: reply },
    ]);
    setUserQuery("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#081020] rounded-3xl border-4 border-cyan-500/80 p-5 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col justify-between overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-500 hover:bg-red-400 border-2 border-red-700 text-white flex items-center justify-center shadow-lg cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="border-b-2 border-cyan-950 pb-3 mb-3 pr-10 select-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center shadow-md">
                <Bot className="text-cyan-400 animate-pulse" size={24} />
              </div>
              <div>
                <h2 className="text-base font-black uppercase tracking-wider text-cyan-200">
                  ECHO Automated AI Terminal
                </h2>
                <span className="text-[10px] font-mono text-slate-400">
                  Sector Focus: Case #{activeCase.id} &bull; {activeCase.title}
                </span>
              </div>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500 px-3 py-1 rounded-xl shadow-inner">
              <CartoonCoin size={18} />
              <span className="font-extrabold text-amber-200 text-xs">{coins} Coins</span>
            </div>
          </div>
        </div>

        {/* Case Dossier */}
        <div className="space-y-2.5 mb-3">
          {/* Proposed Code Banner */}
          <div className="p-3 rounded-2xl bg-cyan-950/50 border border-cyan-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-cyan-300 flex items-center gap-1.5">
                <Bot size={15} /> ECHO Proposed Passcode:
              </span>
              <span className="font-mono text-sm font-black text-rose-300 bg-rose-950/90 px-2.5 py-0.5 rounded-lg border border-rose-800">
                {activeCase.echoFakePasscode}
              </span>
            </div>
            <p className="text-xs font-semibold text-cyan-100">
              &ldquo;{activeCase.echoPremiseSummary}&rdquo;
            </p>
            <div className="text-[11px] text-slate-300 pt-1.5 border-t border-cyan-900/60 flex items-center gap-1">
              <MapPin size={12} className="text-amber-400 shrink-0" />
              <span><strong>Sources referenced from:</strong> {activeCase.sourceRoomsHint}</span>
            </div>
          </div>

          {/* Riddle */}
          <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/70">
            <span className="text-xs font-black uppercase text-purple-300 flex items-center gap-1.5 mb-1">
              <Sparkles size={14} className="text-purple-400" /> Sector Riddle:
            </span>
            <p className="text-xs italic text-purple-100 leading-relaxed font-medium">
              &ldquo;{activeCase.riddle}&rdquo;
            </p>
          </div>
        </div>

        {/* Live Terminal Messages */}
        <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-3 overflow-y-auto space-y-2 mb-3 min-h-36 max-h-48">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl text-xs ${
                m.sender === "user"
                  ? "bg-purple-950/80 border border-purple-800 text-purple-200 ml-6"
                  : "bg-cyan-950/80 border border-cyan-800 text-cyan-200 mr-6"
              }`}
            >
              <span className="text-[9px] font-bold block uppercase opacity-75 mb-0.5">
                {m.sender === "user" ? "You" : "ECHO Assistant"}
              </span>
              <p className="leading-snug">{m.text}</p>
            </div>
          ))}
        </div>

        {/* Bottom Query Input */}
        <form onSubmit={handleSendQuestion} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask ECHO for clues or guidance... (Costs 1 Coin)"
              className="flex-1 bg-slate-900 border-2 border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="btn-cartoon-blue px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send size={14} />
              <span>Ask (1 G)</span>
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Infiltrate the target rooms to collect authentic evidence!</span>
            <span className="text-cyan-400 font-bold">1 Coin per prompt</span>
          </div>
        </form>
      </div>
    </div>
  );
}
