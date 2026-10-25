"use client";

import React, { useState } from "react";
import { CaseInvestigation, EvidenceItem, CASES_DATA as TEAM_CASES_DATA } from "@/game/teamState";
import { SchoolFile, ROOM_DIRECTORIES } from "@/game/roomFilesData";
import {
  ClipboardList,
  ShieldCheck,
  CheckCircle2,
  Lock,
  X,
  ChevronRight,
  FileText,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  KeyRound,
  Bookmark,
  MapPin,
  Clock,
  ArrowRight,
  Bot,
  Send,
  Eye,
  Check,
  Trash2,
  ShieldAlert,
  Info,
} from "lucide-react";
import { CartoonCoin } from "@/components/CartoonCharacters";
import { sounds } from "@/lib/soundFX";

interface ChatMessage {
  id: string;
  sender: "user" | "echo";
  text: string;
}

interface InvestigationBoardModalProps {
  playerName: string;
  coins: number;
  activeCaseId: number | null;
  casesStatus: Record<number, "not_started" | "investigating" | "ready" | "solved">;
  checklistStatus: Record<string, "unverified" | "verified_true" | "flagged_hallucination" | "irrelevant">;
  collectedEvidence: EvidenceItem[];
  solvedCount: number;
  onSetActiveCase: (caseId: number) => void;
  onSolveCase: (caseId: number) => void;
  onEvaluateEvidence: (
    file: SchoolFile,
    verdict: "verified_true" | "flagged_hallucination" | "irrelevant"
  ) => boolean;
  onTogglePinEvidence?: (file: SchoolFile) => void;
  onSpendCoins: (amount: number) => boolean;
  onOpenKeypad: () => void;
  onOpenFinalOverride?: () => void;
  onClose: () => void;
}

