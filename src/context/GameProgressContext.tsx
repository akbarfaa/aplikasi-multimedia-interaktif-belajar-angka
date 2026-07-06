import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "en" | "id";

type Progress = {
  stars: number;
  unlocked: number; // highest unlocked level (1..10)
  completed: number[];
  stickers: string[];
  lang: Lang;
  muted: boolean;
  struggles: Record<string, number>; // number -> mistake count
  playtimeSec: number;
};

const DEFAULT: Progress = {
  stars: 0,
  unlocked: 1,
  completed: [],
  stickers: [],
  lang: "en",
  muted: false,
  struggles: {},
  playtimeSec: 0,
};

const KEY = "numeria:progress:v1";

type Ctx = {
  progress: Progress;
  addStars: (n: number) => void;
  completeLevel: (n: number) => void;
  unlockNext: (n: number) => void;
  addSticker: (s: string) => void;
  setLang: (l: Lang) => void;
  toggleMute: () => void;
  logStruggle: (num: number) => void;
  addPlaytime: (sec: number) => void;
  reset: () => void;
};

const GameCtx = createContext<Ctx | null>(null);

export function GameProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setProgress({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch {}
  }, [progress, hydrated]);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => ({ ...p, playtimeSec: p.playtimeSec + 5 }));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const value: Ctx = {
    progress,
    addStars: (n) => setProgress((p) => ({ ...p, stars: p.stars + n })),
    completeLevel: (n) =>
      setProgress((p) => ({
        ...p,
        completed: p.completed.includes(n) ? p.completed : [...p.completed, n],
      })),
    unlockNext: (n) =>
      setProgress((p) => ({ ...p, unlocked: Math.max(p.unlocked, Math.min(10, n)) })),
    addSticker: (s) =>
      setProgress((p) => ({
        ...p,
        stickers: p.stickers.includes(s) ? p.stickers : [...p.stickers, s],
      })),
    setLang: (l) => setProgress((p) => ({ ...p, lang: l })),
    toggleMute: () => setProgress((p) => ({ ...p, muted: !p.muted })),
    logStruggle: (num) =>
      setProgress((p) => ({
        ...p,
        struggles: { ...p.struggles, [num]: (p.struggles[num] ?? 0) + 1 },
      })),
    addPlaytime: (sec) => setProgress((p) => ({ ...p, playtimeSec: p.playtimeSec + sec })),
    reset: () => setProgress(DEFAULT),
  };

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export function useGame() {
  const ctx = useContext(GameCtx);
  if (!ctx) throw new Error("useGame must be used inside GameProgressProvider");
  return ctx;
}
