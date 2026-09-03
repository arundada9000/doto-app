"use client";

import {
  MousePointer2,
  Layers,
  Check,
  Type,
  Volume2,
  Sunrise,
  BookOpen,
  ChevronRight,
  Puzzle,
  User,
  Bell,
} from "lucide-react";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { useAppStore } from "@/lib/stores/appStore";
import { DataSettings } from "@/components/settings/DataSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import type {
  ThemeName,
  FontFamilyName,
  ContextMenuStyle,
  CursorStyle,
  CompletionStyle,
} from "@/types";
import { cn } from "@/lib/utils/cn";

const THEMES: { name: ThemeName; label: string; swatch: string }[] = [
  { name: "system", label: "System", swatch: "linear-gradient(135deg,#f4f5f7 50%,#101114 50%)" },
  { name: "paper", label: "Paper", swatch: "#f6f1e8" },
  { name: "midnight", label: "Midnight", swatch: "#0a0d14" },
  { name: "ocean", label: "Ocean", swatch: "#eef4fb" },
  { name: "forest", label: "Forest", swatch: "#eef3ec" },
  { name: "lavender", label: "Lavender", swatch: "#f4f1fb" },
  { name: "sunset", label: "Sunset", swatch: "#fbf0ea" },
  { name: "rose", label: "Rose", swatch: "#faf1f2" },
  { name: "graphite", label: "Graphite", swatch: "#f3f4f5" },
  { name: "nordic", label: "Nordic", swatch: "#eef2f1" },
  { name: "solar", label: "Solar", swatch: "#faf5eb" },
  { name: "monochrome", label: "Monochrome", swatch: "#f4f4f4" },
  { name: "plum", label: "Plum", swatch: "#201a28" },
  { name: "ember", label: "Ember", swatch: "#211915" },
  { name: "slate", label: "Slate", swatch: "#172027" },
  { name: "copper", label: "Copper", swatch: "#1d1b17" },
];

const FONTS: { name: FontFamilyName; label: string }[] = [
  { name: "system", label: "System" },
  { name: "serif", label: "Serif" },
  { name: "mono", label: "Monospace" },
  { name: "rounded", label: "Rounded" },
  { name: "lora", label: "Lora" },
];

const CURSORS: { name: CursorStyle; label: string; shape: string }[] = [
  { name: "native", label: "Native", shape: "▸" },
  { name: "pointer", label: "Pointer", shape: "●" },
  { name: "ring", label: "Ring", shape: "◎" },
  { name: "dot", label: "Dot", shape: "○" },
  { name: "diamond", label: "Diamond", shape: "◇" },
  { name: "crosshair", label: "Target", shape: "⊕" },
];

const CONTEXT_MENUS: { name: ContextMenuStyle; label: string; desc: string }[] = [
  { name: "native", label: "Native", desc: "OS default" },
  { name: "minimal", label: "Minimal", desc: "Clean & flat" },
  { name: "rounded", label: "Rounded", desc: "Soft & friendly" },
  { name: "glass", label: "Glass", desc: "Frosted panels" },
];

const COMPLETIONS: { name: CompletionStyle; label: string; preview: string }[] = [
  { name: "none", label: "None", preview: "·" },
  { name: "confetti", label: "Confetti", preview: "🎉" },
  { name: "strikethrough", label: "Draw", preview: "✓" },
  { name: "burn", label: "Burn", preview: "🔥" },
  { name: "melt", label: "Melt", preview: "🧊" },
  { name: "check", label: "Check pop", preview: "✔" },
];