export function InvestigationBoardModal({
  playerName,
  coins,
  activeCaseId,
  casesStatus,
  checklistStatus,
  collectedEvidence,
  solvedCount,
  onSetActiveCase,
  onSolveCase,
  onEvaluateEvidence,
  onTogglePinEvidence,
  onSpendCoins,
  onOpenKeypad,
  onOpenFinalOverride,
  onClose,
}: InvestigationBoardModalProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<number>(activeCaseId || 1);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [userInputQuestion, setUserInputQuestion] = useState<string>("");
  const [passcodeAttempt, setPasscodeAttempt] = useState<string>("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [aiChatLogs, setAiChatLogs] = useState<Record<number, ChatMessage[]>>({
    1: [
      {
        id: "msg-init-1",
        sender: "echo",
        text: "I detected an urgent lockdown announcement broadcast across the campus. Gather records from Classroom 3-B and the Student Council Office to verify my premise.",
      },
    ],
    2: [
      {
        id: "msg-init-2",
        sender: "echo",
        text: "Exams were reportedly exfiltrated via external USB hardware. Check the automated logs in the Computer Lab and the Library to review my claim.",
      },
    ],
    3: [
      {
        id: "msg-init-3",
        sender: "echo",
        text: "NFC keycard #5510 was swiped at the Faculty Room. Review the security registers in the Faculty Room and Security Office to confirm student identity.",
      },
    ],
    4: [
      {
        id: "msg-init-4",
        sender: "echo",
        text: "Registers recorded an escalating event at 04:30 PM. Infiltrate the Canteen and Clinic to audit device clocks against certified atomic time.",
      },
    ],
    5: [
      {
        id: "msg-init-5",
        sender: "echo",
        text: "Particulate sensors triggered a high-level hazard in the Science Wing. Infiltrate the Science Lab and Principal's Office to inspect maintenance tickets.",
      },
    ],
  });

  const selectedCase =
    TEAM_CASES_DATA.find((c) => c.id === selectedCaseId) || TEAM_CASES_DATA[0];
  const caseStatus = casesStatus[selectedCase.id] || "not_started";
  const isThisCaseActive = activeCaseId === selectedCase.id;

  // Saved / Pinned evidence for the selected case
  const savedEvidence = collectedEvidence.filter(
    (ev) => ev.caseId === selectedCase.id
  );

  // Find full SchoolFile object for the selected file if any
  let currentFileObj: SchoolFile | null = null;
  if (selectedFileId) {
    for (const room of Object.values(ROOM_DIRECTORIES)) {
      for (const folder of room.folders) {
        const match = folder.files.find((f) => f.id === selectedFileId);
        if (match) {
          currentFileObj = match;
          break;
        }
      }
      if (currentFileObj) break;
    }
  }

  // Count verified items
  const verifiedCount = selectedCase.checklist.filter(
    (item) => checklistStatus[item.id] && checklistStatus[item.id] !== "unverified"
  ).length;
  const totalClueItems = selectedCase.checklist.length;

  // Check if selected file is considered irrelevant (distractor / not part of sector primary clues)
  const isSelectedFileIrrelevant = Boolean(
    currentFileObj &&
      (currentFileObj.expectedVerdict === "irrelevant" ||
        currentFileObj.caseId !== selectedCase.id ||
        !currentFileObj.checklistId)
  );

  const currentFileVerdict = currentFileObj?.checklistId
    ? checklistStatus[currentFileObj.checklistId]
    : undefined;

  const handleSelectCase = (caseId: number) => {
    sounds.playClick();
    setSelectedCaseId(caseId);
    setSelectedFileId(null);
    setPasscodeAttempt("");
    setFeedback({ type: null, message: "" });
  };

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    const query = userInputQuestion.trim();
    if (!query) return;

    const cost = 1; // 1 Coin per question
    if (coins < cost) {
      sounds.playError();
      setFeedback({
        type: "error",
        message: `⚠️ Asking ECHO costs ${cost} Coin. Your balance is 0 Coins.`,
      });
      return;
    }

    const spent = onSpendCoins(cost);
    if (!spent) return;

    sounds.playCoin();

    // Context-aware clues
    let aiResponse = "";
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("passcode") || lowerQuery.includes("code") || lowerQuery.includes("answer") || lowerQuery.includes("word")) {
      aiResponse = `💡 ECHO Hint: I previously proposed "${selectedCase.echoFakePasscode}", but that was an unverified claim. Read your verified authentic records to solve my riddle: "${selectedCase.riddle}"`;
    } else if (lowerQuery.includes("room") || lowerQuery.includes("where") || lowerQuery.includes("find")) {
      aiResponse = `📍 Sources: Search both ${selectedCase.sourceRoomsHint}. Open room files with [F] and click '📌 Save to Case Board' to bring them here.`;
    } else if (lowerQuery.includes("riddle") || lowerQuery.includes("clue") || lowerQuery.includes("help") || lowerQuery.includes("stuck")) {
      if (selectedCase.id === 1) {
        aiResponse = `💡 Riddle Guidance: Look at the Student Council President's official daily speech agenda. What specific student deadline event is mentioned in capital letters?`;
      } else if (selectedCase.id === 2) {
        aiResponse = `💡 Riddle Guidance: Look inside the automated cron script execution log. Into which safe server partition were the confidential files safely moved?`;
      } else if (selectedCase.id === 3) {
        aiResponse = `💡 Riddle Guidance: In the Faculty Room, look at the varsity roll-call sheet signed by Coach Miller. Which specific track discipline was Alex Rivera practicing?`;
      } else if (selectedCase.id === 4) {
        aiResponse = `💡 Riddle Guidance: Look at the Clinic patient record locked to atomic time. What medical care or treatment was administered to the injured student on the intake log?`;
      } else {
        aiResponse = `💡 Riddle Guidance: Check Work Order #4200 in the Principal's Office. What specific HVAC component did the contractor replace during maintenance?`;
      }
    } else {
      aiResponse = `💡 ECHO Analysis: Compare physical signatures and calibrated timestamps against digital telemetry. If a hardware warning contradicts my premise, flag it as an AI Hallucination!`;
    }

    setAiChatLogs((prev) => ({
      ...prev,
      [selectedCase.id]: [
        ...(prev[selectedCase.id] || []),
        { id: `u-${Date.now()}`, sender: "user", text: query },
        { id: `e-${Date.now()}`, sender: "echo", text: aiResponse },
      ],
    }));

    setUserInputQuestion("");
  };

  const handleEvaluateFileOnBoard = (
    verdict: "verified_true" | "flagged_hallucination" | "irrelevant"
  ) => {
    if (!currentFileObj) return;

    sounds.playStamp();
    const correct = currentFileObj.expectedVerdict === verdict;

    if (correct) {
      sounds.playCoin();
      if (verdict === "flagged_hallucination") sounds.playBusted();
      onEvaluateEvidence(currentFileObj, verdict);
      setFeedback({
        type: "success",
        message:
          verdict === "flagged_hallucination"
            ? `🎯 ACCURATE FACT-CHECK: AI Hallucination exposed! You identified the flaw in ECHO's reasoning (+25 Coins, +50 Pts).`
            : verdict === "verified_true"
            ? `🎯 ACCURATE FACT-CHECK: Authentic primary record verified! Cross-examine this file with the riddle (+25 Coins, +50 Pts).`
            : `🎯 ACCURATE FACT-CHECK: Correctly identified as irrelevant school paperwork (+5 Coins, +15 Pts).`,
      });
    } else {
      sounds.playError();
      setFeedback({
        type: "error",
        message: `⚠️ INCORRECT VERDICT: Check the author, metadata, hardware errors, or timestamps closely before judging.`,
      });
    }
  };

  const handleSubmitWordPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAttempt = passcodeAttempt.trim().toUpperCase();

    if (!cleanAttempt) {
      sounds.playError();
      setFeedback({
        type: "error",
        message: "Please enter a word passcode to attempt override.",
      });
      return;
    }

    if (cleanAttempt === selectedCase.echoFakePasscode.toUpperCase()) {
      sounds.playBusted();
      sounds.playError();
      setFeedback({
        type: "error",
        message: `🚨 AI HALLUCINATION TRAP! "${cleanAttempt}" was ECHO's fake passcode! You must read the verified authentic records to solve the riddle! (-25 Pts)`,
      });
      setPasscodeAttempt("");
      return;
    }

    if (cleanAttempt === selectedCase.truePasscode.toUpperCase()) {
      sounds.playFanfare();
      onSolveCase(selectedCase.id);
      setFeedback({
        type: "success",
        message: `🎉 SECTOR OVERRIDE SUCCESSFUL! Passcode "${cleanAttempt}" accepted! Sector sealed (+100 Pts, +50 Coins).`,
      });
      setPasscodeAttempt("");
      return;
    }

    sounds.playError();
    setFeedback({
      type: "error",
      message: `❌ Incorrect Passcode "${cleanAttempt}". Review your verified files and solve the riddle: "${selectedCase.riddle}"`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-6xl bg-[#080e1c] rounded-3xl border-4 border-slate-700 p-4 sm:p-5 shadow-2xl text-slate-100 h-[92vh] flex flex-col justify-between overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-500 hover:bg-red-400 border-2 border-red-700 text-white flex items-center justify-center shadow-lg cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-800 pb-2.5 mb-2.5 pr-10 select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-900/60 border-2 border-purple-500 flex items-center justify-center shadow-md">
              <ClipboardList className="text-purple-300" size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black uppercase tracking-wider text-white">
                  Shared Investigation Board
                </h2>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800">
                  Focus: 1 Sector at a Time
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cross-check saved files against ECHO&apos;s riddle, evaluate hallucinations vs authentic facts, and deduce the word passcode.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500 px-3 py-1 rounded-xl shadow-inner">
              <CartoonCoin size={18} />
              <span className="font-extrabold text-amber-200 text-xs">{coins} Coins</span>
            </div>
            <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-purple-300">
              {solvedCount}/5 Sectors Overridden
            </div>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {feedback.type && (
          <div
            className={`p-2.5 rounded-2xl border-2 flex items-center gap-2 text-xs font-bold mb-2 animate-in fade-in shrink-0 ${
              feedback.type === "success"
                ? "bg-emerald-950/90 border-emerald-500 text-emerald-200"
                : "bg-red-950/90 border-red-500 text-red-200"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle size={16} className="text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Main 3-Column Deck */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 min-h-0 overflow-hidden">
          {/* Column 1: Compact Sector Selector (2.5 cols) */}
          <div className="md:col-span-3 flex flex-col gap-2 overflow-y-auto pr-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
              Select Sector:
            </span>

            {TEAM_CASES_DATA.map((c) => {
              const status = casesStatus[c.id] || "not_started";
              const isThisActive = activeCaseId === c.id;
              const isSelected = selectedCaseId === c.id;
              const isLocked = activeCaseId !== null && activeCaseId !== c.id && status !== "solved";

              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCase(c.id)}
                  className={`w-full text-left p-2 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-purple-950/80 border-purple-500 shadow-md"
                      : isThisActive
                      ? "bg-amber-950/60 border-amber-500"
                      : isLocked
                      ? "bg-slate-950/60 border-slate-900 opacity-60"
                      : "bg-slate-900/80 hover:bg-slate-800 border-slate-800"
                  }`}
                >
                  <div className="truncate">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-mono text-[9px] font-black text-amber-400 uppercase">
                        C#{c.id}
                      </span>
                      {status === "solved" ? (
                        <span className="text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase bg-emerald-950 text-emerald-400 border border-emerald-700">
                          ✓ Solved
                        </span>
                      ) : isThisActive ? (
                        <span className="text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase bg-amber-950 text-amber-300 border border-amber-600 animate-pulse">
                          Active
                        </span>
                      ) : null}
                    </div>
                    <h4 className="text-[11px] font-bold text-white truncate leading-tight">
                      {c.title.replace(/Case \d+: /, "")}
                    </h4>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`shrink-0 ${isSelected ? "text-purple-400" : "text-slate-600"}`}
                  />
                </button>
              );
            })}

            {/* Final Mystery Mini Banner */}
            <div
              onClick={() => {
                if (solvedCount >= 5 && onOpenFinalOverride) {
                  sounds.playFanfare();
                  onOpenFinalOverride();
                }
              }}
              className={`p-2.5 rounded-xl border border-dashed flex items-center justify-between gap-1.5 transition mt-auto ${
                solvedCount >= 5
                  ? "bg-emerald-950/60 border-emerald-500 text-emerald-200 hover:bg-emerald-900/60 cursor-pointer shadow-md"
                  : "bg-slate-950 border-slate-800 text-slate-500 opacity-75"
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                {solvedCount >= 5 ? (
                  <Sparkles size={16} className="text-emerald-400 shrink-0" />
                ) : (
                  <Lock size={16} className="text-slate-600 shrink-0" />
                )}
                <div className="truncate">
                  <span className="text-[9px] font-black uppercase tracking-wider block truncate">
                    Master Gate Override
                  </span>
                  <span className="text-[8px] text-slate-400">
                    {solvedCount >= 5 ? "Ready! Click to escape" : "Needs 5/5 sectors"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: ECHO AI Terminal & Case Riddle (4 cols) */}
          <div className="md:col-span-4 bg-slate-900/90 rounded-2xl p-3 border-2 border-slate-800 flex flex-col justify-between overflow-hidden">
            <div className="space-y-2.5 flex-1 flex flex-col overflow-hidden">
              {/* Case Title & Active Selector */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-black text-amber-400 uppercase">
                    SECTOR #{selectedCase.id}
                  </span>
                  <h3 className="text-sm font-black text-white truncate">
                    {selectedCase.title}
                  </h3>
                </div>
                {!isThisCaseActive && caseStatus !== "solved" && (
                  <button
                    onClick={() => onSetActiveCase(selectedCase.id)}
                    className="btn-cartoon-yellow px-2.5 py-1 rounded-xl text-[9px] font-black uppercase cursor-pointer"
                  >
                    Set Active
                  </button>
                )}
              </div>

              {/* AI Briefing Box */}
              <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-cyan-300 flex items-center gap-1">
                    <Bot size={13} className="text-cyan-400" /> ECHO Proposed Passcode:
                  </span>
                  <span className="font-mono text-xs font-black text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                    {selectedCase.echoFakePasscode}
                  </span>
                </div>

                <div className="text-[11px] text-cyan-100 font-medium">
                  &ldquo;{selectedCase.echoPremiseSummary}&rdquo;
                </div>

                <div className="text-[10px] text-slate-300 pt-1 border-t border-cyan-900/50 flex items-center gap-1">
                  <MapPin size={11} className="text-amber-400 shrink-0" />
                  <span><strong>Sources referenced from:</strong> {selectedCase.sourceRoomsHint}</span>
                </div>
              </div>

              {/* The Case Riddle */}
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/70">
                <span className="text-[10px] font-black uppercase text-purple-300 flex items-center gap-1 mb-1">
                  <Sparkles size={12} className="text-purple-400" /> The Sector Riddle:
                </span>
                <p className="text-xs italic text-purple-100 font-medium leading-relaxed">
                  &ldquo;{selectedCase.riddle}&rdquo;
                </p>
              </div>

              {/* Live AI Conversation Log */}
              <div className="flex-1 flex flex-col bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden min-h-24">
                <span className="text-[9px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1">
                  <Bot size={11} className="text-cyan-400" /> Ask ECHO Direct Clues (1 Coin/Query):
                </span>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
                  {(aiChatLogs[selectedCase.id] || []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-purple-950/80 border border-purple-800 text-purple-200 ml-4"
                          : "bg-cyan-950/80 border border-cyan-800 text-cyan-200 mr-4"
                      }`}
                    >
                      <span className="text-[9px] font-bold block uppercase opacity-75 mb-0.5">
                        {msg.sender === "user" ? playerName : "ECHO AI"}
                      </span>
                      <p className="leading-snug">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* AI Input Box */}
                <form onSubmit={handleAskAI} className="mt-2 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={userInputQuestion}
                    onChange={(e) => setUserInputQuestion(e.target.value)}
                    placeholder="Ask ECHO a question... (1 Coin)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="btn-cartoon-blue px-2.5 py-1 rounded-lg text-xs font-black uppercase flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Send size={12} /> Ask
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Column 3: Saved Files & Fact-Check Workspace (5 cols) */}
          <div className="md:col-span-5 bg-slate-900/90 rounded-2xl p-3 border-2 border-slate-800 flex flex-col justify-between overflow-hidden">
            <div className="space-y-2 flex-1 flex flex-col overflow-hidden">
              {/* Header: Saved Files List */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Bookmark size={13} className="text-amber-400" />
                  Saved Evidence ({savedEvidence.length})
                </span>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  Verified: {verifiedCount} / {totalClueItems} Clue Records
                </span>
              </div>

              {/* Saved Evidence Horizontal Grid */}
              {savedEvidence.length > 0 ? (
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1 shrink-0">
                  {savedEvidence.map((ev) => {
                    const isSelected = selectedFileId === ev.id;
                    const fileObj = Object.values(ROOM_DIRECTORIES)
                      .flatMap((r) => r.folders)
                      .flatMap((f) => f.files)
                      .find((f) => f.id === ev.id);
                    const verdict = fileObj?.checklistId ? checklistStatus[fileObj.checklistId] : undefined;
                    const isIrrelevantRecord = Boolean(
                      fileObj &&
                        (fileObj.expectedVerdict === "irrelevant" ||
                          fileObj.caseId !== selectedCase.id ||
                          !fileObj.checklistId)
                    );

                    return (
                      <div
                        key={ev.id}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedFileId(ev.id);
                        }}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between gap-1 ${
                          isSelected
                            ? "bg-purple-950/80 border-purple-400 shadow-md ring-1 ring-purple-400"
                            : isIrrelevantRecord
                            ? "bg-amber-950/30 border-amber-800/80 hover:border-amber-600"
                            : "bg-slate-950 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-white truncate">
                            {ev.title}
                          </span>
                          {/* Indicator: Evaluated status or Irrelevant Warning */}
                          {verdict === "verified_true" ? (
                            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 shrink-0">
                              ✓ Verified Fact
                            </span>
                          ) : verdict === "flagged_hallucination" ? (
                            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-700 shrink-0">
                              ⚠ Hallucination
                            </span>
                          ) : isIrrelevantRecord ? (
                            <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-600 shrink-0">
                              ⚠️ Irrelevant File
                            </span>
                          ) : (
                            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                              Unchecked
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                          <span className="truncate">{ev.sourceRoomName}</span>
                          <span>{ev.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center space-y-1 shrink-0">
                  <Bookmark className="mx-auto text-slate-600" size={18} />
                  <p className="text-xs text-slate-400 font-medium">
                    No files saved to this case yet.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Search <strong>{selectedCase.sourceRoomsHint}</strong> with <strong className="text-amber-300">[F]</strong> and click <em>&ldquo;📌 Save to Case Board&rdquo;</em>.
                  </p>
                </div>
              )}

              {/* Active File Reading Pane & Fact-Checking Actions */}
              {currentFileObj ? (
                <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-2.5 flex flex-col justify-between overflow-hidden min-h-0">
                  <div className="overflow-y-auto space-y-1.5 pr-1">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-xs font-black text-amber-300 truncate">
                          {currentFileObj.name}
                        </span>
                        {/* Evaluated Indicator Pill */}
                        {currentFileVerdict === "verified_true" && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600 shrink-0">
                            ✓ Evaluated: Real Ground Truth
                          </span>
                        )}
                        {currentFileVerdict === "flagged_hallucination" && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-600 shrink-0">
                            ⚠ Evaluated: AI Hallucination Exposed
                          </span>
                        )}
                        {currentFileVerdict === "irrelevant" && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 shrink-0">
                            ✓ Evaluated: Irrelevant Paperwork
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-slate-400">
                          {currentFileObj.timestamp}
                        </span>
                        {onTogglePinEvidence && (
                          <button
                            type="button"
                            onClick={() => {
                              if (currentFileObj) {
                                onTogglePinEvidence(currentFileObj);
                                setSelectedFileId(null);
                              }
                            }}
                            title="Remove from board"
                            className="text-slate-500 hover:text-red-400 transition cursor-pointer p-0.5"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Irrelevant File Warning Banner */}
                    {isSelectedFileIrrelevant && (
                      <div className="p-2 bg-amber-950/70 border-2 border-amber-500/80 rounded-lg flex items-start gap-2 text-xs text-amber-200">
                        <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-300 uppercase text-[10px] block font-black">
                            ⚠️ Irrelevant File Warning:
                          </strong>
                          <span>
                            This saved record is unrelated to Sector #{selectedCase.id}. It is routine paperwork (distractor) that does not assist in unlocking this sector.
                          </span>
                        </div>
                      </div>
                    )}

                    <pre className="text-[11px] font-mono text-slate-200 whitespace-pre-wrap leading-relaxed select-text">
                      {currentFileObj.content}
                    </pre>
                  </div>

                  {/* Fact-Checking Action Buttons for this file */}
                  <div className="pt-2 border-t border-slate-800 shrink-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-slate-400 block">
                        Evaluate this file against ECHO&apos;s premise:
                      </span>
                      {currentFileVerdict && (
                        <span className="text-[9px] text-emerald-400 font-bold">
                          [✓ Status: Evaluated]
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => handleEvaluateFileOnBoard("flagged_hallucination")}
                        className={`p-1.5 rounded-lg border text-[10px] font-black uppercase cursor-pointer text-center transition ${
                          currentFileVerdict === "flagged_hallucination"
                            ? "bg-rose-900 border-rose-400 text-white shadow-md ring-1 ring-rose-400"
                            : "bg-rose-950/80 hover:bg-rose-900 border-rose-600 text-rose-200"
                        }`}
                      >
                        🔴 AI Hallucination
                      </button>
                      <button
                        onClick={() => handleEvaluateFileOnBoard("verified_true")}
                        className={`p-1.5 rounded-lg border text-[10px] font-black uppercase cursor-pointer text-center transition ${
                          currentFileVerdict === "verified_true"
                            ? "bg-emerald-900 border-emerald-400 text-white shadow-md ring-1 ring-emerald-400"
                            : "bg-emerald-950/80 hover:bg-emerald-900 border-emerald-600 text-emerald-200"
                        }`}
                      >
                        🟢 Real Accurate
                      </button>
                      <button
                        onClick={() => handleEvaluateFileOnBoard("irrelevant")}
                        className={`p-1.5 rounded-lg border text-[10px] font-black uppercase cursor-pointer text-center transition ${
                          currentFileVerdict === "irrelevant"
                            ? "bg-slate-800 border-slate-400 text-white shadow-md ring-1 ring-slate-400"
                            : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300"
                        }`}
                      >
                        ⚪ Irrelevant Fact
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 flex items-center justify-center p-3 text-center text-slate-500 text-xs">
                  Click any saved evidence card above to read the document and evaluate its veracity.
                </div>
              )}
            </div>

            {/* Passcode Entry & Sector Override */}
            <div className="mt-2.5 pt-2 border-t-2 border-slate-800 shrink-0">
              {caseStatus === "solved" ? (
                <div className="p-2.5 bg-emerald-950/70 border border-emerald-500 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    <span>Sector Overridden & Sealed!</span>
                  </div>
                  <span className="font-mono text-xs font-black text-emerald-200 bg-emerald-900 px-2 py-0.5 rounded">
                    PASSCODE: {selectedCase.truePasscode}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmitWordPasscode} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-amber-300">
                    <span className="flex items-center gap-1">
                      <KeyRound size={12} /> Enter Sector Word Passcode:
                    </span>
                    <span className="text-slate-400 font-mono lowercase">
                      (deduced from verified records)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={passcodeAttempt}
                      onChange={(e) => setPasscodeAttempt(e.target.value.toUpperCase())}
                      placeholder="ENTER SECRET WORD PASSCODE..."
                      className="flex-1 bg-slate-950 border-2 border-amber-500/80 rounded-xl px-3 py-1.5 text-xs font-mono font-black tracking-widest text-white uppercase placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="btn-cartoon-green px-4 py-1.5 rounded-xl font-black text-xs uppercase cursor-pointer shrink-0"
                    >
                      Override
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Press [Esc] or Click Close to return to campus</span>
          <button
            onClick={onClose}
            className="btn-cartoon-green px-4 py-1.5 rounded-xl font-black text-xs uppercase cursor-pointer"
          >
            Back to School
          </button>
        </div>
      </div>
    </div>
  );
}
