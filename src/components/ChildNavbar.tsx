import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameProgressContext";
import { SoundController } from "./SoundController";
import { sfx } from "@/lib/audio";

export function ChildNavbar() {
  const { progress } = useGame();
  return (
    <div className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
      <div className="pointer-events-auto">
        <Link to="/" onClick={() => sfx.tap()}>
          <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}
            className="clay-btn size-14 grid place-items-center bg-white text-2xl">🏠</motion.div>
        </Link>
      </div>
      <div className="pointer-events-auto flex items-center gap-3">
        <div className="clay-btn bg-white px-4 h-14 flex items-center gap-2 font-display text-xl">
          <motion.span animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2, repeat: Infinity }}>⭐</motion.span>
          <span className="tabular-nums">{progress.stars}</span>
        </div>
        <Link to="/prizes" onClick={() => sfx.tap()}>
          <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}
            className="clay-btn size-14 grid place-items-center bg-white text-2xl">🎁</motion.div>
        </Link>
        <SoundController />
      </div>
    </div>
  );
}
