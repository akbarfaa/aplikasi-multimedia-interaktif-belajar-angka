import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { NUMBER_PATHS } from "@/data/numberPaths";
import { sfx } from "@/lib/audio";

type Pt = { x: number; y: number };

function samplePath(d: string, step = 3): Pt[] {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  const p = document.createElementNS(svgNS, "path");
  p.setAttribute("d", d);
  svg.appendChild(p);
  const len = p.getTotalLength();
  const pts: Pt[] = [];
  for (let l = 0; l <= len; l += step) {
    const pt = p.getPointAtLength(l);
    pts.push({ x: pt.x, y: pt.y });
  }
  return pts;
}

function dist(a: Pt, b: Pt) { return Math.hypot(a.x - b.x, a.y - b.y); }

export function TracingCanvas({
  number,
  onComplete,
  onMistake,
}: {
  number: number;
  onComplete: () => void;
  onMistake: () => void;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const strokes = NUMBER_PATHS[number] ?? NUMBER_PATHS[1];
  const samples = useMemo(() => strokes.map((d) => samplePath(d, 4)), [strokes]);
  const [strokeIdx, setStrokeIdx] = useState(0);
  const [progress, setProgress] = useState(0); // index within current stroke
  const [drawing, setDrawing] = useState(false);
  const [userPts, setUserPts] = useState<Pt[]>([]);
  const [wobble, setWobble] = useState(false);

  const TOLERANCE = 26;

  useEffect(() => {
    setStrokeIdx(0);
    setProgress(0);
    setUserPts([]);
  }, [number]);

  const currentSamples = samples[strokeIdx] ?? [];
  const startPt = currentSamples[0];

  const toSvg = (evt: React.PointerEvent): Pt | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((evt.clientX - rect.left) / rect.width) * 200,
      y: ((evt.clientY - rect.top) / rect.height) * 200,
    };
  };

  const handleDown = (e: React.PointerEvent) => {
    const pt = toSvg(e);
    if (!pt || !startPt) return;
    // Must start near current stroke start (or near current progress)
    const anchor = currentSamples[progress] ?? startPt;
    if (dist(pt, anchor) > TOLERANCE + 15) {
      shake();
      return;
    }
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDrawing(true);
    setUserPts([pt]);
  };

  const shake = () => {
    sfx.error();
    onMistake();
    setWobble(true);
    setTimeout(() => setWobble(false), 400);
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!drawing) return;
    const pt = toSvg(e);
    if (!pt) return;
    setUserPts((u) => [...u, pt]);
    // Find nearest sample index within a forward window
    let bestI = progress;
    let bestD = Infinity;
    for (let i = progress; i < Math.min(currentSamples.length, progress + 25); i++) {
      const d = dist(pt, currentSamples[i]);
      if (d < bestD) { bestD = d; bestI = i; }
    }
    if (bestD > TOLERANCE) {
      // strayed too far
      setDrawing(false);
      setUserPts([]);
      shake();
      return;
    }
    if (bestI > progress) setProgress(bestI);
    if (bestI >= currentSamples.length - 3) {
      // stroke complete
      setDrawing(false);
      sfx.pop();
      if (strokeIdx + 1 < samples.length) {
        setStrokeIdx(strokeIdx + 1);
        setProgress(0);
        setUserPts([]);
      } else {
        setTimeout(onComplete, 200);
      }
    }
  };

  const handleUp = () => {
    setDrawing(false);
    if (progress < currentSamples.length - 3) {
      // released early — reset stroke
      setUserPts([]);
      setProgress(0);
    }
  };

  return (
    <motion.div
      animate={wobble ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className="clay bg-white p-4 aspect-square w-full max-w-[420px] mx-auto touch-none select-none"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        className="w-full h-full"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      >
        {/* Background number ghost */}
        <text x="100" y="150" textAnchor="middle" fontSize="180"
          fontFamily="Fredoka, sans-serif" fontWeight="700"
          fill="oklch(0.9 0.06 300)" opacity="0.5">{number}</text>

        {/* All strokes as dotted guides */}
        {strokes.map((d, i) => (
          <path key={i} d={d} fill="none"
            stroke={i < strokeIdx ? "oklch(0.75 0.18 160)" : "oklch(0.75 0.15 290)"}
            strokeOpacity={i === strokeIdx ? 0.35 : (i < strokeIdx ? 0.6 : 0.2)}
            strokeWidth={i === strokeIdx ? 26 : 18}
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={i === strokeIdx ? "1 8" : undefined} />
        ))}

        {/* Completed strokes solid */}
        {samples.map((s, i) => i < strokeIdx && (
          <path key={"done"+i} d={strokes[i]} fill="none"
            stroke="oklch(0.78 0.18 160)" strokeWidth="18"
            strokeLinecap="round" strokeLinejoin="round" />
        ))}

        {/* Progress on current stroke */}
        {currentSamples.length > 0 && (
          <polyline
            fill="none"
            stroke="oklch(0.78 0.18 350)" strokeWidth="18"
            strokeLinecap="round" strokeLinejoin="round"
            points={currentSamples.slice(0, progress + 1).map(p => `${p.x},${p.y}`).join(" ")}
          />
        )}

        {/* Guiding star at current start */}
        {startPt && progress < 3 && (
          <motion.g animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
            <circle cx={startPt.x} cy={startPt.y} r="12" fill="oklch(0.9 0.16 95)" />
            <text x={startPt.x} y={startPt.y + 5} textAnchor="middle" fontSize="16">⭐</text>
          </motion.g>
        )}

        {/* Finger indicator on current progress */}
        {progress > 0 && currentSamples[progress] && (
          <circle cx={currentSamples[progress].x} cy={currentSamples[progress].y}
            r="10" fill="oklch(0.78 0.18 350)" opacity="0.9" />
        )}
      </svg>
    </motion.div>
  );
}
