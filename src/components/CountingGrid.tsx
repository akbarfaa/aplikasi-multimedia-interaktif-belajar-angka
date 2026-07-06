import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx, speak } from "@/lib/audio";
import { useGame } from "@/context/GameProgressContext";
import { T } from "@/data/translations";

const OBJECTS = ["🍎","🌟","🎈","🍩","🐝","🦋","🍓","🐟","🌸","🍄"];

export function CountingGrid({ target, onComplete }: { target: number; onComplete: () => void }) {
  const { progress: g } = useGame();
  const emoji = useMemo(() => OBJECTS[(target - 1) % OBJECTS.length], [target]);
  const items = useMemo(() =>
    Array.from({ length: target }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 65,
      rot: (Math.random() - 0.5) * 30,
    })),
  [target]);
  const [popped, setPopped] = useState<number[]>([]);
  const [floaters, setFloaters] = useState<{ id: number; n: number; x: number; y: number }[]>([]);

  const tap = (id: number, x: number, y: number) => {
    if (popped.includes(id)) return;
    const next = [...popped, id];
    setPopped(next);
    const n = next.length;
    sfx.pop();
    speak(T[g.lang].numbers[n], g.lang);
    setFloaters((f) => [...f, { id: Date.now() + id, n, x, y }]);
    setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== Date.now() + id)), 1400);
    if (n === target) setTimeout(() => { sfx.chime(); onComplete(); }, 700);
  };

  return (
    <div className="relative w-full aspect-[4/3] max-w-2xl mx-auto clay bg-magic overflow-hidden">
      {/* Sparkles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={i} className="absolute text-white/60 text-xl"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.1 }}>✨</motion.div>
      ))}

      {items.map((it) => {
        const isPopped = popped.includes(it.id);
        return (
          <motion.button
            key={it.id}
            className="absolute text-6xl md:text-7xl origin-center"
            style={{ left: `${it.x}%`, top: `${it.y}%` }}
            initial={{ scale: 0, rotate: it.rot }}
            animate={isPopped ? { scale: 0, opacity: 0, y: -60 } : { scale: [1, 1.08, 1], rotate: [it.rot - 5, it.rot + 5, it.rot - 5] }}
            transition={isPopped ? { duration: 0.35 } : { duration: 2 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.7 }}
            onClick={() => tap(it.id, it.x, it.y)}
          >
            {emoji}
          </motion.button>
        );
      })}

      <AnimatePresence>
        {floaters.map((f) => (
          <motion.div key={f.id}
            className="absolute font-display text-5xl font-bold text-white pointer-events-none"
            style={{ left: `${f.x}%`, top: `${f.y}%`, textShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
            initial={{ scale: 0.5, y: 0, opacity: 1 }}
            animate={{ scale: 1.4, y: -120, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >{f.n}</motion.div>
        ))}
      </AnimatePresence>

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 clay bg-white px-6 py-2 font-display text-3xl">
        {popped.length} / {target}
      </div>
    </div>
  );
}
