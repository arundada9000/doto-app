"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/stores/settingsStore";

function resolveResolvedTheme(theme: string) {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "light";
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return dark ? "dark" : "light";
}

export function ThemeApplier() {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const resolved = resolveResolvedTheme(theme);
    document.documentElement.dataset.theme = resolved;
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const current = useSettingsStore.getState().theme;
      if (current === "system") {
        document.documentElement.dataset.theme = media.matches ? "dark" : "light";
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return null;
}
