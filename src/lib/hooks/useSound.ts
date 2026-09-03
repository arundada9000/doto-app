"use client";

import { useSettingsStore } from "@/lib/stores/settingsStore";
import type { CompletionStyle } from "@/types";

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

const CELEBRATION: Record<CompletionStyle, (ctx: AudioContext, v: number) => void> = {
  none: () => {},
  confetti: (ctx, v) => {
    tone(ctx, 784, 0, 0.08, v);
    tone(ctx, 988, 0.08, 0.08, v);
    tone(ctx, 1319, 0.16, 0.2, v * 0.9);
  },
  strikethrough: (ctx, v) => {
    tone(ctx, 556, 0, 0.06, v);
    tone(ctx, 832, 0.06, 0.12, v);
  },
  burn: (ctx, v) => {
    tone(ctx, 440, 0, 0.05, v);
    tone(ctx, 392, 0.05, 0.06, v * 0.8);
    tone(ctx, 330, 0.11, 0.2, v * 0.6);
  },
  melt: (ctx, v) => {
    tone(ctx, 880, 0, 0.06, v);
    tone(ctx, 660, 0.07, 0.06, v * 0.8);
    tone(ctx, 494, 0.14, 0.16, v * 0.6);
  },
  check: (ctx, v) => {
    tone(ctx, 523, 0, 0.07, v);
    tone(ctx, 784, 0.07, 0.2, v);
  },
};

export function useSound() {
  const enabled = useSettingsStore((s) => s.soundEnabled);
  const volume = useSettingsStore((s) => s.soundVolume);

  const play = (name: SoundName, completionStyle?: CompletionStyle) => {
    if (!enabled) return;
    const ctx = getContext();
    if (!ctx) return;
    const v = Math.max(0.02, Math.min(0.6, volume));
    if (name === "complete" && completionStyle && completionStyle !== "none") {
      CELEBRATION[completionStyle]?.(ctx, v);
      return;
    }
    PATTERNS[name]?.(ctx, v);
  };

  return { play };
}
