"use client";

import { useSettingsStore } from "@/lib/stores/settingsStore";

type SoundName = "complete" | "capture" | "error" | "confirm" | "reminder";

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!audioContext) {
    audioContext = new Ctor();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  volume: number
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(
    volume,
    ctx.currentTime + start + 0.01
  );
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    ctx.currentTime + start + duration
  );
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.05);
}

const PATTERNS: Record<SoundName, (ctx: AudioContext, v: number) => void> = {
  complete: (ctx, v) => {
    tone(ctx, 660, 0, 0.09, v);
    tone(ctx, 990, 0.09, 0.16, v);
  },
  capture: (ctx, v) => {
    tone(ctx, 520, 0, 0.08, v);
  },
  error: (ctx, v) => {
    tone(ctx, 220, 0, 0.18, v);
    tone(ctx, 180, 0.14, 0.16, v);
  },
  confirm: (ctx, v) => {
    tone(ctx, 440, 0, 0.07, v);
    tone(ctx, 660, 0.07, 0.1, v);
  },
  reminder: (ctx, v) => {
    tone(ctx, 880, 0, 0.12, v);
    tone(ctx, 880, 0.18, 0.12, v);
  },
};

export function useSound() {
  const enabled = useSettingsStore((s) => s.soundEnabled);
  const volume = useSettingsStore((s) => s.soundVolume);

  const play = (name: SoundName) => {
    if (!enabled) return;
    const ctx = getContext();
    if (!ctx) return;
    const v = Math.max(0.02, Math.min(0.6, volume));
    PATTERNS[name]?.(ctx, v);
  };

  return { play };
}
