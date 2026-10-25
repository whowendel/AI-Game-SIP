"use client";

import React, { useRef, useEffect } from "react";
import {
  ROOMS,
  LOCKED_MAIN_EXIT,
  WATER_FOUNTAIN,
  ECHO_MONITOR,
  MAP_WIDTH,
  MAP_HEIGHT,
  RoomDefinition,
} from "@/game/schoolMapData";
import { PlayerState, InteractiveTarget, STUDENT_AVATARS } from "@/game/playerEngine";
import {
  drawFloor,
  drawWalls,
  drawDecor,
  drawInteractiveObject,
  drawRoundRect,
} from "@/game/pixelArtRenderer";

interface SchoolCanvasProps {
  player: PlayerState;
  teammates: PlayerState[];
  interactiveTarget: InteractiveTarget | null;
}

// Student Character Avatar Renderer (Face + Hairstyle + Backpack)
function drawStudentAvatar(
  ctx: CanvasRenderingContext2D,
  char: PlayerState,
  isSelf: boolean
) {
  const { x, y, avatar, direction, moving } = char;
  const avatarInfo = STUDENT_AVATARS[avatar] || STUDENT_AVATARS["alex"];
  const bob = moving ? Math.sin(Date.now() / 90) * 2.5 : 0; // faster bob for faster walk speed

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(x, y + 16, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  const drawY = y + bob;

  // Shoes
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.ellipse(x - 5, drawY + 14, 4, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 5, drawY + 14, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Torso / Student Jacket
  ctx.fillStyle = avatarInfo.color;
  drawRoundRect(ctx, x - 10, drawY + 2, 20, 14, 4);
  ctx.fill();

  // White Shirt Collar
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(x - 3, drawY + 2, 6, 8);

  // Student Chibi Face
  ctx.fillStyle = "#fed7aa";
  ctx.beginPath();
  ctx.arc(x, drawY - 4, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#451a03";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Hairstyle
  ctx.fillStyle = avatarInfo.hairColor;
  ctx.beginPath();
  ctx.arc(x, drawY - 6, 11, Math.PI, 0);
  ctx.fill();

  // Avatar accessory (Cap / Glasses / Hairband)
  if (avatar === "alex") {
    // Green Cap
    ctx.fillStyle = "#16a34a";
    ctx.beginPath();
    ctx.arc(x, drawY - 8, 10, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#15803d";
    ctx.fillRect(x - 11, drawY - 8, 22, 3);
  } else if (avatar === "sam") {
    // Glasses
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x - 7, drawY - 5, 5, 5);
    ctx.strokeRect(x + 2, drawY - 5, 5, 5);
  } else if (avatar === "maya") {
    // Yellow Hair Ribbon
    ctx.fillStyle = "#facc15";
    ctx.fillRect(x - 10, drawY - 9, 20, 3);
  }

  // Eyes (Looking in direction)
  let eyeOffsetX = 0;
  let eyeOffsetY = 0;
  if (direction === "up") eyeOffsetY = -2;
  if (direction === "down") eyeOffsetY = 1;
  if (direction === "left") eyeOffsetX = -2;
  if (direction === "right") eyeOffsetX = 2;

  ctx.fillStyle = "#1e293b";
  if (direction !== "up") {
    ctx.beginPath();
    ctx.arc(x - 4 + eyeOffsetX, drawY - 3 + eyeOffsetY, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 4 + eyeOffsetX, drawY - 3 + eyeOffsetY, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = "#7c2d12";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x + eyeOffsetX, drawY + 1, 3, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  // Name Tag Bubble
  ctx.fillStyle = isSelf ? "rgba(234, 179, 8, 0.95)" : "rgba(15, 23, 42, 0.85)";
  const tagText = isSelf ? `⭐ ${char.name}` : char.name;
  ctx.font = "bold 10px sans-serif";
  const tw = ctx.measureText(tagText).width;
  drawRoundRect(ctx, x - tw / 2 - 5, drawY - 26, tw + 10, 14, 4);
  ctx.fill();

  ctx.fillStyle = isSelf ? "#422006" : "#f8fafc";
  ctx.textAlign = "center";
  ctx.fillText(tagText, x, drawY - 15);
}

export function SchoolCanvas({
  player,
  teammates,
  interactiveTarget,
}: SchoolCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // 1. Dark Vignette Boundary
      ctx.fillStyle = "#0c1017";
      ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

      // 2. Hallway & Lobby Flooring (Warm Parquet)
      ctx.fillStyle = "#a27052";
      ctx.fillRect(40, 40, MAP_WIDTH - 80, MAP_HEIGHT - 80);

      // Floor plank lines
      ctx.strokeStyle = "#805338";
      ctx.lineWidth = 1;
      const plankH = 26;
      const plankW = 75;
      let r = 0;
      for (let y = 40; y < MAP_HEIGHT - 40; y += plankH) {
        const offX = (r % 2) * (plankW / 2);
        for (let x = 40 - plankW; x < MAP_WIDTH - 40; x += plankW) {
          ctx.strokeRect(x + offX, y, plankW, plankH);
        }
        r++;
      }

      // Lobby Center Rug
      ctx.fillStyle = "#2c3e50";
      drawRoundRect(ctx, 480, 420, 480, 120, 12);
      ctx.fill();
      ctx.strokeStyle = "#f1c40f";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      drawRoundRect(ctx, 486, 426, 468, 108, 8);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Render 10 Rooms
      ROOMS.forEach((room: RoomDefinition) => {
        drawFloor(ctx, room);
        drawDecor(ctx, room.decor);
        room.objects.forEach((obj) => {
          drawInteractiveObject(ctx, obj);
        });
        drawWalls(ctx, room);

        // Room Header Title Pill
        ctx.fillStyle = "rgba(26, 36, 43, 0.85)";
        drawRoundRect(ctx, room.x + 8, room.y + 6, room.width - 16, 20, 5);
        ctx.fill();
        ctx.strokeStyle = "#4a2810";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = "#fef3c7";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          `Rm ${room.number}: ${room.name}`,
          room.x + room.width / 2,
          room.y + 20
        );
      });

      // 4. Render Locked Gates
      const gate = LOCKED_MAIN_EXIT;
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(gate.x - 4, gate.y + gate.height - 6, gate.width + 8, 12);

      ctx.fillStyle = "#1e293b";
      ctx.fillRect(gate.x, gate.y, gate.width, gate.height);
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 3;
      ctx.strokeRect(gate.x, gate.y, gate.width, gate.height);

      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      for (let bx = gate.x + 12; bx < gate.x + gate.width - 8; bx += 14) {
        ctx.beginPath();
        ctx.moveTo(bx, gate.y + 4);
        ctx.lineTo(bx, gate.y + gate.height - 4);
        ctx.stroke();
      }

      ctx.fillStyle = "#991b1b";
      ctx.fillRect(gate.x + gate.width / 2 - 40, gate.y + 14, 80, 26);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("🔒 LOCKED EXIT", gate.x + gate.width / 2, gate.y + 30);

      // 5. Drinking Fountain
      const wf = WATER_FOUNTAIN;
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(wf.x + 22, wf.y + wf.height, 18, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#0284c7";
      drawRoundRect(ctx, wf.x, wf.y + 12, wf.width, wf.height - 12, 6);
      ctx.fill();
      ctx.fillStyle = "#bae6fd";
      ctx.beginPath();
      ctx.arc(wf.x + wf.width / 2, wf.y + 10, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0369a1";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("💧 Fountain", wf.x + wf.width / 2, wf.y + wf.height + 11);

      // 6. ECHO Hologram
      const echo = ECHO_MONITOR;
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(echo.x + 30, echo.y + echo.height, 22, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#09090b";
      drawRoundRect(ctx, echo.x, echo.y, echo.width, echo.height, 8);
      ctx.fill();
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(echo.x + 30, echo.y + 20, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#09090b";
      ctx.fillRect(echo.x + 25, echo.y + 17, 10, 3);

      ctx.fillStyle = "#0891b2";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🤖 ECHO Terminal", echo.x + 30, echo.y + echo.height + 11);

      // 7. Render Teammates
      teammates.forEach((tm) => {
        drawStudentAvatar(ctx, tm, false);
      });

      // 8. Render Local Player
      const glow = ctx.createRadialGradient(
        player.x,
        player.y,
        15,
        player.x,
        player.y,
        140
      );
      glow.addColorStop(0, "rgba(254, 240, 138, 0.22)");
      glow.addColorStop(0.7, "rgba(254, 240, 138, 0.06)");
      glow.addColorStop(1, "rgba(254, 240, 138, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(player.x, player.y, 140, 0, Math.PI * 2);
      ctx.fill();

      drawStudentAvatar(ctx, player, true);

      // 9. Floating Interaction Bubble
      if (interactiveTarget) {
        const bubbleX = player.x;
        const bubbleY = player.y - 45;

        ctx.font = "bold 11px sans-serif";
        const textWidth = ctx.measureText(interactiveTarget.actionText).width;
        const bw = Math.max(140, textWidth + 24);

        ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
        drawRoundRect(ctx, bubbleX - bw / 2, bubbleY - 14, bw, 26, 8);
        ctx.fill();

        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.moveTo(bubbleX - 5, bubbleY + 12);
        ctx.lineTo(bubbleX + 5, bubbleY + 12);
        ctx.lineTo(bubbleX, bubbleY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#fef08a";
        ctx.textAlign = "center";
        ctx.fillText(interactiveTarget.actionText, bubbleX, bubbleY + 4);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [player, teammates, interactiveTarget]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#090d16] select-none">
      <canvas
        ref={canvasRef}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        className="w-full h-full max-h-[92vh] max-w-[98vw] object-contain drop-shadow-2xl"
      />
    </div>
  );
}
