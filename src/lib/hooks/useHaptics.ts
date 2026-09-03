"use client";

import { useSettingsStore } from "@/lib/stores/settingsStore";

type HapticPattern = "light" | "medium" | "heavy" | "success" | "warning";

function supportsNavigator(): boolean {
  return (
    typeof navigator !== "undefined" &&
    "vibrate" in navigator &&
    typeof navigator.vibrate === "function"
  );
}

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 8,
  medium: [10, 30, 10],
  heavy: [20, 40, 30],
  success: [10, 30, 20, 30, 30],
  warning: [15, 40, 15],
};

export function useHaptics() {
  const enabled = useSettingsStore((s) => s.hapticEnabled);

  const vibrate = (pattern: HapticPattern) => {
    if (!enabled) return;
    if (typeof navigator !== "undefined" && supportsNavigator()) {
      navigator.vibrate(PATTERNS[pattern]);
    }
  };

  return { vibrate };
}
