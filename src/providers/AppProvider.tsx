"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { ThemeApplier } from "@/providers/ThemeProvider";
import { FontApplier } from "@/providers/FontApplier";

export function AppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useSettingsStore.getState().hydrate();
    useItemsStore.getState().hydrate();
  }, []);

  return (
    <>
      <ThemeApplier />
      <FontApplier />
      {children}
    </>
  );
}
