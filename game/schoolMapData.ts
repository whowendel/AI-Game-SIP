export interface RoomDecor {
  type: "rug" | "plant" | "lantern" | "painting" | "clock" | "window";
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface InteractiveObject {
  id: string;
  name: string;
  type:
    | "computer"
    | "server"
    | "cctv"
    | "bookshelf"
    | "filing_cabinet"
    | "desk"
    | "lab_bench"
    | "board"
    | "fountain"
    | "master_lock";
  x: number;
  y: number;
  width: number;
  height: number;
  interactable: boolean;
}

export interface RoomDefinition {
  id: string;
  name: string;
  number: number;
  shortDesc: string;
  x: number;
  y: number;
  width: number;
  height: number;
  floorType: "wood" | "dark_wood" | "tiles" | "tech_slate" | "linoleum";
  wallColor: string;
  door: {
    x: number;
    y: number;
    width: number;
    height: number;
    facing: "top" | "bottom" | "left" | "right";
  };
  decor: RoomDecor[];
  objects: InteractiveObject[];
}

// Expanded Big Campus Dimensions (1680 x 1060)
export const MAP_WIDTH = 1680;
export const MAP_HEIGHT = 1060;

export const ROOMS: RoomDefinition[] = [
  // Top Row (Rooms 1, 3, 2, 4) - Expanded
  {
    id: "classroom",
    name: "Classroom 3-B",
    number: 1,
    shortDesc: "Student desks, announcement boards, and personal lockers.",
    x: 60,
    y: 50,
    width: 340,
    height: 250,
    floorType: "wood",
    wallColor: "#5b8bb0",
    door: { x: 200, y: 295, width: 70, height: 10, facing: "bottom" },
    decor: [
      { type: "painting", x: 120, y: 55, width: 90, height: 26 },
      { type: "lantern", x: 80, y: 62 },
      { type: "lantern", x: 330, y: 62 },
      { type: "rug", x: 110, y: 150, width: 160, height: 100 },
      { type: "plant", x: 350, y: 250 },
    ],
    objects: [
      { id: "cr-desk-1", name: "Teacher's Desk", type: "desk", x: 90, y: 85, width: 75, height: 48, interactable: true },
      { id: "cr-board", name: "Student Bulletin", type: "board", x: 200, y: 60, width: 100, height: 24, interactable: true },
      { id: "cr-lockers", name: "Locker Rows", type: "filing_cabinet", x: 75, y: 160, width: 40, height: 95, interactable: true },
    ],
  },
  {
    id: "computer_lab",
    name: "Computer Laboratory",
    number: 3,
    shortDesc: "Network servers, student workstations, and digital access logs.",
    x: 450,
    y: 50,
    width: 350,
    height: 250,
    floorType: "tech_slate",
    wallColor: "#475569",
    door: { x: 590, y: 295, width: 70, height: 10, facing: "bottom" },
    decor: [
      { type: "lantern", x: 470, y: 62 },
      { type: "lantern", x: 750, y: 62 },
      { type: "rug", x: 550, y: 140, width: 160, height: 95 },
      { type: "plant", x: 750, y: 250 },
    ],
    objects: [
      { id: "comp-server", name: "Network Server Tower", type: "server", x: 475, y: 80, width: 50, height: 68, interactable: true },
      { id: "comp-term-1", name: "Terminal Station 04", type: "computer", x: 565, y: 90, width: 65, height: 45, interactable: true },
      { id: "comp-term-2", name: "Terminal Station 09", type: "computer", x: 680, y: 90, width: 65, height: 45, interactable: true },
    ],
  },
  {
    id: "library",
    name: "School Library",
    number: 2,
    shortDesc: "Archived encyclopedias, history ledgers, and catalog computers.",
    x: 850,
    y: 50,
    width: 360,
    height: 250,
    floorType: "dark_wood",
    wallColor: "#52796f",
    door: { x: 995, y: 295, width: 70, height: 10, facing: "bottom" },
    decor: [
      { type: "clock", x: 870, y: 70 },
      { type: "lantern", x: 920, y: 62 },
      { type: "lantern", x: 1150, y: 62 },
      { type: "rug", x: 900, y: 150, width: 190, height: 100 },
      { type: "plant", x: 1160, y: 250 },
      { type: "plant", x: 870, y: 250 },
    ],
    objects: [
      { id: "lib-shelf-1", name: "Historical Archives", type: "bookshelf", x: 895, y: 80, width: 110, height: 45, interactable: true },
      { id: "lib-shelf-2", name: "Science Periodicals", type: "bookshelf", x: 1045, y: 80, width: 110, height: 45, interactable: true },
      { id: "lib-desk", name: "Librarian Catalog Terminal", type: "computer", x: 940, y: 180, width: 75, height: 50, interactable: true },
    ],
  },
  {
    id: "faculty_room",
    name: "Faculty Room",
    number: 4,
    shortDesc: "Faculty binders, staff notice boards, and student attendance logs.",
    x: 1260,
    y: 50,
    width: 360,
    height: 250,
    floorType: "wood",
    wallColor: "#7e5a65",
    door: { x: 1405, y: 295, width: 70, height: 10, facing: "bottom" },
    decor: [
      { type: "painting", x: 1340, y: 55, width: 80, height: 26 },
      { type: "lantern", x: 1280, y: 62 },
      { type: "lantern", x: 1570, y: 62 },
      { type: "rug", x: 1320, y: 150, width: 170, height: 95 },
      { type: "plant", x: 1570, y: 250 },
    ],
    objects: [
      { id: "fac-file", name: "Confidential Records Cabinet", type: "filing_cabinet", x: 1285, y: 85, width: 50, height: 60, interactable: true },
      { id: "fac-desk", name: "Department Head Desk", type: "desk", x: 1375, y: 90, width: 85, height: 50, interactable: true },
      { id: "fac-board", name: "Staff Duty Calendar", type: "board", x: 1500, y: 60, width: 75, height: 28, interactable: true },
    ],
  },

  // Middle Row Center Left & Center Right (Rooms 5 & 6)
  {
    id: "clinic",
    name: "School Clinic",
    number: 5,
    shortDesc: "First-aid supplies, patient sign-in ledger, and health reports.",
    x: 60,
    y: 390,
    width: 310,
    height: 270,
    floorType: "tiles",
    wallColor: "#4a7c59",
    door: { x: 365, y: 495, width: 10, height: 70, facing: "right" },
    decor: [
      { type: "lantern", x: 90, y: 405 },
      { type: "rug", x: 160, y: 480, width: 110, height: 100 },
      { type: "plant", x: 80, y: 610 },
    ],
    objects: [
      { id: "clinic-cabinet", name: "Medical Records Locker", type: "filing_cabinet", x: 85, y: 420, width: 50, height: 62, interactable: true },
      { id: "clinic-desk", name: "Nurse Sign-In Desk", type: "desk", x: 175, y: 430, width: 75, height: 50, interactable: true },
    ],
  },
  {
    id: "canteen",
    name: "School Canteen",
    number: 6,
    shortDesc: "Dining counters, student announcements, and cashier log terminal.",
    x: 1310,
    y: 390,
    width: 310,
    height: 270,
    floorType: "tiles",
    wallColor: "#b2675e",
    door: { x: 1305, y: 495, width: 10, height: 70, facing: "left" },
    decor: [
      { type: "lantern", x: 1570, y: 405 },
      { type: "rug", x: 1370, y: 480, width: 150, height: 100 },
      { type: "plant", x: 1570, y: 610 },
    ],
    objects: [
      { id: "cant-board", name: "Cafeteria Notice Board", type: "board", x: 1345, y: 400, width: 80, height: 28, interactable: true },
      { id: "cant-pos", name: "Cashier POS Terminal", type: "computer", x: 1485, y: 420, width: 65, height: 50, interactable: true },
    ],
  },

  // Bottom Row (Rooms 7, 8, 9, 10) - Expanded
  {
    id: "science_lab",
    name: "Science Laboratory",
    number: 7,
    shortDesc: "Chemical hoods, lab experiment benches, and HVAC sensors.",
    x: 60,
    y: 740,
    width: 340,
    height: 270,
    floorType: "linoleum",
    wallColor: "#4b6584",
    door: { x: 195, y: 735, width: 70, height: 10, facing: "top" },
    decor: [
      { type: "lantern", x: 90, y: 755 },
      { type: "lantern", x: 350, y: 755 },
      { type: "rug", x: 140, y: 850, width: 150, height: 90 },
      { type: "plant", x: 80, y: 960 },
    ],
    objects: [
      { id: "sci-sensor", name: "HVAC Sensor Node", type: "server", x: 95, y: 780, width: 50, height: 58, interactable: true },
      { id: "sci-bench", name: "Chemistry Workstation", type: "lab_bench", x: 185, y: 785, width: 105, height: 52, interactable: true },
      { id: "sci-safety", name: "Hazard Safety Manual", type: "filing_cabinet", x: 95, y: 885, width: 45, height: 58, interactable: true },
    ],
  },
  {
    id: "student_council",
    name: "Student Council Office",
    number: 8,
    shortDesc: "Official campus flyers, draft notices, and council laptops.",
    x: 450,
    y: 740,
    width: 350,
    height: 270,
    floorType: "wood",
    wallColor: "#8854d0",
    door: { x: 590, y: 735, width: 70, height: 10, facing: "top" },
    decor: [
      { type: "lantern", x: 475, y: 755 },
      { type: "lantern", x: 750, y: 755 },
      { type: "rug", x: 535, y: 850, width: 160, height: 95 },
      { type: "plant", x: 750, y: 960 },
    ],
    objects: [
      { id: "sc-computer", name: "Council President PC", type: "computer", x: 485, y: 780, width: 70, height: 48, interactable: true },
      { id: "sc-binder", name: "Broadcast Draft Binder", type: "desk", x: 600, y: 780, width: 85, height: 50, interactable: true },
      { id: "sc-board", name: "Council Event Board", type: "board", x: 495, y: 910, width: 95, height: 28, interactable: true },
    ],
  },
  {
    id: "principals_office",
    name: "Principal's Office",
    number: 9,
    shortDesc: "Administrative seals, maintenance logs, and official records.",
    x: 850,
    y: 740,
    width: 360,
    height: 270,
    floorType: "dark_wood",
    wallColor: "#a55eea",
    door: { x: 995, y: 735, width: 70, height: 10, facing: "top" },
    decor: [
      { type: "clock", x: 875, y: 760 },
      { type: "lantern", x: 920, y: 755 },
      { type: "lantern", x: 1150, y: 755 },
      { type: "rug", x: 910, y: 850, width: 180, height: 100 },
      { type: "plant", x: 1155, y: 960 },
      { type: "plant", x: 870, y: 960 },
    ],
    objects: [
      { id: "pr-desk", name: "Executive Principal Desk", type: "desk", x: 920, y: 785, width: 105, height: 55, interactable: true },
      { id: "pr-safe", name: "Locked Document Safe", type: "filing_cabinet", x: 870, y: 795, width: 45, height: 52, interactable: true },
      { id: "pr-pc", name: "Administration Terminal", type: "computer", x: 1065, y: 790, width: 65, height: 48, interactable: true },
    ],
  },
  {
    id: "security_office",
    name: "Security Office",
    number: 10,
    shortDesc: "CCTV surveillance monitors, keycard badges, and lockout panel.",
    x: 1260,
    y: 740,
    width: 360,
    height: 270,
    floorType: "tech_slate",
    wallColor: "#2d3436",
    door: { x: 1405, y: 735, width: 70, height: 10, facing: "top" },
    decor: [
      { type: "lantern", x: 1285, y: 755 },
      { type: "lantern", x: 1570, y: 755 },
      { type: "rug", x: 1340, y: 850, width: 160, height: 95 },
      { type: "plant", x: 1570, y: 960 },
    ],
    objects: [
      { id: "sec-cctv", name: "CCTV Surveillance Matrix", type: "cctv", x: 1285, y: 775, width: 95, height: 58, interactable: true },
      { id: "sec-badge", name: "Keycard Access Terminal", type: "computer", x: 1415, y: 780, width: 70, height: 48, interactable: true },
      { id: "sec-panel", name: "Master Security Override", type: "master_lock", x: 1295, y: 900, width: 105, height: 40, interactable: true },
    ],
  },
];

// Campus Center Landmarks (Spacious Lobby)
export const LOCKED_MAIN_EXIT = {
  name: "Locked Main Campus Exit",
  x: 750,
  y: 495,
  width: 180,
  height: 70,
};

export const WATER_FOUNTAIN = {
  name: "Filtered Drinking Fountain",
  x: 645,
  y: 505,
  width: 50,
  height: 50,
};

export const ECHO_MONITOR = {
  name: "ECHO Hologram Console",
  x: 985,
  y: 500,
  width: 70,
  height: 58,
};
