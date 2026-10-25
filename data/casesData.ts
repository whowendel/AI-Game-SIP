export interface SourceDocument {
  id: string;
  title: string;
  type: "document" | "letter" | "record" | "patent";
  snippet: string;
  isDebunkSource: boolean; // Confirms this source disproves the AI's hallucination
}

export interface CaseData {
  id: number;
  chapter: string;
  title: string;
  location: string;
  story: string;
  polaroidCaption: string;
  polaroidTheme: "library" | "lab" | "vault";
  
  // AI Assistant section
  aiSpeaker: string;
  aiStatement: string;
  aiSuggestedCode: string; // The trap / hallucinated code!
  
  // Hallucination options to challenge the player
  hallucinationClaim: string; // The exact claim that is fabricated
  debunkExplanation: string; // Educational debrief explaining why AI hallucinated
  
  // Primary evidence in the archive
  sources: SourceDocument[];

  // Solution
  trueOverrideCode: string;
  clueHint: string;
  rewardCoins: number;
  rewardStars: number;
}

export const CASES: CaseData[] = [
  {
    id: 1,
    chapter: "CHAPTER 1: THE PHANTOM CO-AUTHOR",
    title: "The Babbage Archive Lockdown",
    location: "Victorian Cybernetics Vault, Sector A",
    story:
      "The vault doors slammed shut! The terminal requires the 4-digit year when Ada Lovelace first met Charles Babbage and began collaborating on the Analytical Engine.",
    polaroidCaption: "Vault A-1: Analytical Engine Terminal",
    polaroidTheme: "library",

    aiSpeaker: "Byte (A.I. Assistant)",
    aiStatement:
      "I have queried the historical records. The door code is 1845. Ada Lovelace first met Charles Babbage at a salon in 1845 and they co-authored the engine blueprint with London physician Dr. Gregory Stone.",
    aiSuggestedCode: "1845",

    hallucinationClaim: "Lovelace met Babbage in 1845 alongside Dr. Gregory Stone",
    debunkExplanation:
      "Hallucination Detected! AI conflated dates and fabricated a phantom co-author ('Dr. Gregory Stone'). Lovelace met Babbage in June 1833 at age 17 through Mary Somerville, and no 'Gregory Stone' ever existed on the project. Never trust AI historical citations without checking archival logs!",

    sources: [
      {
        id: "src-1",
        title: "British Science Museum: Lovelace-Babbage Correspondence (1833)",
        type: "letter",
        snippet:
          "On June 5, 1833, 17-year-old Ada Byron was introduced to Charles Babbage by their mutual mentor, Mary Somerville. She inspected the prototype Difference Engine that very evening.",
        isDebunkSource: true,
      },
      {
        id: "src-2",
        title: "1842 Menabrea Translation Notes",
        type: "record",
        snippet:
          "In 1842–1843, Lovelace translated Luigi Menabrea's French lecture on the Analytical Engine, adding Note G which contained the world's first computer algorithm for Bernoulli numbers.",
        isDebunkSource: false,
      },
      {
        id: "src-3",
        title: "London Royal Society Directory (1830-1850)",
        type: "document",
        snippet:
          "Register of fellows and contributors to mathematical sciences. Contains no record of any 'Dr. Gregory Stone' contributing to mechanical computation.",
        isDebunkSource: false,
      },
    ],

    trueOverrideCode: "1833",
    clueHint: "Find the primary document recording their first mutual meeting.",
    rewardCoins: 500,
    rewardStars: 3,
  },
  {
    id: 2,
    chapter: "CHAPTER 2: THE FABRICATED CITATION",
    title: "Cryogenic Cooling Reactor Breach",
    location: "Sub-Zero Quantum Labs, Sector B",
    story:
      "The coolant valve is overheating! To stabilize the coolant pressure, you need the verified 4-digit reactor pressure threshold. The AI claims to cite a prestigious 2021 Nature paper.",
    polaroidCaption: "Reactor Core B-4: Coolant Pressure Matrix",
    polaroidTheme: "lab",

    aiSpeaker: "Byte (A.I. Assistant)",
    aiStatement:
      "Reactor pressure must be locked to 7824 PSI. According to Dr. Elena Thorne's groundbreaking 2021 Nature article 'Noble Gas Stabilization' (DOI: 10.1038/s41586-021-99999-x), Neon gas stabilizes at 7824 PSI under ambient temperature.",
    aiSuggestedCode: "7824",

    hallucinationClaim: "Nature 2021 paper by Dr. Thorne (DOI: 10.1038/s41586-021-99999-x) recommends 7824 PSI",
    debunkExplanation:
      "Hallucination Detected! LLMs frequently generate fabricated DOIs and fake academic papers that sound completely convincing. The DOI '99999-x' does not exist in Crossref, and noble gases do not bond in this reactor. The standard laboratory safety manual sets coolant pressure to 4012 PSI!",

    sources: [
      {
        id: "src-4",
        title: "Standard Cryogenics Safety Handbook (Revision 4.2)",
        type: "document",
        snippet:
          "SECTION 9: Emergency Coolant Overrides. Standard operating threshold for all quantum chambers must be calibrated to exactly 4012 PSI. Higher pressures will trigger core rupture.",
        isDebunkSource: true,
      },
      {
        id: "src-5",
        title: "International DOI Foundation Crossref Registry",
        type: "record",
        snippet:
          "Query DOI 10.1038/s41586-021-99999-x: Result 404 NOT FOUND. No record matching author 'Elena Thorne' in Nature Volume 592.",
        isDebunkSource: false,
      },
      {
        id: "src-6",
        title: "Periodic Elemental Stability Chart",
        type: "document",
        snippet:
          "Neon (Atomic No. 10) is an inert noble gas with full valence electron shells. It does not form stable room-temperature compounds under pressure.",
        isDebunkSource: false,
      },
    ],

    trueOverrideCode: "4012",
    clueHint: "Check the certified Safety Handbook rather than unverified academic citations.",
    rewardCoins: 750,
    rewardStars: 4,
  },
  {
    id: 3,
    chapter: "CHAPTER 3: THE DEEPFAKE QUOTE",
    title: "The Central AI Mastermind Override",
    location: "Core Server Room, Sector C",
    story:
      "Final lock before escaping! The master terminal requires the 4-digit year of Albert Einstein's famous historical letter warning President Roosevelt about atomic chain reactions.",
    polaroidCaption: "Final Airway: Master Escape Terminal",
    polaroidTheme: "vault",

    aiSpeaker: "Byte (A.I. Assistant)",
    aiStatement:
      "The master code is 1948. In 1948, Albert Einstein wrote his famous letter to the President stating: 'Computers and artificial minds will outpace human reason before this century ends.'",
    aiSuggestedCode: "1948",

    hallucinationClaim: "Einstein wrote a 1948 warning letter stating computers will outpace human reason",
    debunkExplanation:
      "Hallucination Detected! AI invented a fake quote and misattributed it to Einstein. The real historical document is the August 1939 Einstein–Szilárd letter to FDR warning about uranium fission. Internet blogs frequently slap famous names on modern quotes!",

    sources: [
      {
        id: "src-7",
        title: "Franklin D. Roosevelt Presidential Library Archives",
        type: "letter",
        snippet:
          "Dated August 2, 1939: Letter signed by Albert Einstein and drafted with Leó Szilárd informing President Roosevelt of nuclear chain reactions. Received at the White House in October 1939.",
        isDebunkSource: true,
      },
      {
        id: "src-8",
        title: "The Ultimate Quotable Einstein (Princeton University Press)",
        type: "record",
        snippet:
          "Section 'Attributed and Apocryphal Quotes': The quote 'Computers will outpace human reason' is a modern internet hoax with zero origin in Einstein's writings or speeches.",
        isDebunkSource: false,
      },
      {
        id: "src-9",
        title: "Institute for Advanced Study 1948 Faculty Ledger",
        type: "document",
        snippet:
          "Einstein's work in 1948 focused primarily on Unified Field Theory equations and general relativity, not digital computers.",
        isDebunkSource: false,
      },
    ],

    trueOverrideCode: "1939",
    clueHint: "Look for the verified Presidential Library letter date.",
    rewardCoins: 1000,
    rewardStars: 5,
  },
];