export function SettingsView() {
  const settings = useSettingsStore();
  const openHelp = useAppStore((s) => s.openHelp);
  const {
    theme, fontFamily, fontSize,
    soundEnabled, hapticEnabled, reduceMotion,
    contextMenu, cursor, completion, profileName,
    setTheme, setFontFamily, setFontSize,
    setSoundEnabled, setHapticEnabled, setReduceMotion,
    setContextMenu, setCursor, setCompletion, setProfileName,
  } = settings;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
        Settings
      </h1>
      <p className="pt-0.5 text-sm text-text-secondary">
        Make DoTo feel like yours.
      </p>

      <Section icon={<User className="h-4 w-4" />} title="Profile">
        <label className="mb-1.5 block text-sm text-text-secondary">
          Your name
        </label>
        <input
          type="text"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          placeholder="e.g. Arun"
          maxLength={40}
          className="w-full rounded-[var(--radius-md)] border border-border-subtle bg-surface-secondary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        />
        <p className="mt-1.5 text-xs text-text-tertiary">
          Shown as a greeting on your capture views.
        </p>
      </Section>

      <Section icon={<Sunrise className="h-4 w-4" />} title="Appearance">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {THEMES.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setTheme(t.name)}
              aria-pressed={theme === t.name}
              aria-label={`${t.label} theme`}
              className={cn(
                "flex flex-col items-center gap-2 rounded-[var(--radius-md)] border p-2.5 transition-colors",
                theme === t.name
                  ? "border-accent bg-accent-soft"
                  : "border-border-subtle hover:border-border-strong"
              )}
            >
              <span
                className="h-10 w-10 rounded-full border border-border-subtle"
                style={{ background: t.swatch }}
              />
              <span className={cn(
                "text-xs",
                theme === t.name ? "font-medium text-accent" : "text-text-secondary"
              )}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </Section>

      <Section icon={<Type className="h-4 w-4" />} title="Font & size">
        <div className="flex gap-2">
          {FONTS.map((f) => (
            <button
              key={f.name}
              type="button"
              onClick={() => setFontFamily(f.name)}
              aria-pressed={fontFamily === f.name}
              className={cn(
                "flex-1 rounded-[var(--radius-md)] border px-3 py-2.5 text-sm transition-colors",
                fontFamily === f.name
                  ? "border-accent bg-accent-soft font-medium text-accent"
                  : "border-border-subtle text-text-secondary hover:border-border-strong"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-text-tertiary">A</span>
          <input
            type="range"
            min={14}
            max={20}
            step={1}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            aria-label="Text size"
            className="flex-1 accent-accent"
          />
          <span className="text-lg text-text-tertiary">A</span>
        </div>
      </Section>

      <Section icon={<Volume2 className="h-4 w-4" />} title="Feedback">
        <ToggleRow
          label="Sound effects"
          description="Play subtle sounds when you complete or capture"
          checked={soundEnabled}
          onChange={setSoundEnabled}
        />
        <ToggleRow
          label="Haptics"
          description="Vibrate on meaningful actions where supported"
          checked={hapticEnabled}
          onChange={setHapticEnabled}
        />
        <ToggleRow
          label="Reduce motion"
          description="Minimize animations and transitions"
          checked={reduceMotion}
          onChange={setReduceMotion}
        />
      </Section>

      <Section icon={<Bell className="h-4 w-4" />} title="Reminders">
        <NotificationSettings />
      </Section>

      <Section icon={<MousePointer2 className="h-4 w-4" />} title="Cursor">
        <p className="mb-3 text-sm text-text-tertiary">
          Replace the native pointer with a custom cursor (desktop only).
        </p>
        <OptionGrid>
          {CURSORS.map((c) => (
            <OptionButton
              key={c.name}
              label={c.label}
              selected={cursor === c.name}
              onClick={() => setCursor(c.name)}
              preview={
                <span
                  className={cn(
                    "flex h-8 w-full items-center justify-center transition-colors",
                    cursor === c.name ? "text-accent" : "text-text-secondary"
                  )}
                >
                  <span className="text-xl leading-none">{c.shape}</span>
                </span>
              }
            />
          ))}
        </OptionGrid>
      </Section>

      <Section icon={<Layers className="h-4 w-4" />} title="Context menu">
        <p className="mb-3 text-sm text-text-tertiary">
          Choose how the right-click menu looks. Try it anywhere in the app.
        </p>
        <OptionGrid>
          {CONTEXT_MENUS.map((m) => (
            <OptionButton
              key={m.name}
              label={m.label}
              selected={contextMenu === m.name}
              onClick={() => setContextMenu(m.name)}
              preview={
                <div
                  className={cn(
                    "mx-auto mt-1 flex h-8 w-24 items-center justify-center rounded-[var(--radius-sm)] border text-center text-[10px] transition-colors",
                    contextMenu === m.name
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border-subtle bg-hover text-text-tertiary",
                    m.name === "glass" && "backdrop-blur-md"
                  )}
                >
                  ⋮ menu
                </div>
              }
            />
          ))}
        </OptionGrid>
      </Section>

      <Section icon={<Puzzle className="h-4 w-4" />} title="Completion reward">
        <p className="mb-3 text-sm text-text-tertiary">
          Pick a satisfying celebration to play when you finish a task.
        </p>
        <OptionGrid>
          {COMPLETIONS.map((c) => (
            <OptionButton
              key={c.name}
              label={c.label}
              selected={completion === c.name}
              onClick={() => setCompletion(c.name)}
              preview={
                <span
                  className={cn(
                    "mx-auto flex h-8 w-11 items-center justify-center rounded-[var(--radius-sm)] border text-base transition-colors",
                    completion === c.name
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border-subtle bg-hover text-text-secondary"
                  )}
                >
                  {c.preview}
                </span>
              }
            />
          ))}
        </OptionGrid>
      </Section>

      <Section icon={<BookOpen className="h-4 w-4" />} title="Help">
        <p className="mb-3 text-sm text-text-tertiary">
          Learn the ropes with a quick guided tour of every feature.
        </p>
        <button
          type="button"
          onClick={openHelp}
          className="flex w-full items-center justify-between rounded-[var(--radius-md)] border border-border-subtle bg-surface-secondary px-4 py-3 text-left text-sm font-medium text-text-primary transition-colors hover:border-border-strong"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-accent" />
            Open the user manual
          </span>
          <ChevronRight className="h-4 w-4 text-text-tertiary" />
        </button>
      </Section>

      <DataSettings />
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <h2 className="mb-2.5 flex items-center gap-2 text-sm font-medium text-text-secondary">
        {icon}
        {title}
      </h2>
      <div className="rounded-[var(--radius-lg)] border border-border-subtle bg-surface p-4">
        {children}
      </div>
    </section>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-[0.9375rem] text-text-primary">{label}</p>
        <p className="text-sm text-text-tertiary">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-accent" : "bg-border-strong"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-all",
            checked ? "left-[22px]" : "left-0.5"
          )}
        >
          {checked && <Check className="h-3.5 w-3.5 text-accent" strokeWidth={3} />}
        </span>
      </button>
    </div>
  );
}

function OptionGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{children}</div>;
}

function OptionButton({
  label,
  selected,
  onClick,
  preview,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  preview: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex flex-col items-center gap-1 rounded-[var(--radius-md)] border p-2.5 transition-colors",
        selected
          ? "border-accent bg-accent-soft"
          : "border-border-subtle hover:border-border-strong"
      )}
    >
      {preview}
      <span
        className={cn(
          "text-xs",
          selected ? "font-medium text-accent" : "text-text-secondary"
        )}
      >
        {label}
      </span>
    </button>
  );
}
