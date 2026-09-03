import { create } from "zustand";
import type {
  ThemeName,
  FontFamilyName,
  ContextMenuStyle,
  CursorStyle,
  CompletionStyle,
  Settings,
} from "@/types";
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
  contextMenu: "native",
  cursor: "native",
  completion: "confetti",
  profileName: "",
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
  setContextMenu: (style: ContextMenuStyle) => void;
  setCursor: (cursor: CursorStyle) => void;
  setCompletion: (completion: CompletionStyle) => void;
  setProfileName: (name: string) => void;
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
    contextMenu: state.contextMenu,
    cursor: state.cursor,
    completion: state.completion,
    profileName: state.profileName,
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

  setContextMenu: (contextMenu) => {
    set({ contextMenu });
    persist(get());
  },

  setCursor: (cursor) => {
    set({ cursor });
    persist(get());
  },

  setCompletion: (completion) => {
    set({ completion });
    persist(get());
  },

  setProfileName: (profileName) => {
    set({ profileName });
    persist(get());
  },
}));
