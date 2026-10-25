"use client";

import React, { useState } from "react";
import { ROOM_DIRECTORIES, RoomFolder, SchoolFile } from "@/game/roomFilesData";
import { ROOMS } from "@/game/schoolMapData";
import {
  FolderTree,
  Folder,
  FolderOpen,
  FileText,
  FileCode,
  FileSpreadsheet,
  Lock,
  X,
  ChevronRight,
  HardDrive,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { sounds } from "@/lib/soundFX";

interface RoomDirectoryModalProps {
  currentRoomId: string | null;
  onOpenFile: (file: SchoolFile) => void;
  verifiedChecklistStatus: Record<string, string>;
  onClose: () => void;
}

export function RoomDirectoryModal({
  currentRoomId,
  onOpenFile,
  verifiedChecklistStatus,
  onClose,
}: RoomDirectoryModalProps) {
  const directory = currentRoomId ? ROOM_DIRECTORIES[currentRoomId] : null;
  const currentRoom = ROOMS.find((r) => r.id === currentRoomId);

  // Active expanded folder
  const [activeFolderId, setActiveFolderId] = useState<string | null>(
    directory && directory.folders.length > 0 ? directory.folders[0].id : null
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case "log":
      case "conf":
        return <FileCode size={16} className="text-cyan-400" />;
      case "roster":
        return <FileSpreadsheet size={16} className="text-emerald-400" />;
      default:
        return <FileText size={16} className="text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-[#0b1324] rounded-3xl border-4 border-slate-700 p-5 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col justify-between overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-500 hover:bg-red-400 border-2 border-red-700 text-white flex items-center justify-center shadow-lg cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header Bar */}
        <div className="flex items-center gap-3 border-b-2 border-slate-800 pb-3 mb-3 pr-8 select-none">
          <div className="w-10 h-10 rounded-2xl bg-amber-950/70 border-2 border-amber-500 flex items-center justify-center shadow-md">
            <FolderTree className="text-amber-400" size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black uppercase tracking-wider text-white">
                {directory
                  ? `${directory.roomName} &bull; File Repository`
                  : "Campus File System &bull; Local Access Terminal"}
              </h2>
              {currentRoom && (
                <span className="text-[10px] font-mono font-bold bg-slate-800 text-amber-300 px-2 py-0.5 rounded-full border border-slate-700">
                  Rm {currentRoom.number}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {directory
                ? directory.description
                : "You are currently in the hallway. Enter any room to access its localized files."}
            </p>
          </div>
        </div>

        {/* Directory Explorer Body */}
        {directory ? (
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3 overflow-hidden min-h-[350px]">
            {/* Left Column: Folders List */}
            <div className="sm:col-span-5 bg-slate-950/70 rounded-2xl border border-slate-800 p-2.5 overflow-y-auto space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Directory Folders:
              </span>
              {directory.folders.map((folder) => {
                const isSelected = activeFolderId === folder.id;
                return (
                  <button
                    key={folder.id}
                    onClick={() => {
                      sounds.playClick();
                      setActiveFolderId(folder.id);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-amber-950/60 border-amber-500 text-amber-200 shadow-md"
                        : "bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isSelected ? (
                        <FolderOpen size={16} className="text-amber-400 shrink-0" />
                      ) : (
                        <Folder size={16} className="text-slate-400 shrink-0" />
                      )}
                      <span className="font-mono text-xs font-bold truncate">
                        {folder.folderName}/
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded-md shrink-0">
                      {folder.files.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Files in Selected Folder */}
            <div className="sm:col-span-7 bg-slate-950/90 rounded-2xl border border-slate-800 p-3 overflow-y-auto flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                  Files in /
                  {directory.folders.find((f) => f.id === activeFolderId)?.folderName || "root"}:
                </span>

                <div className="space-y-2">
                  {directory.folders
                    .find((f) => f.id === activeFolderId)
                    ?.files.map((file) => {
                      const isEvaluated = Boolean(
                        file.checklistId && verifiedChecklistStatus[file.checklistId]
                      );

                      return (
                        <div
                          key={file.id}
                          onClick={() => {
                            sounds.playClick();
                            onOpenFile(file);
                          }}
                          className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                            isEvaluated
                              ? "bg-slate-900/40 border-slate-800 opacity-80 hover:opacity-100"
                              : "bg-slate-900 hover:bg-slate-800/90 border-slate-700 shadow-sm hover:border-amber-500"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="p-1.5 bg-slate-950 rounded-lg shrink-0">
                              {getFileIcon(file.fileType)}
                            </div>
                            <div className="truncate">
                              <h4 className="font-mono text-xs font-bold text-white truncate">
                                {file.name}
                              </h4>
                              <p className="text-[11px] text-slate-400 truncate">
                                {file.title}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isEvaluated ? (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                                  verifiedChecklistStatus[file.checklistId!] === "verified_true"
                                    ? "text-emerald-300 bg-emerald-950 border-emerald-600"
                                    : verifiedChecklistStatus[file.checklistId!] === "flagged_hallucination"
                                    ? "text-rose-300 bg-rose-950 border-rose-600"
                                    : "text-slate-300 bg-slate-900 border-slate-700"
                                }`}
                              >
                                <CheckCircle2 size={11} />
                                {verifiedChecklistStatus[file.checklistId!] === "verified_true"
                                  ? "Verified"
                                  : verifiedChecklistStatus[file.checklistId!] === "flagged_hallucination"
                                  ? "Hallucination"
                                  : "Irrelevant"}
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-slate-400">
                                {file.size}
                              </span>
                            )}
                            <button
                              type="button"
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] uppercase flex items-center gap-1 shadow-sm"
                            >
                              <Eye size={12} /> Read
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>Total records in sector: {directory.folders.reduce((acc, f) => acc + f.files.length, 0)} files</span>
                <span className="text-amber-300">Click any document to inspect</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-500">
              <Lock size={28} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase">
                Hallway Terminal Access Limited
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                You are standing in the central hallway. Walk into any of the 10 rooms (Classroom, Computer Lab, Clinic, Faculty Room, etc.) to browse its localized file repository.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Hotkey Shortcut: Press <strong className="text-amber-300">[F]</strong> to toggle files
          </span>
          <button
            onClick={onClose}
            className="btn-cartoon-green px-5 py-1.5 rounded-xl font-black text-xs uppercase cursor-pointer"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
}