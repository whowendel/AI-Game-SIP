import { ROOMS, RoomDefinition, LOCKED_MAIN_EXIT, WATER_FOUNTAIN, ECHO_MONITOR, MAP_WIDTH, MAP_HEIGHT } from "./schoolMapData";

export interface PlayerState {
  id: string;
  name: string;
  avatar: string; // "alex" | "sam" | "maya" | "chris"
  x: number;
  y: number;
  direction: "up" | "down" | "left" | "right";
  moving: boolean;
  currentRoomId: string | null;
  fountainUsed: boolean;
}

export interface InteractiveTarget {
  type: "door" | "object" | "exit" | "fountain" | "echo";
  id: string;
  name: string;
  actionText: string;
  roomId?: string;
}

export const STUDENT_AVATARS: Record<
  string,
  { name: string; title: string; color: string; badge: string; hairColor: string }
> = {
  alex: {
    name: "Alex",
    title: "Student Investigator",
    color: "#22c55e",
    badge: "🧢",
    hairColor: "#78350f",
  },
  sam: {
    name: "Sam",
    title: "Student Investigator",
    color: "#06b6d4",
    badge: "👓",
    hairColor: "#1e293b",
  },
  maya: {
    name: "Maya",
    title: "Student Investigator",
    color: "#f59e0b",
    badge: "🎀",
    hairColor: "#d97706",
  },
  chris: {
    name: "Chris",
    title: "Student Investigator",
    color: "#a855f7",
    badge: "⭐",
    hairColor: "#475569",
  },
};

// Check if a point is inside a rectangle
export function isPointInRect(
  px: number,
  py: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): boolean {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

// Find which room a coordinate is inside
export function getRoomAtPosition(x: number, y: number): RoomDefinition | null {
  for (const room of ROOMS) {
    if (isPointInRect(x, y, room.x, room.y, room.width, room.height)) {
      return room;
    }
  }
  return null;
}

// Determine if moving to (nextX, nextY) is blocked by exterior walls
export function checkCollision(
  nextX: number,
  nextY: number,
  currentRoomId: string | null
): { blocked: boolean; allowedRoomId: string | null } {
  const padding = 20;
  if (
    nextX < padding ||
    nextX > MAP_WIDTH - padding ||
    nextY < padding ||
    nextY > MAP_HEIGHT - padding
  ) {
    return { blocked: true, allowedRoomId: currentRoomId };
  }

  const destinationRoom = getRoomAtPosition(nextX, nextY);

  if (currentRoomId === null && destinationRoom !== null) {
    const door = destinationRoom.door;
    const nearDoor =
      nextX >= door.x - 15 &&
      nextX <= door.x + door.width + 15 &&
      nextY >= door.y - 15 &&
      nextY <= door.y + door.height + 15;

    if (!nearDoor) {
      return { blocked: true, allowedRoomId: null };
    }
    return { blocked: false, allowedRoomId: destinationRoom.id };
  }

  if (currentRoomId !== null) {
    const room = ROOMS.find((r) => r.id === currentRoomId);
    if (room) {
      if (!isPointInRect(nextX, nextY, room.x, room.y, room.width, room.height)) {
        const door = room.door;
        const nearDoor =
          nextX >= door.x - 20 &&
          nextX <= door.x + door.width + 20 &&
          nextY >= door.y - 20 &&
          nextY <= door.y + door.height + 20;

        if (!nearDoor) {
          return { blocked: true, allowedRoomId: currentRoomId };
        }
        return { blocked: false, allowedRoomId: null };
      }
    }
  }

  return { blocked: false, allowedRoomId: currentRoomId };
}

// Detect nearest interactive object or door
export function getNearbyInteractable(
  player: PlayerState
): InteractiveTarget | null {
  const interactRadius = 45;

  if (player.currentRoomId === null) {
    for (const room of ROOMS) {
      const doorCenterX = room.door.x + room.door.width / 2;
      const doorCenterY = room.door.y + room.door.height / 2;
      const dist = Math.hypot(player.x - doorCenterX, player.y - doorCenterY);
      if (dist < interactRadius) {
        return {
          type: "door",
          id: `door-${room.id}`,
          name: room.name,
          actionText: `[E] Enter ${room.name}`,
          roomId: room.id,
        };
      }
    }
  } else {
    const currentRoom = ROOMS.find((r) => r.id === player.currentRoomId);
    if (currentRoom) {
      const doorCenterX = currentRoom.door.x + currentRoom.door.width / 2;
      const doorCenterY = currentRoom.door.y + currentRoom.door.height / 2;
      const dist = Math.hypot(player.x - doorCenterX, player.y - doorCenterY);
      if (dist < interactRadius) {
        return {
          type: "door",
          id: `exit-${currentRoom.id}`,
          name: "Main Hallway",
          actionText: `[E] Exit to Hallway`,
          roomId: "hallway",
        };
      }
    }
  }

  if (player.currentRoomId !== null) {
    const currentRoom = ROOMS.find((r) => r.id === player.currentRoomId);
    if (currentRoom) {
      for (const obj of currentRoom.objects) {
        if (!obj.interactable) continue;
        const objCenterX = obj.x + obj.width / 2;
        const objCenterY = obj.y + obj.height / 2;
        const dist = Math.hypot(player.x - objCenterX, player.y - objCenterY);
        if (dist < interactRadius + 15) {
          return {
            type: "object",
            id: obj.id,
            name: obj.name,
            actionText: `[E] Inspect ${obj.name}`,
            roomId: currentRoom.id,
          };
        }
      }
    }
  }

  if (player.currentRoomId === null) {
    const fX = WATER_FOUNTAIN.x + WATER_FOUNTAIN.width / 2;
    const fY = WATER_FOUNTAIN.y + WATER_FOUNTAIN.height / 2;
    if (Math.hypot(player.x - fX, player.y - fY) < interactRadius) {
      return {
        type: "fountain",
        id: "fountain-recharge",
        name: WATER_FOUNTAIN.name,
        actionText: !player.fountainUsed
          ? "[E] Drink Cold Water (+10 Coins)"
          : "[E] Drinking Fountain (Clean & Flowing)",
      };
    }

    const echoX = ECHO_MONITOR.x + ECHO_MONITOR.width / 2;
    const echoY = ECHO_MONITOR.y + ECHO_MONITOR.height / 2;
    if (Math.hypot(player.x - echoX, player.y - echoY) < interactRadius + 15) {
      return {
        type: "echo",
        id: "echo-holo",
        name: "ECHO Security Terminal",
        actionText: "[E] Question ECHO AI (1 Coin/Query)",
      };
    }

    const exitX = LOCKED_MAIN_EXIT.x + LOCKED_MAIN_EXIT.width / 2;
    const exitY = LOCKED_MAIN_EXIT.y + LOCKED_MAIN_EXIT.height / 2;
    if (Math.hypot(player.x - exitX, player.y - exitY) < interactRadius + 20) {
      return {
        type: "exit",
        id: "main-exit-gate",
        name: LOCKED_MAIN_EXIT.name,
        actionText: "[E] Inspect Main Exit (Lockdown Active)",
      };
    }
  }

  return null;
}
