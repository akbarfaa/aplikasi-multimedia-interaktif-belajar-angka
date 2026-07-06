import { motion } from "framer-motion";

export function CharacterMascot({ mood = "happy", size = 140 }: { mood?: "happy" | "cheer" | "think"; size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      aria-label="Orbit the friendly robot mascot"
    >
      {/* antenna */}
      <line x1="100" y1="20" x2="100" y2="45" stroke="oklch(0.5 0.1 290)" strokeWidth="4" strokeLinecap="round" />
      <motion.circle cx="100" cy="18" r="7" fill="oklch(0.9 0.16 95)"
        animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
      {/* body */}
      <ellipse cx="100" cy="120" rx="70" ry="55" fill="oklch(0.85 0.14 220)" />
      <ellipse cx="100" cy="125" rx="70" ry="55" fill="none" stroke="oklch(0.4 0.1 250)" strokeOpacity="0.15" strokeWidth="3" />
      {/* face plate */}
      <ellipse cx="100" cy="105" rx="55" ry="45" fill="oklch(0.98 0.02 240)" />
      {/* eyes */}
      <motion.g animate={mood === "cheer" ? { scaleY: [1, 0.3, 1] } : {}} transition={{ duration: 0.4, repeat: mood === "cheer" ? 3 : 0 }}>
        <ellipse cx="82" cy="100" rx="8" ry="10" fill="oklch(0.2 0.05 280)" />
        <ellipse cx="118" cy="100" rx="8" ry="10" fill="oklch(0.2 0.05 280)" />
        <circle cx="84" cy="97" r="2.5" fill="white" />
        <circle cx="120" cy="97" r="2.5" fill="white" />
      </motion.g>
      {/* cheeks */}
      <circle cx="72" cy="118" r="6" fill="oklch(0.82 0.14 20)" opacity="0.7" />
      <circle cx="128" cy="118" r="6" fill="oklch(0.82 0.14 20)" opacity="0.7" />
      {/* smile */}
      <path d="M 85 122 Q 100 138 115 122" stroke="oklch(0.3 0.08 280)" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* arms */}
      <motion.circle cx="30" cy="130" r="14" fill="oklch(0.85 0.14 220)"
        animate={{ rotate: [0, 20, 0], y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <circle cx="170" cy="130" r="14" fill="oklch(0.85 0.14 220)" />
    </motion.svg>
  );
}
