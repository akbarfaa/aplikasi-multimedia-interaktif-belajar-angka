import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChildNavbar } from "@/components/ChildNavbar";
import { CountingGrid } from "@/components/CountingGrid";
import { RewardsPopper } from "@/components/RewardsPopper";
import { CharacterMascot } from "@/components/CharacterMascot";
import { useGame } from "@/context/GameProgressContext";
import { T } from "@/data/translations";

export const Route = createFileRoute("/count/$n")({
  head: ({ params }) => ({ meta: [{ title: `Count ${params.n} — Numeria` }] }),
  component: CountPage,
});

function CountPage() {
  const { n } = Route.useParams();
  const num = Math.max(1, Math.min(10, parseInt(n, 10) || 1));
  const { progress, addStars, addSticker } = useGame();
  const t = T[progress.lang];
  const [done, setDone] = useState(false);
  const nav = useNavigate();

  const onComplete = () => {
    if (done) return;
    setDone(true);
    addStars(2);
  };
  const closeReward = () => {
    addSticker(`count-${num}`);
    nav({ to: "/map" });
  };

  return (
    <div className="min-h-screen bg-sky-dream relative overflow-hidden pb-12">
      <ChildNavbar />

      <div className="pt-24 px-4 max-w-5xl mx-auto text-center">
        <motion.div className="font-display text-3xl text-foreground" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          {t.count} {num}!
        </motion.div>
        <div className="mt-2 font-display text-lg text-foreground/70">{t.tapToCount}</div>
        <div className="mt-4">
          <CharacterMascot size={100} />
        </div>
      </div>

      <div className="mt-6 px-4">
        <CountingGrid target={num} onComplete={onComplete} />
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <Link to="/map"><div className="clay-btn bg-white px-6 py-3 font-display text-lg">← {t.map}</div></Link>
        <Link to="/match"><div className="clay-btn bg-candy text-white px-6 py-3 font-display text-lg">🎯 {t.match}</div></Link>
      </div>

      <RewardsPopper show={done} title={t.finished} subtitle="+2 ⭐" onClose={closeReward} />
    </div>
  );
}
