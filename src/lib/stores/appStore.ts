import { create } from "zustand";

interface AppState {
  quickCaptureOpen: boolean;
  openQuickCapture: () => void;
  closeQuickCapture: () => void;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  helpOpen: boolean;
  openHelp: () => void;
  closeHelp: () => void;
  onboardOpen: boolean;
  openOnboard: () => void;
  closeOnboard: () => void;
  shortcutsOpen: boolean;
  openShortcuts: () => void;
  closeShortcuts: () => void;
  captureType: "task" | "note" | "auto";
  setCaptureType: (t: "task" | "note" | "auto") => void;
  editingItemId: string | null;
  openItem: (id: string) => void;
  closeItem: () => void;
  /**
   * Dismisses the topmost open layer and reports whether there was one.
   * Escape closes a single layer at a time rather than every open surface.
   */
  closeTopLayer: () => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  quickCaptureOpen: false,
  openQuickCapture: () => set({ quickCaptureOpen: true }),
  closeQuickCapture: () => set({ quickCaptureOpen: false }),

  searchOpen: false,
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),

  helpOpen: false,
  openHelp: () => set({ helpOpen: true }),
  closeHelp: () => set({ helpOpen: false }),

  onboardOpen: false,
  openOnboard: () => set({ onboardOpen: true }),
  closeOnboard: () => set({ onboardOpen: false }),

  shortcutsOpen: false,
  openShortcuts: () => set({ shortcutsOpen: true }),
  closeShortcuts: () => set({ shortcutsOpen: false }),

  captureType: "auto",
  setCaptureType: (captureType) => set({ captureType }),

  editingItemId: null,
  openItem: (editingItemId) => set({ editingItemId }),
  closeItem: () => set({ editingItemId: null }),

  closeTopLayer: () => {
    const s = get();
    // Ordered outermost-last: whichever surface sits on top gives way first.
    if (s.shortcutsOpen) return set({ shortcutsOpen: false }), true;
    if (s.onboardOpen) return set({ onboardOpen: false }), true;
    if (s.helpOpen) return set({ helpOpen: false }), true;
    if (s.quickCaptureOpen) return set({ quickCaptureOpen: false }), true;
    if (s.editingItemId !== null) return set({ editingItemId: null }), true;
    if (s.searchOpen) return set({ searchOpen: false }), true;
    return false;
  },
}));
