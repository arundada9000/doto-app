import { create } from "zustand";

interface AppState {
  quickCaptureOpen: boolean;
  openQuickCapture: () => void;
  closeQuickCapture: () => void;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
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

  captureType: "auto",
  setCaptureType: (captureType) => set({ captureType }),

  editingItemId: null,
  openItem: (editingItemId) => set({ editingItemId }),
  closeItem: () => set({ editingItemId: null }),
}));
