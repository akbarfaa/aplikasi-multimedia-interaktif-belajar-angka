import { useEffect } from "react";
import { useGame } from "@/context/GameProgressContext";
import { setMuted, startBg, stopBg, sfx } from "@/lib/audio";
import { motion } from "framer-motion";

export function SoundController() {
  const { progress, toggleMute } = useGame();

  useEffect(() => {
    setMuted(progress.muted);
    if (progress.muted) stopBg();
  }, [progress.muted]);

  // Try to start bg music on first user interaction
  useEffect(() => {
    const start = () => {
      if (!progress.muted) startBg();
      window.removeEventListener("pointerdown", start);
    };
    window.addEventListener("pointerdown", start, { once: true });
    return () => window.removeEventListener("pointerdown", start);
  }, [progress.muted]);

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => { sfx.tap(); toggleMute(); }}
      className="clay-btn size-14 grid place-items-center bg-white text-2xl"
      aria-label={progress.muted ? "Unmute" : "Mute"}
    >
      {progress.muted ? "🔇" : "🔊"}
    </motion.button>
  );
}
