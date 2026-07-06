import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChildNavbar } from "@/components/ChildNavbar";
import { RewardsPopper } from "@/components/RewardsPopper";
import { useGame } from "@/context/GameProgressContext";
import { T } from "@/data/translations";
import { sfx, speak } from "@/lib/audio";

export const Route = createFileRoute("/match")({
  head: () => ({ meta: [{ title: "Number Match — Numeria" }] }),
  component: MatchPage,
});

const EMOJIS = ["🍎","🌟","🎈","🍩","🐝","🦋","🍓","🐟","🌸","🍄"];

type Round = { n: number; options: number[] };

function makeRound(unlocked: number): Round {
  const max = Math.max(3, Math.min(10, unlocked));
  const n = 1 + Math.floor(Math.random() * max);
  const opts = new Set<number>([n]);
  while (opts.size < 3) opts.add(1 + Math.floor(Math.random() * max));
  return { n, options: shuffle([...opts]) };
}
function shuffle<T>(a: T[]) { return a.map((v) => [Math.random(), v] as const).sort((x, y) => x[0] - y[0]).map(([, v]) => v); }

function MatchPage() {
  const { progress, addStars } = useGame();
  const t = T[progress.lang];
  const [round, setRound] = useState<Round>(() => makeRound(progress.unlocked));
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const emoji = useMemo(() => EMOJIS[(round.n - 1) % EMOJIS.length], [round.n]);

  useEffect(() => { speak(`${t.count}!`, progress.lang); }, [round.n, progress.lang, t.count]);

  const pick = (v: number) => {
    if (v === round.n) {
      sfx.success();
      const next = score + 1;
      setScore(next);
      if (next >= 5) {
        addStars(3);
        setDone(true);
      } else {
        setTimeout(() => setRound(makeRound(progress.unlocked)), 500);
      }
    } else {
      sfx.error();
      setWrong(v);
      setTimeout(() => setWrong(null), 500);
    }
  };

  return (
    <div className="min-h-screen bg-sky-dream relative overflow-hidden pb-12">
      <ChildNavbar />

      <div className="pt-24 px-4 max-w-4xl mx-auto text-center">
        <h1 className="font-display text-5xl font-bold">{t.match}</h1>
        <div className="mt-2 font-display text-xl text-foreground/70">
          {score} / 5 ⭐
        </div>
      </div>

      <div className="mt-8 px-4 max-w-2xl mx-auto">
        <motion.div key={round.n} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="clay bg-magic p-8 min-h-[220px] grid place-items-center">
          <div className="flex flex-wrap justify-center gap-3 max-w-md">
            {Array.from({ length: round.n }).map((_, i) => (
              <motion.span key={i} className="text-6xl"
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}>{emoji}</motion.span>
            ))}
          </div>
        </motion.div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <AnimatePresence>
            {round.options.map((opt) => (
              <motion.button key={opt}
                onClick={() => pick(opt)}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: wrong === opt ? [0, -8, 8, -8, 0] : 0 }}
                exit={{ scale: 0 }}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 220, damping: 12 }}
                className="clay-btn bg-white font-display text-6xl md:text-7xl font-bold py-8 aspect-square"
                style={{ color: wrong === opt ? "oklch(0.6 0.25 30)" : "oklch(0.3 0.1 290)" }}
              >
                {opt}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link to="/map"><div className="clay-btn bg-white px-6 py-3 font-display text-lg">← {t.map}</div></Link>
      </div>

      <RewardsPopper show={done} title={t.great + "!"} subtitle="+3 ⭐" onClose={() => { setDone(false); setScore(0); setRound(makeRound(progress.unlocked)); }} />
    </div>
  );
}
