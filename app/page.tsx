"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { SchoolCanvas } from "@/components/SchoolCanvas";
import { GameHUD } from "@/components/GameHUD";
import { MapOverviewModal } from "@/components/MapOverviewModal";
import { RoomDirectoryModal } from "@/components/RoomDirectoryModal";
import { DocumentViewerModal } from "@/components/DocumentViewerModal";
import { SchoolFile } from "@/game/roomFilesData";
import { EchoChatModal } from "@/components/EchoChatModal";
import { InvestigationBoardModal } from "@/components/InvestigationBoardModal";
import { KeypadModal } from "@/components/KeypadModal";
import { FinalOverrideModal } from "@/components/FinalOverrideModal";
import { HostDashboardModal } from "@/components/HostDashboardModal";
import { HelpModal } from "@/components/HelpModal";
import { LobbyModal } from "@/components/LobbyModal";
import { StorylineTutorialModal } from "@/components/StorylineTutorialModal";
import {
  PlayerState,
  InteractiveTarget,
  checkCollision,
  getNearbyInteractable,
} from "@/game/playerEngine";
import {
  TeamState,
  EvidenceItem,
  CASES_DATA,
  INITIAL_EVIDENCE_CATALOG,
} from "@/game/teamState";
import { ROOMS } from "@/game/schoolMapData";
import { sounds } from "@/lib/soundFX";
import { getTournamentBroadcastChannel, LiveTournamentState } from "@/lib/tournamentLiveSync";
import { Radio } from "lucide-react";

