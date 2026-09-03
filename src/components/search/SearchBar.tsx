"use client";

import { Search } from "lucide-react";
import { useAppStore } from "@/lib/stores/appStore";

export function SearchBar() {
  const openSearch = useAppStore((s) => s.openSearch);
  return (
    <button
      type="button"
      onClick={openSearch}
      aria-label="Search"
      className="flex h-9 w-full max-w-xs items-center gap-2 rounded-[var(--radius-md)] border border-border-subtle bg-surface px-3 text-sm text-text-tertiary transition-colors hover:border-border-strong hover:text-text-secondary"
    >
      <Search className="h-4 w-4" />
      <span className="flex-1 text-left">Search everything…</span>
      <kbd className="hidden rounded border border-border-subtle bg-hover px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary sm:block">
        /
      </kbd>
    </button>
  );
}