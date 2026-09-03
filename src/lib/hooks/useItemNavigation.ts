"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/stores/appStore";

const ROW_SELECTOR = '[data-item-id] [role="button"]';

function anyOverlayOpen(): boolean {
  const s = useAppStore.getState();
  return (
    s.quickCaptureOpen ||
    s.searchOpen ||
    s.helpOpen ||
    s.onboardOpen ||
    s.shortcutsOpen ||
    s.editingItemId !== null
  );
}

/**
 * Roving focus across the visible item rows. The shortcuts hook already covers
 * navigating between views; this covers operating on what is in front of you,
 * which is where the keyboard previously ran out.
 */
export function useItemNavigation() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (isTyping || anyOverlayOpen()) return;

      const down = e.key === "j" || e.key === "ArrowDown";
      const up = e.key === "k" || e.key === "ArrowUp";
      if (!down && !up) return;

      const rows = [...document.querySelectorAll<HTMLElement>(ROW_SELECTOR)];
      if (rows.length === 0) return;

      e.preventDefault();

      const active = document.activeElement;
      const current = rows.findIndex(
        (row) => row === active || row.contains(active)
      );

      // With nothing focused, the first press enters the list from the edge the
      // key implies rather than jumping to an arbitrary row.
      let next: number;
      if (current === -1) {
        next = down ? 0 : rows.length - 1;
      } else {
        next = down
          ? Math.min(current + 1, rows.length - 1)
          : Math.max(current - 1, 0);
      }

      rows[next]?.focus();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
