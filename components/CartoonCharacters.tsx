import React from "react";

// Inspector Mark the Detective Cat (Avatar & Peeking Detective)
export function MarkDetective({
  mode = "avatar",
  className = "",
}: {
  mode?: "avatar" | "peeking" | "stamp";
  className?: string;
}) {
  if (mode === "peeking") {
    return (
      <div className={`relative inline-block ${className}`}>
        <svg
          viewBox="0 0 160 110"
          className="w-36 h-24 drop-shadow-md overflow-visible"
        >
          {/* Detective Cap Brim */}
          <path
            d="M 15 50 Q 80 15 145 50 Q 80 40 15 50 Z"
            fill="#78350f"
            stroke="#451a03"
            strokeWidth="3"
          />
          {/* Detective Cap Dome */}
          <path
            d="M 30 45 Q 80 -10 130 45 Z"
            fill="#92400e"
            stroke="#451a03"
            strokeWidth="3"
          />
          {/* Hat Ribbon */}
          <path
            d="M 32 45 Q 80 30 128 45"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="5"
          />

          {/* Cat Ears */}
          <polygon
            points="35,38 20,8 55,25"
            fill="#b45309"
            stroke="#451a03"
            strokeWidth="3"
          />
          <polygon points="35,34 26,14 48,25" fill="#fbcfe8" />
          <polygon
            points="125,38 140,8 105,25"
            fill="#b45309"
            stroke="#451a03"
            strokeWidth="3"
          />
          <polygon points="125,34 134,14 112,25" fill="#fbcfe8" />

          {/* Cat Head */}
          <ellipse
            cx="80"
            cy="70"
            rx="52"
            ry="40"
            fill="#fef3c7"
            stroke="#451a03"
            strokeWidth="4"
          />
          {/* Calico Fur Patch */}
          <path
            d="M 40 50 Q 60 70 50 90 Q 30 80 35 60 Z"
            fill="#b45309"
          />

          {/* Thick Expressive Eyebrows */}
          <rect
            x="48"
            y="54"
            width="22"
            height="6"
            rx="3"
            fill="#1f2937"
            transform="rotate(-5 48 54)"
          />
          <rect
            x="90"
            y="54"
            width="22"
            height="6"
            rx="3"
            fill="#1f2937"
            transform="rotate(5 90 54)"
          />

          {/* Big Curious Eyes */}
          <ellipse cx="58" cy="68" rx="10" ry="12" fill="#1f2937" />
          <circle cx="55" cy="65" r="4" fill="#ffffff" />
          <circle cx="61" cy="73" r="1.5" fill="#ffffff" />

          <ellipse cx="102" cy="68" rx="10" ry="12" fill="#1f2937" />
          <circle cx="99" cy="65" r="4" fill="#ffffff" />
          <circle cx="105" cy="73" r="1.5" fill="#ffffff" />

          {/* Cute Nose & Whiskers */}
          <polygon points="77,75 83,75 80,79" fill="#f43f5e" />
          <path
            d="M 80 79 Q 75 85 71 83 M 80 79 Q 85 85 89 83"
            fill="none"
            stroke="#451a03"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Whiskers */}
          <line
            x1="30"
            y1="75"
            x2="10"
            y2="72"
            stroke="#451a03"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="30"
            y1="82"
            x2="12"
            y2="85"
            stroke="#451a03"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="130"
            y1="75"
            x2="150"
            y2="72"
            stroke="#451a03"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="130"
            y1="82"
            x2="148"
            y2="85"
            stroke="#451a03"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Paws resting on top of folder */}
          <ellipse
            cx="45"
            cy="104"
            rx="14"
            ry="9"
            fill="#fef3c7"
            stroke="#451a03"
            strokeWidth="3"
          />
          <ellipse
            cx="115"
            cy="104"
            rx="14"
            ry="9"
            fill="#fef3c7"
            stroke="#451a03"
            strokeWidth="3"
          />
        </svg>
      </div>
    );
  }

  // Avatar format (Square card portrait like Image 1 ID card)
  return (
    <div
      className={`relative rounded-xl border-4 border-amber-950 bg-amber-100 p-2 shadow-inner flex items-center justify-center overflow-hidden ${className}`}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full">
        {/* Hat */}
        <path
          d="M 20 42 Q 60 12 100 42 Z"
          fill="#92400e"
          stroke="#451a03"
          strokeWidth="3"
        />
        <path
          d="M 10 42 Q 60 30 110 42 Q 60 36 10 42 Z"
          fill="#78350f"
          stroke="#451a03"
          strokeWidth="2.5"
        />
        {/* Head */}
        <circle
          cx="60"
          cy="75"
          r="38"
          fill="#fef3c7"
          stroke="#451a03"
          strokeWidth="3.5"
        />
        {/* Fur patch */}
        <path d="M 28 60 Q 45 75 35 95 Q 22 85 28 60 Z" fill="#b45309" />
        {/* Brows */}
        <rect
          x="36"
          y="62"
          width="16"
          height="5"
          rx="2.5"
          fill="#1f2937"
          transform="rotate(-6 36 62)"
        />
        <rect
          x="68"
          y="62"
          width="16"
          height="5"
          rx="2.5"
          fill="#1f2937"
          transform="rotate(6 68 62)"
        />
        {/* Eyes */}
        <circle cx="44" cy="73" r="8" fill="#1f2937" />
        <circle cx="42" cy="71" r="3" fill="#ffffff" />
        <circle cx="76" cy="73" r="8" fill="#1f2937" />
        <circle cx="74" cy="71" r="3" fill="#ffffff" />
        {/* Nose & Mouth */}
        <polygon points="57,79 63,79 60,83" fill="#f43f5e" />
        <path
          d="M 60 83 Q 56 88 52 86 M 60 83 Q 64 88 68 86"
          fill="none"
          stroke="#451a03"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

// Byte the AI Robot Companion (Helpful but glitchy)
export function ByteRobot({
  glitching = false,
  className = "",
}: {
  glitching?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
        {/* Antenna */}
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="28"
          stroke="#475569"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle
          cx="50"
          cy="9"
          r="6"
          fill={glitching ? "#ef4444" : "#10b981"}
          stroke="#1e293b"
          strokeWidth="2"
          className={glitching ? "animate-ping" : ""}
        />
        <circle
          cx="50"
          cy="9"
          r="6"
          fill={glitching ? "#ef4444" : "#10b981"}
          stroke="#1e293b"
          strokeWidth="2"
        />

        {/* Head Box */}
        <rect
          x="18"
          y="28"
          width="64"
          height="52"
          rx="12"
          fill="#94a3b8"
          stroke="#334155"
          strokeWidth="3.5"
        />
        {/* Screen */}
        <rect
          x="26"
          y="35"
          width="48"
          height="38"
          rx="6"
          fill="#0f172a"
          stroke="#1e293b"
          strokeWidth="2"
        />

        {/* Eyes (digital LEDs) */}
        {glitching ? (
          <>
            {/* Glitch X eyes */}
            <path
              d="M 33 46 L 43 56 M 43 46 L 33 56"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 57 46 L 67 56 M 67 46 L 57 56"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Warning triangle */}
            <polygon points="50,62 46,68 54,68" fill="#eab308" />
          </>
        ) : (
          <>
            {/* Friendly cyan glowing eyes */}
            <circle cx="38" cy="51" r="5" fill="#38bdf8" />
            <circle cx="62" cy="51" r="5" fill="#38bdf8" />
            {/* Smile line */}
            <path
              d="M 44 63 Q 50 67 56 63"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Bolts on sides */}
        <rect x="14" y="47" width="4" height="12" rx="2" fill="#64748b" />
        <rect x="82" y="47" width="4" height="12" rx="2" fill="#64748b" />

        {/* Mini neck & shoulders */}
        <rect x="42" y="80" width="16" height="6" fill="#475569" />
        <path
          d="M 28 86 L 72 86 L 80 98 L 20 98 Z"
          fill="#cbd5e1"
          stroke="#334155"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}

// TOP SECRET Rubber Stamp (from reference image 1)
export function TopSecretStamp({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block border-3 border-red-600 rounded-md px-3 py-0.5 text-red-600 font-extrabold tracking-widest text-xs uppercase -rotate-6 select-none opacity-85 shadow-xs border-dashed ${className}`}
    >
      TOP SECRET
    </div>
  );
}

// Translucent Scotch Tape (like on Polaroids in image 2)
export function ScotchTape({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-16 h-5 bg-white/75 backdrop-blur-[1px] border border-amber-200/60 shadow-xs rotate-[-3deg] select-none pointer-events-none ${className}`}
      style={{
        clipPath:
          "polygon(0% 10%, 4% 0%, 96% 2%, 100% 12%, 98% 90%, 94% 100%, 3% 98%, 0% 88%)",
      }}
    />
  );
}

// Cartoon Ribbon Banner (like Chapter 1 in image 2)
export function RibbonBanner({
  text,
  color = "blue",
}: {
  text: string;
  color?: "blue" | "orange" | "green";
}) {
  const bgStyles = {
    blue: "bg-sky-500 text-white shadow-sky-600/50",
    orange: "bg-amber-500 text-white shadow-amber-600/50",
    green: "bg-emerald-500 text-white shadow-emerald-600/50",
  }[color];

  return (
    <div className="relative inline-flex items-center justify-center my-2">
      <div
        className={`px-6 py-1.5 font-bold uppercase tracking-wider text-xs md:text-sm rounded-sm shadow-md ${bgStyles}`}
      >
        {text}
      </div>
    </div>
  );
}

// Coin Graphic with 3D Depth
export function CartoonCoin({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="inline-block drop-shadow-sm">
      <circle cx="20" cy="20" r="19" fill="#d97706" />
      <circle cx="20" cy="18" r="17" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
      <circle cx="20" cy="18" r="13" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 2" />
      <text
        x="20"
        y="23"
        textAnchor="middle"
        fontSize="16"
        fontWeight="bold"
        fill="#92400e"
        fontFamily="sans-serif"
      >
        G
      </text>
    </svg>
  );
}

// Token / Compute Energy Gem (like in image 2)
export function CartoonGem({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="inline-block drop-shadow-sm">
      <polygon points="20,2 38,15 20,38 2,15" fill="#7e22ce" />
      <polygon points="20,4 36,16 20,36 4,16" fill="#a855f7" />
      <polygon points="20,4 36,16 20,22 4,16" fill="#c084fc" />
      <polygon points="20,4 28,16 20,22 12,16" fill="#f3e8ff" />
    </svg>
  );
}
