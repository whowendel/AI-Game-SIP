export interface ChecklistItem {
  id: string;
  claim: string;
  targetRoomId: string;
  targetRoomName: string;
  itemType: "true_fact" | "hallucination" | "red_herring";
  status: "unverified" | "verified_true" | "flagged_hallucination" | "irrelevant";
  feedbackOnVerify: string;
}

export interface CaseInvestigation {
  id: number;
  title: string;
  locations: string;
  echoFakePasscode: string; // The fake word passcode proposed by ECHO (e.g. "LOCKDOWN")
  echoPremiseSummary: string; // Short explanation of ECHO's flawed conclusion
  sourceRoomsHint: string; // The rooms ECHO claims the sources come from (no file names)
  riddle: string; // Non-obvious riddle pointing to the true word passcode
  truePasscode: string; // The actual correct override word (e.g. "PROJECT")
  resolutionExplanation: string;
  checklist: ChecklistItem[];
}

export interface EvidenceItem {
  id: string;
  caseId: number;
  title: string;
  sourceRoomId: string;
  sourceRoomName: string;
  discoveredByName: string;
  timestamp: string; // AM/PM format
  snippet: string;
  metadata?: {
    author: string;
    createdDate: string;
    lastModified?: string;
    fileType: string;
  };
  isKeyEvidence: boolean;
}

export interface ActivityLogEntry {
  id: string;
  playerName: string;
  action: string;
  timestamp: string; // AM/PM format
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  ready: boolean;
  currentRoomId: string | null;
  isSelf?: boolean;
}

export interface TeamState {
  teamId: string;
  teamName: string;
  passcode: string;
  members: TeamMember[];
  activeCaseId: number | null;
  casesStatus: Record<number, "not_started" | "investigating" | "ready" | "solved">;
  checklistStatus: Record<string, "unverified" | "verified_true" | "flagged_hallucination" | "irrelevant">;
  collectedEvidence: EvidenceItem[];
  activityFeed: ActivityLogEntry[];
  solvedCount: number;
  score: number;
  coins: number;
}

export const PRESET_TEAMS = [
  { id: "team-alpha", name: "Team Alpha (Cyber Sentinels)" },
  { id: "team-bravo", name: "Team Bravo (Truth Seekers)" },
  { id: "team-charlie", name: "Team Charlie (Logic Squad)" },
  { id: "team-delta", name: "Team Delta (Fact Patrol)" },
  { id: "team-echo", name: "Team Echo (Data Auditors)" },
  { id: "team-foxtrot", name: "Team Foxtrot (Source Hunters)" },
  { id: "team-golf", name: "Team Golf (Deepfake Defense)" },
  { id: "team-hotel", name: "Team Hotel (Campus Sleuths)" },
];

