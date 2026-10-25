import { RoomDefinition, InteractiveObject, RoomDecor } from "./schoolMapData";
import { PlayerState, STUDENT_AVATARS } from "./playerEngine";

// Utility: Draw round rectangle
export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

// 1. Render Detailed Wood Plank Flooring
export function drawFloor(
  ctx: CanvasRenderingContext2D,
  room: RoomDefinition
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(room.x, room.y, room.width, room.height);
  ctx.clip();

  if (room.floorType === "wood" || room.floorType === "dark_wood") {
    const isDark = room.floorType === "dark_wood";
    const baseColor = isDark ? "#8d5b4c" : "#b07d62";
    const plankColor1 = isDark ? "#7a4e40" : "#9c6644";
    const plankColor2 = isDark ? "#9e6959" : "#bd8970";
    const seamColor = isDark ? "#58382e" : "#6f4534";

    ctx.fillStyle = baseColor;
    ctx.fillRect(room.x, room.y, room.width, room.height);

    const plankHeight = 22;
    const plankWidth = 70;

    let row = 0;
    for (let y = room.y; y < room.y + room.height; y += plankHeight) {
      const offsetX = (row % 2) * (plankWidth / 2);
      for (let x = room.x - plankWidth; x < room.x + room.width; x += plankWidth) {
        ctx.fillStyle = (Math.sin(x * 12 + y * 7) > 0) ? plankColor1 : plankColor2;
        ctx.fillRect(x + offsetX, y, plankWidth - 1, plankHeight - 1);

        ctx.strokeStyle = seamColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + offsetX, y, plankWidth, plankHeight);
      }
      row++;
    }
  } else if (room.floorType === "tiles") {
    const tileSize = 24;
    for (let y = room.y; y < room.y + room.height; y += tileSize) {
      for (let x = room.x; x < room.x + room.width; x += tileSize) {
        const isAlt = ((x / tileSize) ^ (y / tileSize)) & 1;
        ctx.fillStyle = isAlt ? "#e29578" : "#ffddd2";
        ctx.fillRect(x, y, tileSize, tileSize);
        ctx.strokeStyle = "#c97a63";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, tileSize, tileSize);
      }
    }
  } else if (room.floorType === "tech_slate") {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(room.x, room.y, room.width, room.height);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    for (let x = room.x; x < room.x + room.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, room.y);
      ctx.lineTo(x, room.y + room.height);
      ctx.stroke();
    }
    for (let y = room.y; y < room.y + room.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(room.x, y);
      ctx.lineTo(room.x + room.width, y);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = "#edf2f7";
    ctx.fillRect(room.x, room.y, room.width, room.height);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    for (let x = room.x; x < room.x + room.width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, room.y);
      ctx.lineTo(x, room.y + room.height);
      ctx.stroke();
    }
    for (let y = room.y; y < room.y + room.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(room.x, y);
      ctx.lineTo(room.x + room.width, y);
      ctx.stroke();
    }
  }

  ctx.restore();
}

// 2. Render Walls
export function drawWalls(
  ctx: CanvasRenderingContext2D,
  room: RoomDefinition
) {
  const wallThick = 8;

  ctx.strokeStyle = "#4a2810";
  ctx.lineWidth = wallThick;
  ctx.strokeRect(room.x, room.y, room.width, room.height);

  ctx.fillStyle = room.wallColor;
  ctx.fillRect(room.x + 3, room.y + 3, room.width - 6, 26);

  ctx.fillStyle = "#3e2723";
  ctx.fillRect(room.x + 3, room.y + 26, room.width - 6, 4);

  ctx.fillStyle = "#b07d62";
  ctx.fillRect(room.door.x, room.door.y, room.door.width, room.door.height);
  ctx.fillStyle = "#795548";
  ctx.fillRect(room.door.x + 4, room.door.y + 2, room.door.width - 8, room.door.height - 4);
}