export default function GamePage() {
  // Shared Team State & Group Economy
  const [teamState, setTeamState] = useState<TeamState>({
    teamId: "team-alpha",
    teamName: "Team Alpha (Cyber Sentinels)",
    passcode: "ALPHA-4",
    members: [
      { id: "m1", name: "Alex", avatar: "alex", ready: true, currentRoomId: null, isSelf: true },
      { id: "m2", name: "Sam", avatar: "sam", ready: true, currentRoomId: "computer_lab" },
      { id: "m3", name: "Maya", avatar: "maya", ready: true, currentRoomId: "library" },
      { id: "m4", name: "Chris", avatar: "chris", ready: true, currentRoomId: "student_council" },
    ],
    activeCaseId: 1, // Start on Case 1
    casesStatus: { 1: "investigating", 2: "not_started", 3: "not_started", 4: "not_started", 5: "not_started" },
    checklistStatus: {},
    collectedEvidence: INITIAL_EVIDENCE_CATALOG,
    activityFeed: [
      { id: "act-1", playerName: "Sam", action: "examined student bulletin in Classroom 3-B", timestamp: "04:32 PM" },
      { id: "act-2", playerName: "Maya", action: "searched Student Council public broadcasts", timestamp: "04:38 PM" },
    ],
    solvedCount: 0,
    score: 150,
    coins: 120, // Coin balance for AI hints
  });

  // Local Player Controller State
  const [player, setPlayer] = useState<PlayerState>({
    id: "p1-self",
    name: "Alex",
    avatar: "alex",
    x: 800, // Central Lobby / Hallway
    y: 520,
    direction: "down",
    moving: false,
    currentRoomId: null,
    fountainUsed: false,
  });

  // Teammates in various rooms
  const [teammates, setTeammates] = useState<PlayerState[]>([
    {
      id: "p2-sam",
      name: "Sam",
      avatar: "sam",
      x: 600,
      y: 165,
      direction: "down",
      moving: false,
      currentRoomId: "computer_lab",
      fountainUsed: false,
    },
    {
      id: "p3-maya",
      name: "Maya",
      avatar: "maya",
      x: 1000,
      y: 165,
      direction: "up",
      moving: false,
      currentRoomId: "library",
      fountainUsed: false,
    },
    {
      id: "p4-chris",
      name: "Chris",
      avatar: "chris",
      x: 600,
      y: 850,
      direction: "down",
      moving: false,
      currentRoomId: "student_council",
      fountainUsed: false,
    },
  ]);

  // Tournament Server Session State
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [sessionCode, setSessionCode] = useState<string>("BSIT3A-G1");
  const [teamCapacity, setTeamCapacity] = useState<number>(10);
  const [showLobby, setShowLobby] = useState<boolean>(true);
  const [showStorylineTutorial, setShowStorylineTutorial] = useState<boolean>(false);
  const [broadcastBanner, setBroadcastBanner] = useState<string | null>(null);

  // Timers & Modals
  const [timerSec, setTimerSec] = useState(1800); // 30 minutes
  const [interactiveTarget, setInteractiveTarget] = useState<InteractiveTarget | null>(null);
  const [activeModal, setActiveModal] = useState<"map" | "directory" | "echo" | "board" | "help" | "keypad" | "override" | "host" | "docViewer" | null>(null);
  const [selectedFileToView, setSelectedFileToView] = useState<SchoolFile | null>(null);

  // Key tracking
  const keysPressed = useRef<Record<string, boolean>>({});

  // Real-time synchronization with server API and BroadcastChannel
  useEffect(() => {
    const syncWithServer = async () => {
      try {
        const res = await fetch("/api/tournament");
        if (res.ok) {
          const data: LiveTournamentState = await res.json();
          if (data.isGameStarted && !isGameStarted) {
            setIsGameStarted(true);
            setShowLobby(false);
            setShowStorylineTutorial(true);
          }
          if (typeof data.timerSec === "number" && Math.abs(data.timerSec - timerSec) > 5) {
            setTimerSec(data.timerSec);
          }
          if (data.broadcastMessage && data.broadcastMessage !== broadcastBanner) {
            sounds.playFanfare();
            setBroadcastBanner(data.broadcastMessage);
          }
          const squad = data.squads[sessionCode];
          if (squad && squad.score === 0 && teamState.score > 0 && squad.solvedCases.length === 0) {
            setTeamState((prev) => ({
              ...prev,
              score: 0,
              coins: 120,
              casesStatus: { 1: "investigating", 2: "not_started", 3: "not_started", 4: "not_started", 5: "not_started" },
              checklistStatus: {},
              solvedCount: 0,
              activeCaseId: 1,
            }));
          }
        }
      } catch (err) {
        // silent sync error
      }
    };

    const interval = setInterval(syncWithServer, 2000);

    const channel = getTournamentBroadcastChannel();
    if (channel) {
      channel.onmessage = (event) => {
        if (event.data?.type === "TOURNAMENT_STATE_UPDATE" && event.data.payload) {
          const data: LiveTournamentState = event.data.payload;
          if (data.isGameStarted && !isGameStarted) {
            setIsGameStarted(true);
            setShowLobby(false);
            setShowStorylineTutorial(true);
          }
          if (data.broadcastMessage && data.broadcastMessage !== broadcastBanner) {
            sounds.playFanfare();
            setBroadcastBanner(data.broadcastMessage);
          }
          const squad = data.squads[sessionCode];
          if (squad && squad.score === 0 && teamState.score > 0 && squad.solvedCases.length === 0) {
            setTeamState((prev) => ({
              ...prev,
              score: 0,
              coins: 120,
              casesStatus: { 1: "investigating", 2: "not_started", 3: "not_started", 4: "not_started", 5: "not_started" },
              checklistStatus: {},
              solvedCount: 0,
              activeCaseId: 1,
            }));
          }
        }
      };
    }

    return () => {
      clearInterval(interval);
      channel?.close();
    };
  }, [isGameStarted, timerSec, broadcastBanner]);

  // Countdown Timer (Only runs when game is officially started)
  useEffect(() => {
    if (!isGameStarted) return;
    const interval = setInterval(() => {
      setTimerSec((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameStarted]);

  // Update nearby interactive targets as player moves
  useEffect(() => {
    const target = getNearbyInteractable(player);
    setInteractiveTarget(target);
  }, [player]);

  // Handle Squad Join from Lobby
  const handleJoinSquad = (
    roomCode: string,
    teamId: string,
    teamName: string,
    playerName: string,
    avatar: string
  ) => {
    setSessionCode(roomCode);
    setTeamState((prev) => ({
      ...prev,
      teamId,
      teamName,
      passcode: roomCode,
      members: [
        { id: "m1", name: playerName, avatar, ready: true, currentRoomId: null, isSelf: true },
        ...prev.members.slice(1),
      ],
    }));
    setPlayer((prev) => ({
      ...prev,
      name: playerName,
      avatar,
    }));
    setShowLobby(false);
    setIsGameStarted(true);
    setShowStorylineTutorial(true); // Flash storyline & field guide tutorial!
  };

  const handleHostStartTournament = () => {
    setIsGameStarted(true);
    setShowLobby(false);
    setShowStorylineTutorial(true);
  };

  // Handle Coin Spend for AI Prompts
  const handleSpendCoins = (amount: number): boolean => {
    if (teamState.coins >= amount) {
      setTeamState((prev) => ({
        ...prev,
        coins: prev.coins - amount,
      }));
      return true;
    }
    return false;
  };

  // Handle Realistic File Evaluation
  const handleEvaluateFile = (
    file: SchoolFile,
    verdict: "verified_true" | "flagged_hallucination" | "irrelevant"
  ): boolean => {
    if (!file.checklistId) {
      return true;
    }

    const isCorrect = file.expectedVerdict === verdict;
    if (isCorrect) {
      const coinReward = verdict === "flagged_hallucination" ? 25 : verdict === "verified_true" ? 25 : 5;
      const scoreReward = verdict === "irrelevant" ? 15 : 50;

      // Sync progress live to host tournament server
      fetch("/api/tournament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_SQUAD_PROGRESS",
          payload: {
            roomCode: sessionCode,
            filesEvaluatedInc: 1,
            score: teamState.score + scoreReward,
            coins: teamState.coins + coinReward,
          },
        }),
      }).catch(() => {});

      setTeamState((prev) => ({
        ...prev,
        checklistStatus: { ...prev.checklistStatus, [file.checklistId!]: verdict },
        coins: prev.coins + coinReward,
        score: prev.score + scoreReward,
        activityFeed: [
          {
            id: `feed-${Date.now()}`,
            playerName: player.name,
            action:
              verdict === "flagged_hallucination"
                ? `exposed AI hallucination on "${file.name}"! (+${coinReward} Coins, +50 Pts)`
                : verdict === "verified_true"
                ? `verified authentic primary record: "${file.name}"! Check the embedded document ID on Keypad.`
                : `identified "${file.name}" as routine school paperwork.`,
            timestamp: "04:47 PM",
          },
          ...prev.activityFeed,
        ],
      }));
      return true;
    } else {
      // Penalty for wrong guess
      setTeamState((prev) => ({
        ...prev,
        score: Math.max(0, prev.score - 25),
        activityFeed: [
          {
            id: `feed-${Date.now()}`,
            playerName: player.name,
            action: `made an erroneous fact-check submission on "${file.name}". (-25 Pts)`,
            timestamp: "04:47 PM",
          },
          ...prev.activityFeed,
        ],
      }));
      return false;
    }
  };

  // Handle Toggle Pin Evidence to Shared Investigation Board
  const handleTogglePinEvidence = (file: SchoolFile) => {
    sounds.playStamp();
    setTeamState((prev) => {
      const alreadyPinned = prev.collectedEvidence.some((ev) => ev.id === file.id);
      if (alreadyPinned) {
        return {
          ...prev,
          collectedEvidence: prev.collectedEvidence.filter((ev) => ev.id !== file.id),
        };
      } else {
        const currentRoom = ROOMS.find((r) => r.id === player.currentRoomId);
        const newEv: EvidenceItem = {
          id: file.id,
          caseId: file.caseId || prev.activeCaseId || 1,
          title: file.title,
          sourceRoomId: player.currentRoomId || "hallway",
          sourceRoomName: currentRoom?.name || "Campus Archive",
          discoveredByName: player.name,
          timestamp: file.timestamp,
          snippet: file.content.slice(0, 160).replace(/\n/g, " ") + "...",
          metadata: {
            author: file.author,
            createdDate: file.timestamp,
            fileType: file.fileType,
          },
          isKeyEvidence: Boolean(file.expectedVerdict === "verified_true" || file.expectedVerdict === "flagged_hallucination"),
        };
        return {
          ...prev,
          collectedEvidence: [newEv, ...prev.collectedEvidence],
        };
      }
    });
  };

  // Handle Case Solved
  const handleSolveCase = (caseId: number) => {
    sounds.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Sync solved sector to host tournament server
    fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPDATE_SQUAD_PROGRESS",
        payload: {
          roomCode: sessionCode,
          solvedCaseId: caseId,
          score: teamState.score + 100,
          coins: teamState.coins + 50,
        },
      }),
    }).catch(() => {});

    setTeamState((prev) => {
      const nextCount = prev.solvedCount + 1;
      return {
        ...prev,
        solvedCount: nextCount,
        score: prev.score + 100,
        coins: prev.coins + 50,
        casesStatus: { ...prev.casesStatus, [caseId]: "solved" },
        activeCaseId: null, // Unlocks choosing the next case!
        activityFeed: [
          {
            id: `solve-${Date.now()}`,
            playerName: player.name,
            action: `verified and solved Case #${caseId}! (+100 Pts, +50 Coins)`,
            timestamp: "04:50 PM",
          },
          ...prev.activityFeed,
        ],
      };
    });
  };

  // Handle Player Interaction (`E` Key or button)
  const handleInteract = useCallback(() => {
    if (!interactiveTarget) return;

    sounds.playClick();

    if (interactiveTarget.type === "door") {
      if (player.currentRoomId === null && interactiveTarget.roomId) {
        const room = ROOMS.find((r) => r.id === interactiveTarget.roomId);
        if (!room) return;

        sounds.playStamp();
        setPlayer((prev) => ({
          ...prev,
          currentRoomId: room.id,
          x: room.door.x + room.door.width / 2,
          y: room.door.facing === "bottom" ? room.door.y - 35 : room.door.y + 35,
        }));
      } else {
        const currentRoom = ROOMS.find((r) => r.id === player.currentRoomId);
        if (!currentRoom) return;

        sounds.playStamp();
        setPlayer((prev) => ({
          ...prev,
          currentRoomId: null,
          x: currentRoom.door.x + currentRoom.door.width / 2,
          y: currentRoom.door.facing === "bottom" ? currentRoom.door.y + 35 : currentRoom.door.y - 35,
        }));
      }
    } else if (interactiveTarget.type === "fountain") {
      if (!player.fountainUsed) {
        sounds.playCoin();
        setTeamState((prev) => ({
          ...prev,
          coins: prev.coins + 10,
        }));
        setPlayer((prev) => ({ ...prev, fountainUsed: true }));
        alert("💧 You drank refreshing cold water! (+10 Bonus Coins for AI questions).");
      } else {
        sounds.playClick();
        alert("💧 Filtered water dispenser. Flowing clean water!");
      }
    } else if (interactiveTarget.type === "echo") {
      setActiveModal("echo");
    } else if (interactiveTarget.type === "exit") {
      // Main Exit: If all 5 cases solved, open Master Override sequence!
      if (teamState.solvedCount >= 5) {
        sounds.playFanfare();
        setActiveModal("override");
      } else {
        setActiveModal("keypad");
      }
    } else if (interactiveTarget.type === "object") {
      sounds.playStamp();
      setActiveModal("directory");
    }
  }, [interactiveTarget, player.currentRoomId, player.fountainUsed, teamState.solvedCount]);

  // Main Movement Loop - Fast Walk (5.6 px/frame)
  useEffect(() => {
    let animId: number;
    const speed = 5.6;

    const gameLoop = () => {
      if (activeModal !== null) {
        animId = requestAnimationFrame(gameLoop);
        return;
      }

      let dx = 0;
      let dy = 0;
      let newDir = player.direction;

      if (keysPressed.current["w"] || keysPressed.current["arrowup"]) {
        dy -= speed;
        newDir = "up";
      }
      if (keysPressed.current["s"] || keysPressed.current["arrowdown"]) {
        dy += speed;
        newDir = "down";
      }
      if (keysPressed.current["a"] || keysPressed.current["arrowleft"]) {
        dx -= speed;
        newDir = "left";
      }
      if (keysPressed.current["d"] || keysPressed.current["arrowright"]) {
        dx += speed;
        newDir = "right";
      }

      if (dx !== 0 || dy !== 0) {
        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }

        const nextX = player.x + dx;
        const nextY = player.y + dy;

        const { blocked, allowedRoomId } = checkCollision(
          nextX,
          nextY,
          player.currentRoomId
        );

        if (!blocked) {
          setPlayer((prev) => ({
            ...prev,
            x: nextX,
            y: nextY,
            direction: newDir,
            moving: true,
            currentRoomId: allowedRoomId,
          }));
        }
      } else if (player.moving) {
        setPlayer((prev) => ({ ...prev, moving: false }));
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [activeModal, player.direction, player.moving, player.currentRoomId, player.x, player.y]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "escape") {
        setActiveModal(null);
        return;
      }

      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA") {
        return;
      }

      if (key === "tab") {
        e.preventDefault();
        sounds.playClick();
        setActiveModal((prev) => (prev === "board" ? null : "board"));
        return;
      }
      if (key === "q") {
        e.preventDefault();
        sounds.playClick();
        setActiveModal((prev) => (prev === "echo" ? null : "echo"));
        return;
      }
      if (key === "f") {
        e.preventDefault();
        sounds.playClick();
        setActiveModal((prev) => (prev === "directory" ? null : "directory"));
        return;
      }
      if (key === "m") {
        e.preventDefault();
        sounds.playClick();
        setActiveModal((prev) => (prev === "map" ? null : "map"));
        return;
      }
      if (key === "e") {
        e.preventDefault();
        handleInteract();
        return;
      }

      keysPressed.current[key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current[key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleInteract]);

  const activeCase = teamState.activeCaseId
    ? CASES_DATA.find((c) => c.id === teamState.activeCaseId) || CASES_DATA[0]
    : CASES_DATA[0];

  return (
    <main className="fixed inset-0 w-screen h-screen bg-[#090d16] text-slate-100 overflow-hidden select-none">
      {/* Floating Minimalist HUD */}
      <GameHUD
        player={player}
        interactiveTarget={interactiveTarget}
        coins={teamState.coins}
        activeCaseId={teamState.activeCaseId}
        timerSec={timerSec}
        solvedCount={teamState.solvedCount}
        onOpenBoard={() => setActiveModal("board")}
        onOpenEcho={() => setActiveModal("echo")}
        onOpenFiles={() => setActiveModal("directory")}
        onOpenMap={() => setActiveModal("map")}
        onOpenHelp={() => setActiveModal("help")}
        onOpenHost={() => setActiveModal("host")}
        onInteract={handleInteract}
      />

      {/* Expanded Full-Screen 2D School Canvas */}
      <SchoolCanvas
        player={player}
        teammates={teammates}
        interactiveTarget={interactiveTarget}
      />

      {/* Floating Host Live Broadcast Banner */}
      {broadcastBanner && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-rose-900 to-rose-700 border-2 border-rose-400 px-5 py-2 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-200 max-w-xl">
          <Radio className="text-white animate-pulse shrink-0" size={18} />
          <div className="flex-1 truncate">
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-200 block">
              Live Facilitator Broadcast
            </span>
            <span className="text-xs font-black text-white truncate block">
              {broadcastBanner}
            </span>
          </div>
          <button
            onClick={() => setBroadcastBanner(null)}
            className="text-white hover:text-rose-200 font-bold ml-2 cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Modals & Overlays */}
      {showLobby && (
        <LobbyModal
          currentSessionCode={sessionCode}
          currentTeamId={teamState.teamId}
          currentName={player.name}
          currentAvatar={player.avatar}
          isTournamentStarted={isGameStarted}
          onJoinSquad={handleJoinSquad}
          onHostStartTournament={handleHostStartTournament}
          onOpenHostDashboard={() => setActiveModal("host")}
        />
      )}

      {showStorylineTutorial && (
        <StorylineTutorialModal
          playerName={player.name}
          teamName={teamState.teamName}
          onComplete={() => setShowStorylineTutorial(false)}
        />
      )}

      {activeModal === "docViewer" && selectedFileToView && (
        <DocumentViewerModal
          file={selectedFileToView}
          isAlreadyVerified={Boolean(
            selectedFileToView.checklistId &&
              teamState.checklistStatus[selectedFileToView.checklistId]
          )}
          verdictStatus={
            selectedFileToView.checklistId
              ? teamState.checklistStatus[selectedFileToView.checklistId]
              : undefined
          }
          isPinned={Boolean(teamState.collectedEvidence.some((ev) => ev.id === selectedFileToView.id))}
          onTogglePin={handleTogglePinEvidence}
          onClose={() => {
            setActiveModal("directory");
            setSelectedFileToView(null);
          }}
        />
      )}

      {activeModal === "directory" && (
        <RoomDirectoryModal
          currentRoomId={player.currentRoomId}
          verifiedChecklistStatus={teamState.checklistStatus}
          onOpenFile={(file) => {
            setSelectedFileToView(file);
            setActiveModal("docViewer");
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "echo" && (
        <EchoChatModal
          coins={teamState.coins}
          activeCaseId={teamState.activeCaseId}
          onSpendCoins={handleSpendCoins}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "keypad" && (
        <KeypadModal
          activeCaseId={activeCase.id}
          echoFakePasscode={activeCase.echoFakePasscode}
          truePasscode={activeCase.truePasscode}
          riddle={activeCase.riddle}
          onCodeSuccess={() => handleSolveCase(activeCase.id)}
          onCodeFailure={() => {
            setTeamState((prev) => ({
              ...prev,
              score: Math.max(0, prev.score - 25),
            }));
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "map" && (
        <MapOverviewModal
          player={player}
          teammates={teammates}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "board" && (
        <InvestigationBoardModal
          playerName={player.name}
          coins={teamState.coins}
          activeCaseId={teamState.activeCaseId}
          casesStatus={teamState.casesStatus}
          checklistStatus={teamState.checklistStatus}
          collectedEvidence={teamState.collectedEvidence}
          solvedCount={teamState.solvedCount}
          onSetActiveCase={(caseId) =>
            setTeamState((prev) => ({ ...prev, activeCaseId: caseId }))
          }
          onSolveCase={handleSolveCase}
          onEvaluateEvidence={handleEvaluateFile}
          onTogglePinEvidence={handleTogglePinEvidence}
          onSpendCoins={handleSpendCoins}
          onOpenKeypad={() => setActiveModal("keypad")}
          onOpenFinalOverride={() => setActiveModal("override")}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "override" && (
        <FinalOverrideModal
          score={teamState.score}
          coins={teamState.coins}
          timerSec={timerSec}
          onEscapeSuccess={(finalScore) => {
            fetch("/api/tournament", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "UPDATE_SQUAD_PROGRESS",
                payload: {
                  roomCode: sessionCode,
                  escaped: true,
                  score: finalScore,
                },
              }),
            }).catch(() => {});

            setTeamState((prev) => ({
              ...prev,
              score: finalScore,
              activityFeed: [
                {
                  id: `final-escape-${Date.now()}`,
                  playerName: player.name,
                  action: `successfully overrode the campus lockdown! Final score: ${finalScore} / 1,000 PTS!`,
                  timestamp: "04:55 PM",
                },
                ...prev.activityFeed,
              ],
            }));
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "host" && (
        <HostDashboardModal
          currentTimerSec={timerSec}
          currentTeamState={teamState}
          isGameStarted={isGameStarted}
          sessionCode={sessionCode}
          teamCapacity={teamCapacity}
          onSetTimerSec={setTimerSec}
          onSetSessionCode={setSessionCode}
          onSetTeamCapacity={setTeamCapacity}
          onStartTournament={handleHostStartTournament}
          onBroadcastAnnouncement={(msg) => {
            setTeamState((prev) => ({
              ...prev,
              activityFeed: [
                {
                  id: `host-broadcast-${Date.now()}`,
                  playerName: "Seminar Host",
                  action: `broadcasted: "${msg}"`,
                  timestamp: "04:52 PM",
                },
                ...prev.activityFeed,
              ],
            }));
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "help" && (
        <HelpModal onClose={() => setActiveModal(null)} />
      )}
    </main>
  );
}