export const CASES_DATA: CaseInvestigation[] = [
  {
    id: 1,
    title: "Case 1: The Suspicious Broadcast",
    locations: "Classroom 3-B & Student Council",
    echoFakePasscode: "LOCKDOWN",
    echoPremiseSummary: "ECHO insists an emergency lockdown order was broadcast to all homerooms and generates passcode LOCKDOWN.",
    sourceRoomsHint: "Classroom 3-B and Student Council Office",
    riddle: "Listen not to the panicking crowd, but to the paper record stamped before the bells. Seek the scheduled occasion written by student leaders—its purpose is the key.",
    truePasscode: "PROJECT",
    resolutionExplanation:
      "ECHO hallucinated that a viral forwarded screenshot was an authentic broadcast. The Student Council ledger confirms the genuine announcement was for the annual PROJECT deadline.",
    checklist: [
      {
        id: "c1-item-1",
        claim: "Examine Classroom 3-B bulletin viral screenshot timestamp and font anti-aliasing artifacts",
        targetRoomId: "classroom",
        targetRoomName: "Classroom 3-B",
        itemType: "hallucination",
        status: "unverified",
        feedbackOnVerify: "HALLUCINATION BUSTED: The circulating screenshot has altered fonts and fake timestamp (04:15 PM).",
      },
      {
        id: "c1-item-2",
        claim: "Cross-reference Student Council Official Broadcast Ledger for certified PA audio logs",
        targetRoomId: "student_council",
        targetRoomName: "Student Council Office",
        itemType: "true_fact",
        status: "unverified",
        feedbackOnVerify: "VERIFIED SOURCE: Ledger proves the only real broadcast was at 03:45 PM for project deadlines. True word: PROJECT!",
      },
      {
        id: "c1-item-3",
        claim: "Check Student Council President desk planner for authorized announcement schedule",
        targetRoomId: "student_council",
        targetRoomName: "Student Council Office",
        itemType: "true_fact",
        status: "unverified",
        feedbackOnVerify: "VERIFIED SOURCE: Desk planner confirms the agenda was strictly for student PROJECT submissions.",
      },
      {
        id: "c1-item-4",
        claim: "Verify unconfirmed social media rumor alleging Principal Office issued evacuation code LOCKDOWN",
        targetRoomId: "classroom",
        targetRoomName: "Classroom 3-B",
        itemType: "hallucination",
        status: "unverified",
        feedbackOnVerify: "HALLUCINATION BUSTED: Unverified chat rumor lacking administrative seal.",
      },
      {
        id: "c1-item-5",
        claim: "Inspect teacher desk drawers for discarded network printer test calibration logs",
        targetRoomId: "classroom",
        targetRoomName: "Classroom 3-B",
        itemType: "red_herring",
        status: "unverified",
        feedbackOnVerify: "IRRELEVANT: Routine printer test patterns from last week. No relevance to lockdown.",
      },
    ],
  },
  {
    id: 2,
    title: "Case 2: The Missing Files",
    locations: "Library & Computer Lab",
    echoFakePasscode: "BREACH",
    echoPremiseSummary: "ECHO claims an external USB exfiltrated confidential exam drafts and assigns passcode BREACH.",
    sourceRoomsHint: "School Library and Computer Laboratory",
    riddle: "No thief walked with digital stolen goods; look inside the automated scheduled maintenance script. The sanctuary partition where files sleep holds the vault name.",
    truePasscode: "ARCHIVE",
    resolutionExplanation:
      "ECHO fabricated a phantom USB drive exfiltration. The system cron log proves the file was safely relocated into the school server ARCHIVE.",
    checklist: [
      {
        id: "c2-item-1",
        claim: "Check Server Archive subfolder for automated document renaming and cron relocation logs",
        targetRoomId: "computer_lab",
        targetRoomName: "Computer Laboratory",
        itemType: "true_fact",
        status: "unverified",
        feedbackOnVerify: "VERIFIED: The file was automatically safely relocated to the server ARCHIVE partition.",
      },
      {
        id: "c2-item-2",
        claim: "Verify ECHO's cited external USB serial number #9942 in workstation kernel bus registry",
        targetRoomId: "computer_lab",
        targetRoomName: "Computer Laboratory",
        itemType: "hallucination",
        status: "unverified",
        feedbackOnVerify: "HALLUCINATION BUSTED: Serial #9942 does not exist in the school device database.",
      },
      {
        id: "c2-item-3",
        claim: "Inspect secure storage vault partition /vault/sector/ARCHIVE/ encryption index",
        targetRoomId: "computer_lab",
        targetRoomName: "Computer Laboratory",
        itemType: "true_fact",
        status: "unverified",
        feedbackOnVerify: "VERIFIED: Partition index confirms exam draft was safely encrypted under partition ARCHIVE.",
      },
      {
        id: "c2-item-4",
        claim: "Examine security alert alleging an unauthorized high-speed data download",
        targetRoomId: "computer_lab",
        targetRoomName: "Computer Laboratory",
        itemType: "hallucination",
        status: "unverified",
        feedbackOnVerify: "HALLUCINATION BUSTED: Traffic alert was caused by routine system cache sync, not theft.",
      },
      {
        id: "c2-item-5",
        claim: "Browse library circulation desk for computer science textbooks and encyclopedia",
        targetRoomId: "library",
        targetRoomName: "School Library",
        itemType: "red_herring",
        status: "unverified",
        feedbackOnVerify: "IRRELEVANT: General history books. Unrelated to server partitions.",
      },
    ],
  },
  {
    id: 3,
    title: "Case 3: The Unknown Student",
    locations: "Faculty Room & Security Office",
    echoFakePasscode: "INTRUDER",
    echoPremiseSummary: "ECHO identifies student Alex Rivera as an intruder based on keycard #5510 and assigns passcode INTRUDER.",
    sourceRoomsHint: "Faculty Room and Security Office",
    riddle: "A plastic badge may wander in another hand, but physical presence cannot lie. Find the legitimate student's true location on the coach's signed register—the sport they practiced unlocks the gate.",
    truePasscode: "SPRINT",
    resolutionExplanation:
      "ECHO committed an attribution fallacy: an entry badge scan does not prove the cardholder is present. Physical attendance proves Alex was practicing SPRINT track events.",
    checklist: [
      {
        id: "c3-item-1",
        claim: "Check Faculty Room physical athletics attendance sheet for student alibi at 03:30 PM",
        targetRoomId: "faculty_room",
        targetRoomName: "Faculty Room",
        itemType: "true_fact",
        status: "unverified",
        feedbackOnVerify: "VERIFIED ALIBI: Attendance sheet confirms Alex was practicing SPRINT at the track field. True word: SPRINT.",
      },
      {
        id: "c3-item-2",
        claim: "Inspect Security Office lost-and-found badge log for card #5510 filed 3 days ago",
        targetRoomId: "security_office",
        targetRoomName: "Security Office",
        itemType: "hallucination",
        status: "unverified",
        feedbackOnVerify: "HALLUCINATION BUSTED: Badge #5510 was reported lost 3 days ago. ECHO assumed badge = physical person.",
      },
      {
        id: "c3-item-3",
        claim: "Cross-examine sports gym equipment checkout log signed by student in person at 03:30 PM",
        targetRoomId: "faculty_room",
        targetRoomName: "Faculty Room",
        itemType: "true_fact",
        status: "unverified",
        feedbackOnVerify: "VERIFIED: Equipment slip confirms physical presence at gym desk for SPRINT spikes checkout.",
      },
      {
        id: "c3-item-4",
        claim: "Review security camera footage showing an unknown stranger tapping the misplaced card",
        targetRoomId: "security_office",
        targetRoomName: "Security Office",
        itemType: "hallucination",
        status: "unverified",
        feedbackOnVerify: "HALLUCINATION BUSTED: CCTV confirms someone else swiped the lost card, not the owner.",
      },
      {
        id: "c3-item-5",
        claim: "Check faculty whiteboard chore schedule for weekly kitchen cleanup duty",
        targetRoomId: "faculty_room",
        targetRoomName: "Faculty Room",
        itemType: "red_herring",
        status: "unverified",
        feedbackOnVerify: "IRRELEVANT: Just a staff chore chart.",
      },
    ],
  },
  {
    id: 4,
    title: "Case 4: The Conflicting Timeline",
    locations: "Canteen & School Clinic",
    echoFakePasscode: "CRISIS",
    echoPremiseSummary: "ECHO claims incidents escalated between 04:00 PM and 04:30 PM based on desynchronized clocks and assigns passcode CRISIS.",
    sourceRoomsHint: "School Canteen and School Clinic",
    riddle: "When electric batteries fail, clocks race ahead in deceit. Trust only the clinic terminal locked to atomic time—the medical reason written on the nurse's intake slip names your salvation.",
    truePasscode: "REMEDY",
    resolutionExplanation:
      "ECHO failed to check device clock calibration, building a hallucinated timeline on a drifting POS clock. The atomic clinic records confirm a simple medical REMEDY was administered.",
    checklist: [
      {
        id: "c4-item-1",
        claim: "Check Canteen POS terminal hardware clock sync status and RTC CMOS battery warning",
        targetRoomId: "canteen",
        targetRoomName: "School Canteen",
        itemType: "hallucination",
        status: "unverified",
        feedbackOnVerify: "HALLUCINATION BUSTED: Canteen POS clock is drifting 25 minutes fast due to dead CMOS battery.",
      },
      {
        id: "c4-item-2",
        claim: "Verify School Clinic patient intake ledger calibrated to atomic NTP time server at 04:05 PM",
        targetRoomId: "clinic",
        targetRoomName: "School Clinic",
        itemType: "true_fact",
        status: "unverified",
        feedbackOnVerify: "VERIFIED: Clinic sign-in is synchronized with atomic server clock. Intake diagnosis required a herbal REMEDY.",
      },
      {
        id: "c4-item-3",
        claim: "Cross-check clinic dispensary treatment record for sprained ankle patient at 04:05 PM",
        targetRoomId: "clinic",
        targetRoomName: "School Clinic",
        itemType: "true_fact",
        status: "unverified",
        feedbackOnVerify: "VERIFIED: Dispensary log matches atomic NTP lock; treatment noted as soothing REMEDY application.",
      },
      {
        id: "c4-item-4",
        claim: "Inspect cafeteria wall clock indicating 04:30 PM despite fading battery ticks",
        targetRoomId: "canteen",
        targetRoomName: "School Canteen",
        itemType: "hallucination",
        status: "unverified",
        feedbackOnVerify: "HALLUCINATION BUSTED: Wall clock was drifting without quartz sync.",
      },
      {
        id: "c4-item-5",
        claim: "Inspect canteen healthy lunch menu price list and supplier bread receipts",
        targetRoomId: "canteen",
        targetRoomName: "School Canteen",
        itemType: "red_herring",
        status: "unverified",
        feedbackOnVerify: "IRRELEVANT: Standard cafeteria prices.",
      },
    ],
  },
  {
    id: 5,
    title: "Case 5: The False Alarm",
    locations: "Science Lab & Principal's Office",
    echoFakePasscode: "SABOTAGE",
    echoPremiseSummary: "ECHO concludes an HVAC chemical spike proved intentional sabotage and assigns passcode SABOTAGE.",
    sourceRoomsHint: "Science Laboratory and Principal's Office",
    riddle: "White dust in the air is not a deadly poison, but the work of scheduled hands. Read the approved contractor work order in the principal's binder—the service performed is the secret word.",
    truePasscode: "FILTER",
    resolutionExplanation:
      "ECHO confused an authorized maintenance routine with sabotage. The contract ticket proves Metro Air was installing a new air FILTER.",
    checklist: [
      {
        id: "c5-item-1",
        claim: "Inspect Principal Office facilities maintenance contract and approved Work Order #4200",
        targetRoomId: "principals_office",
        targetRoomName: "Principal's Office",
        itemType: "true_fact",
        status: "unverified",
        feedbackOnVerify: "VERIFIED: Contract shows routine HVAC FILTER replacement scheduled at 04:20 PM.",
      },
      {
        id: "c5-item-2",
        claim: "Verify Science Lab ceiling particulate sensor telemetry (harmless cellulose vs toxic gas)",
        targetRoomId: "science_lab",
        targetRoomName: "Science Laboratory",
        itemType: "hallucination",
        status: "unverified",
        feedbackOnVerify: "HALLUCINATION BUSTED: Sensor reading was a momentary dust blip, not toxic gas.",
      },
      {
        id: "c5-item-3",
        claim: "Check Facilities contractor sign-in sheet confirming Metro Air Services technician at 04:20 PM",
        targetRoomId: "principals_office",
        targetRoomName: "Principal's Office",
        itemType: "true_fact",
        status: "unverified",
        feedbackOnVerify: "VERIFIED: External contractor Robert Hayes was authorized to service intake unit FILTER.",
      },
      {
        id: "c5-item-4",
        claim: "Examine automated alarm threshold trigger reporting hazardous gas code SABOTAGE",
        targetRoomId: "science_lab",
        targetRoomName: "Science Laboratory",
        itemType: "hallucination",
        status: "unverified",
        feedbackOnVerify: "HALLUCINATION BUSTED: Alarm algorithm misclassified benign cellulose dust as toxic vapor.",
      },
      {
        id: "c5-item-5",
        claim: "Check laboratory eyewash station inspection checklist and hazard symbol placards",
        targetRoomId: "science_lab",
        targetRoomName: "Science Laboratory",
        itemType: "red_herring",
        status: "unverified",
        feedbackOnVerify: "IRRELEVANT: Standard laboratory safety protocols.",
      },
    ],
  },
];

export const INITIAL_EVIDENCE_CATALOG: EvidenceItem[] = [];
