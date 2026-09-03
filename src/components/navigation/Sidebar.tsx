"use client";

import { Plus, CircleHelp, Keyboard } from "lucide-react";
import { NavLinks } from "@/components/navigation/Navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/stores/appStore";

export function Sidebar() {
  const openQuickCapture = useAppStore((s) => s.openQuickCapture);
  const openHelp = useAppStore((s) => s.openHelp);
  const openShortcuts = useAppStore((s) => s.openShortcuts);

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border-subtle bg-surface px-3 py-4 md:flex">
      <div className="mb-4 flex items-center justify-between px-3">
        <span className="text-lg font-semibold tracking-tight text-text-primary">
          DoTo
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={openQuickCapture}
          aria-label="Quick capture"
          title="Quick capture (Ctrl+K)"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="mb-3 px-1">
        <SearchBar />
      </div>
      <NavLinks />
      <div className="mt-auto flex flex-col gap-1 px-1 pt-6">
        <button
          type="button"
          onClick={openShortcuts}
          className="flex items-center gap-2 rounded-[var(--radius-md)] px-2.5 py-2 text-sm text-text-tertiary transition-colors hover:bg-hover hover:text-text-secondary"
        >
          <Keyboard className="h-4 w-4" />
          Shortcuts
          <kbd className="ml-auto rounded border border-border-subtle bg-hover px-1.5 text-[10px]">?</kbd>
        </button>
        <button
          type="button"
          onClick={openHelp}
          className="flex items-center gap-2 rounded-[var(--radius-md)] px-2.5 py-2 text-sm text-text-tertiary transition-colors hover:bg-hover hover:text-text-secondary"
        >
          <CircleHelp className="h-4 w-4" />
          User manual
        </button>
      </div>
    </aside>
  );
}
