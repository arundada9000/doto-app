import { create } from "zustand";
import type { ThemeName, FontFamilyName, Settings } from "@/types";
import { settingsTable } from "@/lib/db";

const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  fontFamily: "system",
  fontSize: 16,
  soundEnabled: true,
  soundVolume: 0.5,
  hapticEnabled: true,
  reduceMotion: false,
  autoTimezone: true,
};

interface SettingsState extends Settings {
  loaded: boolean;
  hydrate: () => Promise<void>;
  setTheme: (theme: ThemeName) => void;
  setFontFamily: (font: FontFamilyName) => void;
  setFontSize: (size: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setHapticEnabled: (enabled: boolean) => void;
  setReduceMotion: (reduce: boolean) => void;
}

async function persist(state: SettingsState) {
  const settings: Settings = {
    theme: state.theme,
    fontFamily: state.fontFamily,
    fontSize: state.fontSize,
    soundEnabled: state.soundEnabled,
    soundVolume: state.soundVolume,
    hapticEnabled: state.hapticEnabled,
    reduceMotion: state.reduceMotion,
    autoTimezone: state.autoTimezone,
  };
  await settingsTable.put({ key: "settings", value: settings });
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  loaded: false,

  hydrate: async () => {
    try {
      const row = await settingsTable.get("settings");
      if (row) {
        set({ ...row.value, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },

  setTheme: (theme) => {
    set({ theme });
    persist(get());
  },

  setFontFamily: (fontFamily) => {
    set({ fontFamily });
    persist(get());
  },

  setFontSize: (fontSize) => {
    set({ fontSize });
    persist(get());
  },

  setSoundEnabled: (soundEnabled) => {
    set({ soundEnabled });
    persist(get());
  },

  setSoundVolume: (soundVolume) => {
    set({ soundVolume });
    persist(get());
  },

  setHapticEnabled: (hapticEnabled) => {
    set({ hapticEnabled });
    persist(get());
  },

  setReduceMotion: (reduceMotion) => {
    set({ reduceMotion });
    persist(get());
  },
}));