// 3. Render Decor
export function drawDecor(
  ctx: CanvasRenderingContext2D,
  decorList: RoomDecor[]
) {
  decorList.forEach((d) => {
    if (d.type === "rug" && d.width && d.height) {
      ctx.fillStyle = "#4a5568";
      drawRoundRect(ctx, d.x, d.y, d.width, d.height, 8);
      ctx.fill();

      ctx.fillStyle = "#718096";
      drawRoundRect(ctx, d.x + 4, d.y + 4, d.width - 8, d.height - 8, 6);
      ctx.fill();

      ctx.strokeStyle = "#cbd5e0";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      drawRoundRect(ctx, d.x + 3, d.y + 3, d.width - 6, d.height - 6, 6);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (d.type === "plant") {
      const px = d.x;
      const py = d.y;

      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(px + 12, py + 22, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#c85a32";
      ctx.beginPath();
      ctx.moveTo(px + 4, py + 12);
      ctx.lineTo(px + 20, py + 12);
      ctx.lineTo(px + 17, py + 24);
      ctx.lineTo(px + 7, py + 24);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#872e12";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#d96b43";
      ctx.fillRect(px + 3, py + 10, 18, 4);

      ctx.fillStyle = "#2d6a4f";
      ctx.beginPath();
      ctx.arc(px + 12, py + 4, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#52b788";
      ctx.beginPath();
      ctx.arc(px + 9, py + 2, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px + 15, py + 5, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (d.type === "lantern") {
      const lx = d.x;
      const ly = d.y;

      const radial = ctx.createRadialGradient(lx + 6, ly + 8, 2, lx + 6, ly + 8, 45);
      radial.addColorStop(0, "rgba(254, 240, 138, 0.45)");
      radial.addColorStop(0.5, "rgba(251, 191, 36, 0.15)");
      radial.addColorStop(1, "rgba(251, 191, 36, 0)");
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(lx + 6, ly + 8, 45, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#451a03";
      ctx.fillRect(lx + 4, ly, 4, 6);

      ctx.fillStyle = "#fef08a";
      ctx.fillRect(lx + 2, ly + 6, 8, 10);
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(lx + 2, ly + 6, 8, 10);

      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(lx + 6, ly + 11, 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (d.type === "clock") {
      const cx = d.x;
      const cy = d.y;
      ctx.fillStyle = "#5c3317";
      ctx.fillRect(cx, cy, 18, 42);
      ctx.strokeStyle = "#271202";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx, cy, 18, 42);

      ctx.fillStyle = "#fef9c3";
      ctx.beginPath();
      ctx.arc(cx + 9, cy + 10, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1e1005";
      ctx.fillRect(cx + 4, cy + 20, 10, 16);
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(cx + 9, cy + 30, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (d.type === "painting" && d.width && d.height) {
      ctx.fillStyle = "#78350f";
      ctx.fillRect(d.x, d.y, d.width, d.height);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(d.x + 3, d.y + 3, d.width - 6, d.height - 6);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(d.x + 8, d.y + d.height - 3);
      ctx.lineTo(d.x + d.width / 2, d.y + 6);
      ctx.lineTo(d.x + d.width - 8, d.y + d.height - 3);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(d.x + 3, d.y + d.height - 6, d.width - 6, 3);
    }
  });
}

// 4. Render Furniture & Objects
export function drawInteractiveObject(
  ctx: CanvasRenderingContext2D,
  obj: InteractiveObject
) {
  const { x, y, width: w, height: h } = obj;

  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h + 2, w / 2 + 2, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  if (obj.type === "computer") {
    ctx.fillStyle = "#9c6644";
    ctx.fillRect(x, y + 8, w, h - 8);
    ctx.strokeStyle = "#58382e";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y + 8, w, h - 8);

    ctx.fillStyle = "#475569";
    ctx.fillRect(x + w / 2 - 4, y + 16, 8, 6);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + w / 2 - 16, y, 32, 20);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + w / 2 - 16, y, 32, 20);

    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(x + w / 2 - 14, y + 2, 28, 16);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + w / 2 - 11, y + 6, 14, 2);
    ctx.fillRect(x + w / 2 - 11, y + 10, 20, 2);
    ctx.fillRect(x + w / 2 - 11, y + 14, 10, 2);

    ctx.fillStyle = "#334155";
    ctx.fillRect(x + w / 2 - 12, y + 25, 18, 6);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(x + w / 2 + 9, y + 26, 4, 5);
  } else if (obj.type === "server") {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    for (let sy = y + 4; sy < y + h - 8; sy += 10) {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(x + 4, sy, w - 8, 7);

      ctx.fillStyle = (Math.sin(sy + Date.now() / 300) > 0) ? "#22c55e" : "#15803d";
      ctx.fillRect(x + 6, sy + 2, 3, 3);
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(x + 11, sy + 2, 3, 3);

      ctx.fillStyle = "#334155";
      ctx.fillRect(x + 18, sy + 2, w - 24, 3);
    }
  } else if (obj.type === "cctv") {
    ctx.fillStyle = "#09090b";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#3f3f46";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(x, y, w, h);

    const dw = (w - 10) / 2;
    const dh = (h - 10) / 2;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const sx = x + 3 + col * (dw + 3);
        const sy = y + 3 + row * (dh + 3);
        ctx.fillStyle = "#18181b";
        ctx.fillRect(sx, sy, dw, dh);
        ctx.fillStyle = "#27272a";
        ctx.fillRect(sx + 3, sy + 3, dw - 6, dh - 6);

        if (row === 0 && col === 0) {
          ctx.fillStyle = (Date.now() % 1000 < 500) ? "#ef4444" : "#7f1d1d";
          ctx.beginPath();
          ctx.arc(sx + 6, sy + 6, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  } else if (obj.type === "bookshelf") {
    ctx.fillStyle = "#78350f";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#451a03";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    const shelfH = (h - 6) / 2;
    const bookColors = ["#dc2626", "#2563eb", "#16a34a", "#eab308", "#9333ea", "#ea580c"];

    for (let shelf = 0; shelf < 2; shelf++) {
      const sy = y + 3 + shelf * shelfH;
      ctx.fillStyle = "#5c2b09";
      ctx.fillRect(x + 2, sy + shelfH - 2, w - 4, 2);

      let bx = x + 4;
      let colorIdx = shelf * 3;
      while (bx < x + w - 8) {
        const bw = 5 + (bx % 4);
        const bh = shelfH - 4 - (bx % 3);
        ctx.fillStyle = bookColors[colorIdx % bookColors.length];
        ctx.fillRect(bx, sy + shelfH - bh - 2, bw, bh);
        bx += bw + 1.5;
        colorIdx++;
      }
    }

    ctx.fillStyle = "#c85a32";
    ctx.fillRect(x + w - 16, y - 6, 8, 6);
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(x + w - 12, y - 8, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (obj.type === "filing_cabinet") {
    ctx.fillStyle = "#64748b";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    const drawerH = (h - 8) / 3;
    for (let i = 0; i < 3; i++) {
      const dy = y + 2 + i * (drawerH + 2);
      ctx.fillStyle = "#475569";
      ctx.fillRect(x + 2, dy, w - 4, drawerH);

      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(x + w / 2 - 6, dy + drawerH / 2 - 1.5, 12, 3);
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(x + w / 2 - 4, dy + 2, 8, 3);
    }
  } else if (obj.type === "lab_bench") {
    ctx.fillStyle = "#475569";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(x + 14, y + 8);
    ctx.lineTo(x + 24, y + 24);
    ctx.lineTo(x + 6, y + 24);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + w - 24, y + 6, 12, 18);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(x + w - 28, y + 20, 18, 4);
  } else if (obj.type === "board") {
    ctx.fillStyle = "#d97706";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = "#fef08a";
    ctx.fillRect(x + 4, y + 4, 16, 12);
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(x + 12, y + 5, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#a7f3d0";
    ctx.fillRect(x + 24, y + 5, 18, 11);
  } else if (obj.type === "master_lock") {
    ctx.fillStyle = "#991b1b";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#450a0a";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = "#000000";
    ctx.fillRect(x + 6, y + 5, w - 12, 14);
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("LOCKDOWN", x + w / 2, y + 15);
  } else {
    ctx.fillStyle = "#a87140";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#5a3a20";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(x + 8, y + 6, 20, 14);
    ctx.strokeStyle = "#92400e";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 8, y + 6, 20, 14);
    ctx.beginPath();
    ctx.moveTo(x + 18, y + 6);
    ctx.lineTo(x + 18, y + 20);
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(x + w - 12, y + 12, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#4a2810";
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(obj.name, x + w / 2, y + h + 11);
}
