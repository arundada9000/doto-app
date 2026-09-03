"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/stores/settingsStore";

const FONT_VARS: Record<string, string> = {
  system: "var(--font-geist-sans)",
  serif: "var(--font-serif)",
  mono: "var(--font-geist-mono)",
};

export function FontApplier() {
  const fontFamily = useSettingsStore((s) => s.fontFamily);
  const fontSize = useSettingsStore((s) => s.fontSize);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-body",
      FONT_VARS[fontFamily] ?? FONT_VARS.system
    );
  }, [fontFamily]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "font-size",
      `${fontSize}px`
    );
  }, [fontSize]);

  return null;
}
