import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChildNavbar } from "@/components/ChildNavbar";
import { TracingCanvas } from "@/components/TracingCanvas";
import { RewardsPopper } from "@/components/RewardsPopper";
import { CharacterMascot } from "@/components/CharacterMascot";
import { useGame } from "@/context/GameProgressContext";
import { T } from "@/data/translations";
import { sfx, speak } from "@/lib/audio";

export const Route = createFileRoute("/trace/$n")({
  head: ({ params }) => ({
    meta: [{ title: `Trace ${params.n} — Numeria` }],
  }),
  component: TracePage,
});

function TracePage() {
  const { n } = Route.useParams();
  const num = Math.max(1, Math.min(10, parseInt(n, 10) || 1));
  const { progress, addStars, completeLevel, unlockNext, addSticker, logStruggle } = useGame();
  const t = T[progress.lang];
  const [done, setDone] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => speak(t.numbers[num], progress.lang), 500);
    return () => clearTimeout(timer);
  }, [num, progress.lang, t.numbers]);

  const onComplete = () => {
    if (done) return;
    setDone(true);
    addStars(1);
    speak(`${t.great} ${t.numbers[num]}!`, progress.lang);
  };

  const closeReward = () => {
    completeLevel(num);
    unlockNext(num + 1);
    addSticker(`sticker-${num}`);
    nav({ to: "/count/$n", params: { n: String(num) } });
  };

  return (
    <div className="min-h-screen bg-sky-dream relative overflow-hidden pb-12">
      <ChildNavbar />

      <div className="pt-24 px-4 max-w-5xl mx-auto grid md:grid-cols-[1fr_auto] gap-8 items-center">
        <div className="text-center">
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="font-display text-3xl text-foreground">{t.trace}</motion.div>
          <motion.div className="font-display text-9xl font-bold"
            initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            style={{ background: "var(--gradient-magic)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {num}
          </motion.div>
          <div className="font-display text-2xl text-foreground/70 -mt-2">{t.numbers[num]}</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <CharacterMascot size={120} />
          <button onClick={() => { sfx.tap(); speak(t.numbers[num], progress.lang); }}
            className="clay-btn bg-white px-4 py-2 font-display text-lg flex items-center gap-2">
            🔊 Hear it
          </button>
        </div>
      </div>

      <div className="mt-6 px-4">
        <TracingCanvas number={num} onComplete={onComplete} onMistake={() => logStruggle(num)} />
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <Link to="/map"><div className="clay-btn bg-white px-6 py-3 font-display text-lg">← {t.map}</div></Link>
      </div>

      <RewardsPopper show={done} title={t.great} subtitle={`+1 ⭐`} onClose={closeReward} />
    </div>
  );
}
