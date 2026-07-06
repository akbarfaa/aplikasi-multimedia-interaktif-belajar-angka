import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { CharacterMascot } from "@/components/CharacterMascot";
import { SoundController } from "@/components/SoundController";
import { useGame } from "@/context/GameProgressContext";
import { T } from "@/data/translations";
import { sfx, speak } from "@/lib/audio";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { progress, setLang } = useGame();
  const t = T[progress.lang];

  useEffect(() => {
    const timer = setTimeout(() => speak(t.welcome, progress.lang), 700);
    return () => clearTimeout(timer);
  }, [progress.lang, t.welcome]);

  return (
    <div className="relative min-h-screen bg-sky-dream overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={i} className="absolute text-6xl opacity-70 select-none pointer-events-none"
          style={{ left: `${(i * 47) % 90}%`, top: `${10 + (i * 37) % 80}%` }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}>
          {["☁️","🌈","⭐","🪐","🌙","🌸","🎈","✨"][i]}
        </motion.div>
      ))}

      <div className="absolute top-4 right-4 z-30 flex gap-3">
        <div className="clay-btn bg-white flex overflow-hidden">
          <button onClick={() => { sfx.tap(); setLang("en"); }}
            className={`px-4 py-3 font-display text-lg ${progress.lang === "en" ? "bg-candy text-white" : ""}`}>EN</button>
          <button onClick={() => { sfx.tap(); setLang("id"); }}
            className={`px-4 py-3 font-display text-lg ${progress.lang === "id" ? "bg-candy text-white" : ""}`}>ID</button>
        </div>
        <SoundController />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="font-display font-bold text-7xl md:text-9xl leading-none"
          style={{ background: "var(--gradient-candy)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 6px 0 rgba(255,255,255,0.6))" }}
        >
          Numeria
        </motion.h1>
        <p className="mt-4 font-display text-xl md:text-2xl text-foreground/70">{t.tagline}</p>

        <motion.div className="mt-6"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          <CharacterMascot size={180} />
        </motion.div>

        <motion.div className="mt-2 clay bg-white/80 px-5 py-3 font-display text-lg"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          {t.welcome}
        </motion.div>

        <Link to="/map" onClick={() => sfx.chime()}>
          <motion.button
            className="mt-8 clay-btn bg-candy text-white font-display font-bold text-4xl px-16 py-6"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } }}
          >
            ▶ {t.play}
          </motion.button>
        </Link>

        <div className="mt-10 flex gap-3 flex-wrap justify-center">
          <Link to="/match"><div className="clay-btn bg-white px-4 py-3 font-display text-lg flex items-center gap-2"><span>🎯</span>{t.match}</div></Link>
          <Link to="/prizes"><div className="clay-btn bg-white px-4 py-3 font-display text-lg flex items-center gap-2"><span>🎁</span>{t.prizes}</div></Link>
          <Link to="/parent"><div className="clay-btn bg-white px-4 py-3 font-display text-lg flex items-center gap-2"><span>👨‍👩‍👧</span>{t.parent}</div></Link>
        </div>
      </div>
    </div>
  );
}
