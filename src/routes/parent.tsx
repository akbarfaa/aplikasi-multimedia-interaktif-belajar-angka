import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChildNavbar } from "@/components/ChildNavbar";
import { useGame } from "@/context/GameProgressContext";
import { T } from "@/data/translations";
import { sfx } from "@/lib/audio";

export const Route = createFileRoute("/parent")({
  head: () => ({ meta: [{ title: "Parents — Numeria" }] }),
  component: ParentPage,
});

function ParentPage() {
  const { progress, setLang, reset, toggleMute } = useGame();
  const t = T[progress.lang];
  const [unlocked, setUnlocked] = useState(false);
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  const submit = () => {
    if (val.trim() === "27") { setUnlocked(true); sfx.success(); }
    else { setErr(true); sfx.error(); setTimeout(() => setErr(false), 500); }
  };

  const totalStruggles = Object.entries(progress.struggles).sort((a, b) => b[1] - a[1]);
  const mins = Math.floor(progress.playtimeSec / 60);
  const secs = progress.playtimeSec % 60;

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-sky-dream grid place-items-center px-6 relative">
        <ChildNavbar />
        <motion.div className="clay bg-white p-8 max-w-md w-full text-center"
          initial={{ scale: 0.7, y: 30, opacity: 0 }}
          animate={err ? { x: [-8, 8, -6, 6, 0], scale: 1, y: 0, opacity: 1 } : { scale: 1, y: 0, opacity: 1 }}>
          <div className="text-5xl">🔐</div>
          <h1 className="font-display text-3xl mt-3 font-bold">{t.parentGate}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{t.parentQ}</p>
          <input
            value={val} onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            inputMode="numeric"
            className="mt-5 w-full clay bg-muted px-4 py-3 text-center font-display text-2xl outline-none"
            placeholder="?"
          />
          <button onClick={submit}
            className="clay-btn mt-5 bg-candy text-white font-display text-xl px-8 py-3">
            {t.submit}
          </button>
          <div className="mt-4">
            <Link to="/" className="text-sm text-muted-foreground underline">Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-dream pb-16">
      <ChildNavbar />
      <div className="pt-24 px-4 max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-bold">{t.settings}</h1>

        <section className="mt-6 clay bg-white p-6">
          <h2 className="font-display text-2xl">{t.language}</h2>
          <div className="mt-3 flex gap-3">
            <button onClick={() => setLang("en")} className={`clay-btn px-6 py-3 font-display text-lg ${progress.lang === "en" ? "bg-candy text-white" : "bg-muted"}`}>English</button>
            <button onClick={() => setLang("id")} className={`clay-btn px-6 py-3 font-display text-lg ${progress.lang === "id" ? "bg-candy text-white" : "bg-muted"}`}>Bahasa Indonesia</button>
          </div>
        </section>

        <section className="mt-4 clay bg-white p-6">
          <h2 className="font-display text-2xl">Sound</h2>
          <button onClick={toggleMute} className="clay-btn mt-3 bg-muted px-6 py-3 font-display text-lg">
            {progress.muted ? "🔇 " + t.unmute : "🔊 " + t.mute}
          </button>
        </section>

        <section className="mt-4 clay bg-white p-6">
          <h2 className="font-display text-2xl">Progress</h2>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div className="clay bg-muted p-4">
              <div className="text-3xl">⭐</div>
              <div className="font-display text-2xl">{progress.stars}</div>
              <div className="text-xs text-muted-foreground">{t.stars}</div>
            </div>
            <div className="clay bg-muted p-4">
              <div className="text-3xl">🏝️</div>
              <div className="font-display text-2xl">{progress.completed.length}/10</div>
              <div className="text-xs text-muted-foreground">Levels</div>
            </div>
            <div className="clay bg-muted p-4">
              <div className="text-3xl">⏱️</div>
              <div className="font-display text-2xl">{mins}:{secs.toString().padStart(2, "0")}</div>
              <div className="text-xs text-muted-foreground">{t.playtime}</div>
            </div>
          </div>
        </section>

        <section className="mt-4 clay bg-white p-6">
          <h2 className="font-display text-2xl">{t.strugglesTitle}</h2>
          {totalStruggles.length === 0 ? (
            <p className="mt-2 text-muted-foreground">{t.noStruggles}</p>
          ) : (
            <div className="mt-3 space-y-2">
              {totalStruggles.map(([num, count]) => {
                const max = totalStruggles[0][1];
                return (
                  <div key={num} className="flex items-center gap-3">
                    <div className="font-display text-2xl w-10">{num}</div>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-candy" style={{ width: `${(count / max) * 100}%` }} />
                    </div>
                    <div className="w-10 text-right tabular-nums">{count}</div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-4">
          <button onClick={() => { if (confirm("Reset all progress?")) reset(); }}
            className="clay-btn bg-destructive text-destructive-foreground px-6 py-3 font-display">
            {t.reset}
          </button>
        </section>
      </div>
    </div>
  );
}
