import { create } from "zustand";
import { nanoid } from "nanoid";
import type { CompletionStyle } from "@/types";

export interface CelebrationRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Celebration {
  id: string;
  style: CompletionStyle;
  rect: CelebrationRect;
}

/**
 * Each effect settles at its own pace, so the overlay is torn down exactly when
 * that animation ends instead of being cut short or left hanging on screen.
 */
export const CELEBRATION_DURATION: Record<CompletionStyle, number> = {
  none: 0,
  confetti: 1000,
  strikethrough: 800,
  burn: 950,
  melt: 750,
  check: 700,
};

interface CelebrationState {
  celebrations: Celebration[];
  celebrate: (style: CompletionStyle, rect: CelebrationRect) => void;
  clear: (id: string) => void;
}

export const useCelebrationStore = create<CelebrationState>((set) => ({
  celebrations: [],

  celebrate: (style, rect) => {
    if (style === "none") return;
    const id = nanoid();
    set((state) => ({
      celebrations: [...state.celebrations, { id, style, rect }],
    }));
    setTimeout(() => {
      set((state) => ({
        celebrations: state.celebrations.filter((c) => c.id !== id),
      }));
    }, CELEBRATION_DURATION[style]);
  },

  clear: (id) =>
    set((state) => ({
      celebrations: state.celebrations.filter((c) => c.id !== id),
    })),
}));
