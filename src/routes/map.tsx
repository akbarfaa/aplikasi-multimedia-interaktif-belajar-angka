import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameProgressContext";
import { ChildNavbar } from "@/components/ChildNavbar";
import { sfx } from "@/lib/audio";
import { T } from "@/data/translations";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Number Map — Numeria" },
      { name: "description", content: "Choose a number island to explore." },
    ],
  }),
  component: MapPage,
});

const COLORS = ["#ff9ec4","#7dd3fc","#a7f3d0","#fde68a","#fdba74","#c4b5fd","#f9a8d4","#67e8f9","#86efac","#fcd34d"];

function MapPage() {
  const { progress } = useGame();
  const t = T[progress.lang];
  // Winding path coordinates
  const nodes = Array.from({ length: 10 }, (_, i) => {
    const n = i + 1;
    const x = 10 + (i % 5) * 20 + (Math.floor(i / 5) % 2 === 1 ? 0 : 0);
    // zigzag: row 0 left->right, row 1 right->left
    const row = Math.floor(i / 5);
    const col = row === 0 ? i % 5 : 4 - (i % 5);
    return { n, x: 12 + col * 18, y: 20 + row * 40 };
  });

  return (
    <div className="min-h-screen bg-sky-dream relative overflow-hidden pb-24">
      <ChildNavbar />

      {/* Decor */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div key={i} className="absolute text-4xl opacity-50 pointer-events-none"
          style={{ left: `${(i * 29) % 100}%`, top: `${(i * 41) % 100}%` }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}>
          {["☁️","⭐","✨","🌸","🪐"][i % 5]}
        </motion.div>
      ))}

      <div className="pt-24 pb-8 text-center">
        <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground">{t.map}</h1>
      </div>

      <div className="relative mx-auto max-w-4xl h-[900px] md:h-[720px]">
        {/* Path SVG */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path d={pathD(nodes)} fill="none" stroke="oklch(1 0 0)" strokeOpacity="0.7" strokeWidth="4"
            strokeLinecap="round" strokeDasharray="1 3" />
        </svg>

        {nodes.map((node, i) => {
          const unlocked = node.n <= progress.unlocked;
          const done = progress.completed.includes(node.n);
          return (
            <motion.div key={node.n}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 200, damping: 12 }}
            >
              {unlocked ? (
                <Link to="/trace/$n" params={{ n: String(node.n) }} onClick={() => sfx.tap()}>
                  <motion.div
                    className="clay-btn size-24 md:size-28 grid place-items-center font-display text-5xl font-bold text-white relative"
                    style={{ background: COLORS[i], boxShadow: "0 12px 0 rgba(0,0,0,0.15), inset 0 -6px 0 rgba(0,0,0,0.15), inset 0 4px 0 rgba(255,255,255,0.4)" }}
                    whileHover={{ scale: 1.1, rotate: 4 }} whileTap={{ scale: 0.94 }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ y: { duration: 2 + (i % 3) * 0.3, repeat: Infinity, ease: "easeInOut" } }}
                  >
                    {node.n}
                    {done && (
                      <motion.span className="absolute -top-3 -right-3 text-3xl"
                        animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2, repeat: Infinity }}>⭐</motion.span>
                    )}
                  </motion.div>
                </Link>
              ) : (
                <div className="clay-btn size-24 md:size-28 grid place-items-center text-4xl bg-muted text-muted-foreground opacity-70">
                  🔒
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function pathD(nodes: { x: number; y: number }[]) {
  return nodes.map((n, i) => (i === 0 ? `M ${n.x} ${n.y}` : `L ${n.x} ${n.y}`)).join(" ");
}
