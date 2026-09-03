"use client";

import { Sidebar } from "@/components/navigation/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { QuickCapture } from "@/components/capture/QuickCapture";
import { Toaster } from "@/components/ui/Toaster";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { ItemEditor } from "@/components/items/ItemEditor";
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import { useServiceWorker } from "@/lib/hooks/useServiceWorker";
import { useCaptureQuery } from "@/lib/hooks/useCaptureQuery";

export function AppShell({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  useServiceWorker();
  useCaptureQuery();

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
      </div>
      <BottomNav />
      <QuickCapture />
      <SearchOverlay />
      <ItemEditor />
      <Toaster />
    </div>
  );
}
