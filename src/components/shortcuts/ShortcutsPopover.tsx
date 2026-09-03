"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { useAppStore } from "@/lib/stores/appStore";

const SHORTCUTS: { keys: string[][] | string; action: string }[] = [
  { action: "Capture", keys: "Ctrl/⌘ + K" },
  { action: "New task", keys: "Ctrl/⌘ + K" },
  { action: "Search", keys: "/ or Ctrl/⌘ + F" },
  { action: "Today", keys: "T" },
  { action: "Inbox", keys: "I" },
  { action: "Completed", keys: "C" },
  { action: "Settings", keys: "S" },
  { action: "Move between items", keys: "J / K or Arrows" },
  { action: "Complete focused item", keys: "Space" },
  { action: "Open focused item", keys: "Enter" },
  { action: "Command mode", keys: "> in capture" },
  { action: "Close", keys: "Esc" },
];

export function ShortcutsPopover() {
  const open = useAppStore((s) => s.shortcutsOpen);
  const close = useAppStore((s) => s.closeShortcuts);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-overlay/60 px-4 flex items-end justify-center pb-6 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm overflow-hidden rounded-[var(--radius-xl)] border border-border-subtle bg-surface-raised shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-accent" />
                <h2 className="text-sm font-semibold text-text-primary">
                  Keyboard shortcuts
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-text-tertiary transition-colors hover:bg-hover hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="max-h-[55vh] flex-col overflow-y-auto p-2">
              {SHORTCUTS.map((s) => (
                <li
                  key={s.action}
                  className="flex items-center justify-between rounded-[var(--radius-md)] px-3 py-2.5 text-sm"
                >
                  <span className="text-text-primary">{s.action}</span>
                  <kbd className="rounded border border-border-strong bg-hover px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                    {s.keys}
                  </kbd>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}