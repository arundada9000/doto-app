import type { HTMLMotionProps } from "framer-motion";
import { useSettingsStore } from "@/lib/stores/settingsStore";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function getMotionEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return !reduce && !useSettingsStore.getState().reduceMotion;
}

export function fadeUp(distance = 12): HTMLMotionProps<"div">["initial"] {
  return {
    opacity: 0,
    y: distance,
  };
}

export function fadeUpAnimate(): HTMLMotionProps<"div">["animate"] {
  return { opacity: 1, y: 0 };
}

export function fadeUpTransition(delay = 0): HTMLMotionProps<"div">["transition"] {
  return {
    duration: 0.35,
    ease: EASE_OUT,
    delay,
  };
}

export function springPreset(): HTMLMotionProps<"div">["transition"] {
  return {
    type: "spring",
    stiffness: 400,
    damping: 30,
  };
}
