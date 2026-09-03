"use client";

import { useMemo } from "react";
import { useItemsStore } from "@/lib/stores/itemsStore";

/**
 * Every tag already in use, most used first. Surfacing these is what stops a
 * tag vocabulary from fragmenting into near-duplicates nobody can search.
 */
export function useKnownTags(): string[] {
  const items = useItemsStore((s) => s.items);

  return useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      for (const tag of item.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
  }, [items]);
}

export interface ActiveTag {
  query: string;
  /** Index in the raw value where the tag name (after the hash) begins. */
  start: number;
}

/** The tag being typed at the caret, if the caret sits inside one. */
export function activeTagAt(value: string, caret: number): ActiveTag | null {
  const upto = value.slice(0, caret);
  const match = upto.match(/(?:^|\s)#([a-z0-9][\w-]*)?$/i);
  if (!match) return null;
  const query = (match[1] ?? "").toLowerCase();
  return { query, start: caret - query.length };
}
