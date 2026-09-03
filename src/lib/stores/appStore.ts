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
  captureType: "task" | "note" | "auto";
  setCaptureType: (t: "task" | "note" | "auto") => void;
  editingItemId: string | null;
  openItem: (id: string) => void;
  closeItem: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  quickCaptureOpen: false,
  openQuickCapture: () => set({ quickCaptureOpen: true }),
  closeQuickCapture: () => set({ quickCaptureOpen: false }),

  searchOpen: false,
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),

  helpOpen: false,
  openHelp: () => set({ helpOpen: true }),
  closeHelp: () => set({ helpOpen: false }),

  captureType: "auto",
  setCaptureType: (captureType) => set({ captureType }),

  editingItemId: null,
  openItem: (editingItemId) => set({ editingItemId }),
  closeItem: () => set({ editingItemId: null }),
}));
