import { useEffect } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { sfx } from "@/lib/audio";

export function RewardsPopper({ show, title, subtitle, onClose }: { show: boolean; title: string; subtitle?: string; onClose: () => void }) {
  useEffect(() => {
    if (!show) return;
    sfx.success();
    const end = Date.now() + 900;
    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60, spread: 70, origin: { x: 0, y: 0.7 },
        colors: ["#ffb3d1", "#b3e5ff", "#c1f0c1", "#ffe89a", "#e0c1ff"],
      });
      confetti({
        particleCount: 6,
        angle: 120, spread: 70, origin: { x: 1, y: 0.7 },
        colors: ["#ffb3d1", "#b3e5ff", "#c1f0c1", "#ffe89a", "#e0c1ff"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 backdrop-blur-sm p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.4, y: 40, rotate: -8 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 15 }}
            className="clay bg-white p-10 max-w-md text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div className="text-8xl mb-2"
              animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}>🎉</motion.div>
            <h2 className="font-display text-4xl text-primary">{title}</h2>
            {subtitle && <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>}
            <motion.button
              whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.05 }}
              onClick={onClose}
              className="clay-btn mt-6 px-8 py-4 bg-candy text-white font-display text-2xl"
            >
              Yay!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
