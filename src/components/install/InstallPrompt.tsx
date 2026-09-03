"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { useInstallPrompt } from "@/lib/hooks/useInstallPrompt";

export function InstallPrompt() {
  const { canInstall, promptInstall, dismiss } = useInstallPrompt();

  return (
    <AnimatePresence>
      {canInstall && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-20 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised p-3.5 shadow-lg md:bottom-6"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent-soft text-accent">
            <Download className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text-primary">
              Install DoTo
            </p>
            <p className="text-xs text-text-tertiary">
              Faster to open, works offline, like an app.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => void promptInstall()}
              className="rounded-[var(--radius-md)] bg-accent px-3 py-1.5 text-xs font-medium text-text-onAccent transition-colors hover:bg-accent-hover"
            >
              Install
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-text-tertiary transition-colors hover:bg-hover hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}