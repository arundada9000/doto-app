"use client";

import { useEffect } from "react";
import { Search } from "lucide-react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { QuickCapture } from "@/components/capture/QuickCapture";
import { Toaster } from "@/components/ui/Toaster";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { useAppStore } from "@/lib/stores/appStore";
import { ItemEditor } from "@/components/items/ItemEditor";
import { ContextMenuProvider } from "@/components/contextmenu/ContextMenuProvider";
import { CursorProvider } from "@/components/cursor/CursorProvider";
import { HelpOverlay } from "@/components/help/HelpOverlay";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import { useServiceWorker } from "@/lib/hooks/useServiceWorker";
import { useCaptureQuery } from "@/lib/hooks/useCaptureQuery";

export function AppShell({ children }: { children: React.ReactNode }) {
  const openSearch = useAppStore((s) => s.openSearch);
  const openOnboard = useAppStore((s) => s.openOnboard);
  useKeyboardShortcuts();
  useServiceWorker();
  useCaptureQuery();
  useFirstVisit(openOnboard);

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
      </div>
      <button
        type="button"
        onClick={openSearch}
        aria-label="Search"
        className="fixed bottom-20 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-text-onAccent shadow-lg transition-transform active:scale-95 md:hidden"
      >
        <Search className="h-5 w-5" />
      </button>
      <BottomNav />
      <QuickCapture />
      <SearchOverlay />
      <ItemEditor />
      <ContextMenuProvider />
      <CursorProvider />
      <HelpOverlay />
      <OnboardingTour />
      <Toaster />
    </div>
  );
}

function useFirstVisit(openHelp: () => void) {
  useEffect(() => {
    try {
      if (localStorage.getItem("doto-help-seen")) return;
      const id = setTimeout(() => {
        openHelp();
        localStorage.setItem("doto-help-seen", "1");
      }, 700);
      return () => clearTimeout(id);
    } catch {
      // storage unavailable; just skip auto-onboarding
    }
  }, [openHelp]);
}
