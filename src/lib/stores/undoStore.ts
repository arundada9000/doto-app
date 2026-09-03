import { create } from "zustand";
import { nanoid } from "nanoid";

export interface UndoEntry {
  id: string;
  /** Shown when the action is undone, e.g. "Completion undone". */
  label: string;
  run: () => void | Promise<void>;
}

/** Deep enough to walk back a mistaken run, shallow enough to stay honest. */
const MAX_ENTRIES = 25;

interface UndoState {
  entries: UndoEntry[];
  push: (label: string, run: UndoEntry["run"]) => void;
  /** Removes and returns the most recent entry, or null when empty. */
  pop: () => UndoEntry | null;
  clear: () => void;
}

export const useUndoStore = create<UndoState>((set, get) => ({
  entries: [],

  push: (label, run) =>
    set((state) => ({
      entries: [...state.entries, { id: nanoid(), label, run }].slice(
        -MAX_ENTRIES
      ),
    })),

  pop: () => {
    const entries = get().entries;
    if (entries.length === 0) return null;
    const entry = entries[entries.length - 1];
    set({ entries: entries.slice(0, -1) });
    return entry;
  },

  clear: () => set({ entries: [] }),
}));
