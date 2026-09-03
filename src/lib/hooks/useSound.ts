"use client";

import { useSettingsStore } from "@/lib/stores/settingsStore";
import type { CompletionStyle } from "@/types";

type SoundName =
  | "complete"
  | "capture"
  | "error"
  | "confirm"
  | "reminder"
  | "dayComplete"
  | "uncomplete";

/**
 * Clearing several items in a row lifts the pitch a little each time, resetting
 * once you pause. It rewards a run while it is happening and stores nothing, so
 * there is no score to protect afterwards.
 */
const COMBO_WINDOW_MS = 10_000;
const COMBO_MAX_STEPS = 5;
const COMBO_STEP = 0.045;

let comboCount = 0;
let lastCompletionAt = 0;

function nextComboPitch(): number {
  const now = Date.now();
  comboCount =
    now - lastCompletionAt <= COMBO_WINDOW_MS
      ? Math.min(comboCount + 1, COMBO_MAX_STEPS)
      : 0;
  lastCompletionAt = now;
  return 1 + comboCount * COMBO_STEP;
}

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

type Pattern = (ctx: AudioContext, v: number, pitch: number) => void;

const PATTERNS: Record<SoundName, Pattern> = {
  complete: (ctx, v, p) => {
    tone(ctx, 660 * p, 0, 0.09, v);
    tone(ctx, 990 * p, 0.09, 0.16, v);
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
  // Undo, not achievement: descending and quieter than completing.
  uncomplete: (ctx, v) => {
    tone(ctx, 660, 0, 0.07, v * 0.75);
    tone(ctx, 440, 0.07, 0.12, v * 0.65);
  },
  // Reserved for clearing everything due today. Deliberately the only rising
  // four-note figure in the set, so it is unmistakable.
  dayComplete: (ctx, v) => {
    tone(ctx, 523, 0, 0.1, v);
    tone(ctx, 659, 0.1, 0.1, v);
    tone(ctx, 784, 0.2, 0.1, v);
    tone(ctx, 1047, 0.3, 0.32, v * 0.9);
  },
};

const CELEBRATION: Record<CompletionStyle, Pattern> = {
  none: () => {},
  confetti: (ctx, v, p) => {
    tone(ctx, 784 * p, 0, 0.08, v);
    tone(ctx, 988 * p, 0.08, 0.08, v);
    tone(ctx, 1319 * p, 0.16, 0.2, v * 0.9);
  },
  strikethrough: (ctx, v, p) => {
    tone(ctx, 556 * p, 0, 0.06, v);
    tone(ctx, 832 * p, 0.06, 0.12, v);
  },
  burn: (ctx, v, p) => {
    tone(ctx, 440 * p, 0, 0.05, v);
    tone(ctx, 392 * p, 0.05, 0.06, v * 0.8);
    tone(ctx, 330 * p, 0.11, 0.2, v * 0.6);
  },
  melt: (ctx, v, p) => {
    tone(ctx, 880 * p, 0, 0.06, v);
    tone(ctx, 660 * p, 0.07, 0.06, v * 0.8);
    tone(ctx, 494 * p, 0.14, 0.16, v * 0.6);
  },
  check: (ctx, v, p) => {
    tone(ctx, 523 * p, 0, 0.07, v);
    tone(ctx, 784 * p, 0.07, 0.2, v);
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
    const pitch = name === "complete" ? nextComboPitch() : 1;
    if (name === "complete" && completionStyle && completionStyle !== "none") {
      CELEBRATION[completionStyle]?.(ctx, v, pitch);
      return;
    }
    PATTERNS[name]?.(ctx, v, pitch);
  };

  return { play };
}
