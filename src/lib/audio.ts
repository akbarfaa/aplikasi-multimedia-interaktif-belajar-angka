// Lightweight Web Audio SFX + speech synthesis for voiceovers.
// Avoids external MP3 assets and keeps everything working offline.

let ctx: AudioContext | null = null;
let muted = false;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      ctx = new AC();
    } catch { return null; }
  }
  return ctx;
}

export function setMuted(m: boolean) { muted = m; }

function tone(freq: number, duration = 0.15, type: OscillatorType = "sine", vol = 0.2, when = 0) {
  const c = ac();
  if (!c || muted) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function sweep(f1: number, f2: number, duration = 0.3, type: OscillatorType = "sine", vol = 0.18) {
  const c = ac();
  if (!c || muted) return;
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f1, t0);
  osc.frequency.exponentialRampToValueAtTime(f2, t0 + duration);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export const sfx = {
  pop: () => sweep(700, 1300, 0.12, "sine", 0.18),
  tap: () => tone(520, 0.08, "triangle", 0.15),
  success: () => {
    tone(660, 0.15, "triangle", 0.2, 0);
    tone(880, 0.15, "triangle", 0.2, 0.12);
    tone(1320, 0.3, "triangle", 0.22, 0.24);
  },
  error: () => sweep(500, 220, 0.35, "sine", 0.15),
  chime: () => {
    tone(880, 0.2, "sine", 0.15, 0);
    tone(1108, 0.2, "sine", 0.15, 0.08);
    tone(1318, 0.35, "sine", 0.18, 0.16);
  },
  unlock: () => {
    tone(523, 0.12, "triangle", 0.2, 0);
    tone(659, 0.12, "triangle", 0.2, 0.1);
    tone(783, 0.12, "triangle", 0.2, 0.2);
    tone(1046, 0.25, "triangle", 0.22, 0.3);
  },
};

export function speak(text: string, lang: "en" | "id") {
  if (muted) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "id" ? "id-ID" : "en-US";
    u.rate = 0.95;
    u.pitch = 1.35;
    u.volume = 0.9;
    window.speechSynthesis.speak(u);
  } catch {}
}

// Gentle background pad using oscillators (very subtle).
let bgNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
let bgOn = false;
export function startBg() {
  const c = ac();
  if (!c || bgOn || muted) return;
  bgOn = true;
  const freqs = [261.63, 329.63, 392.0]; // C major triad pad
  bgNodes = freqs.map((f) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.015, c.currentTime + 2);
    osc.connect(gain).connect(c.destination);
    osc.start();
    return { osc, gain };
  });
}
export function stopBg() {
  const c = ac();
  if (!c) return;
  bgNodes.forEach(({ osc, gain }) => {
    gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.5);
    setTimeout(() => osc.stop(), 600);
  });
  bgNodes = [];
  bgOn = false;
}
