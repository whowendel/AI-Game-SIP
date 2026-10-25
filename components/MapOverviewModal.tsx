"use client";

import React from "react";
import { ROOMS, LOCKED_MAIN_EXIT } from "@/game/schoolMapData";
import { PlayerState, STUDENT_AVATARS } from "@/game/playerEngine";
import { Map, X, MapPin } from "lucide-react";

interface MapOverviewModalProps {
  player: PlayerState;
  teammates: PlayerState[];
  onClose: () => void;
}

export function MapOverviewModal({
  player,
  teammates,
  onClose,
}: MapOverviewModalProps) {
  const allPlayers = [player, ...teammates];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-[#0f172a] rounded-3xl border-4 border-slate-700 p-5 shadow-2xl text-slate-100 animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-red-500 hover:bg-red-400 border-2 border-red-700 text-white flex items-center justify-center shadow-lg cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 border-b-2 border-slate-800 pb-3 mb-4">
          <Map className="text-amber-400" size={24} />
          <div>
            <h2 className="text-lg font-black uppercase tracking-wide text-slate-100">
              Campus Security Blueprint
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              10 Explorable Rooms &bull; 1 Movement Energy to enter any room
            </p>
          </div>
        </div>

        {/* 10 Rooms Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {ROOMS.map((room) => {
            const playersInRoom = allPlayers.filter((p) => p.currentRoomId === room.id);

            return (
              <div
                key={room.id}
                className={`p-3 rounded-2xl border-2 transition ${
                  player.currentRoomId === room.id
                    ? "bg-amber-950/40 border-amber-500 shadow-md"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-black text-amber-400 bg-amber-950 px-2 py-0.5 rounded-md">
                    Rm {room.number}
                  </span>
                  {player.currentRoomId === room.id && (
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded-sm">
                      You are here
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-xs text-slate-100 mt-1.5">
                  {room.name}
                </h3>
                <p className="text-[11px] text-slate-400 leading-snug mt-1 font-medium">
                  {room.shortDesc}
                </p>

                {/* Players currently inside this room */}
                {playersInRoom.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap gap-1">
                    {playersInRoom.map((p) => {
                      const av = STUDENT_AVATARS[p.avatar] || STUDENT_AVATARS["alex"];
                      return (
                        <span
                          key={p.id}
                          className="text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-1"
                          style={{
                            backgroundColor: `${av.color}30`,
                            color: av.color,
                          }}
                        >
                          <MapPin size={10} />
                          {p.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Gates Alert */}
        <div className="mt-4 p-3 bg-red-950/60 border-2 border-red-700 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-red-200 font-bold">
            <span className="text-lg">🔒</span>
            <span>
              <strong>{LOCKED_MAIN_EXIT.name}:</strong> All exits locked by ECHO. Solve all 5 cases to unlock.
            </span>
          </div>
          <button
            onClick={onClose}
            className="btn-cartoon-green px-4 py-1.5 rounded-xl font-black text-xs uppercase cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
}
