"use client";

import { Plus } from "lucide-react";
import { NavLinks } from "@/components/navigation/Navigation";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/stores/appStore";

export function Sidebar() {
  const openQuickCapture = useAppStore((s) => s.openQuickCapture);

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
      <NavLinks />
    </aside>
  );
}
