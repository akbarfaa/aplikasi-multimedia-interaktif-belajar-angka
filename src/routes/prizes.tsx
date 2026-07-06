import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChildNavbar } from "@/components/ChildNavbar";
import { useGame } from "@/context/GameProgressContext";
import { T } from "@/data/translations";

export const Route = createFileRoute("/prizes")({
  head: () => ({ meta: [{ title: "My Prizes — Numeria" }] }),
  component: PrizesPage,
});

const STICKER_EMOJIS = ["🦄","🐼","🐻","🐨","🦊","🐯","🐸","🐵","🐷","🐰","🌈","🚀","🎈","🎪","🎨","🏆","💎","🎯","🎁","👑"];

function PrizesPage() {
  const { progress } = useGame();
  const t = T[progress.lang];
  const slots = Array.from({ length: 20 });

  return (
    <div className="min-h-screen bg-sky-dream relative overflow-hidden pb-16">
      <ChildNavbar />

      <div className="pt-24 px-4 max-w-4xl mx-auto text-center">
        <h1 className="font-display text-5xl md:text-6xl font-bold">{t.prizes}</h1>
        <div className="mt-2 font-display text-2xl">⭐ {progress.stars}</div>
      </div>

      <div className="mt-8 px-4 max-w-4xl mx-auto grid grid-cols-4 md:grid-cols-5 gap-4">
        {slots.map((_, i) => {
          const hasIt = i < progress.stickers.length;
          return (
            <motion.div key={i}
              initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 200, damping: 12 }}
              className="clay aspect-square grid place-items-center text-5xl"
              style={{ background: hasIt ? "white" : "oklch(0.94 0.03 300)" }}>
              {hasIt ? (
                <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}>
                  {STICKER_EMOJIS[i]}
                </motion.span>
              ) : (
                <span className="text-3xl opacity-30">🔒</span>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to="/map"><div className="clay-btn bg-candy text-white px-6 py-3 font-display text-lg">← {t.map}</div></Link>
      </div>
    </div>
  );
}
