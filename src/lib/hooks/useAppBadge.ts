"use client";

import { useEffect } from "react";
import { useItemsStore } from "@/lib/stores/itemsStore";

/**
 * Mirrors the count of things actually due onto the installed app icon: items
 * due today or already overdue and not yet done. Anything captured for later is
 * excluded, since a badge counting the whole inbox would only teach people to
 * ignore it.
 */
export function useAppBadge() {
  const items = useItemsStore((s) => s.items);
  const loading = useItemsStore((s) => s.loading);

  useEffect(() => {
    if (loading || typeof navigator === "undefined") return;
    if (!("setAppBadge" in navigator)) return;

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const cutoff = endOfToday.getTime();

    const count = items.filter(
      (i) => !i.completed && i.dueAt !== undefined && i.dueAt <= cutoff
    ).length;

    // Both calls reject on platforms that expose the API but refuse it, which
    // is not worth surfacing to anyone.
    if (count > 0) {
      void navigator.setAppBadge(count).catch(() => {});
    } else {
      void navigator.clearAppBadge().catch(() => {});
    }
  }, [items, loading]);
}
