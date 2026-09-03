"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  Upload,
  Trash2,
  RotateCcw,
  SlidersHorizontal,
  HardDrive,
  AlertTriangle,
} from "lucide-react";
import {
  buildExport,
  downloadExport,
  parseImport,
  applyImport,
  wipeAllData,
} from "@/lib/data";
import { useToastStore } from "@/lib/stores/toastStore";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import {
  estimateStorage,
  formatBytes,
  STORAGE_WARN_RATIO,
  type StorageEstimate,
} from "@/lib/utils/storage";

const EASE = [0.16, 1, 0.3, 1] as const;

export function DataSettings() {
  const toast = useToastStore((s) => s.toast);
  const fileRef = useRef<HTMLInputElement>(null);
  const resetSettings = useSettingsStore((s) => s.resetSettings);
  const [confirming, setConfirming] = useState(false);
  const [resetConfirming, setResetConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [storage, setStorage] = useState<StorageEstimate | null>(null);

  useEffect(() => {
    let active = true;
    void estimateStorage().then((s) => {
      if (active) setStorage(s);
    });
    return () => {
      active = false;
    };
  }, [busy]);

  const handleExport = async () => {
    try {
      const data = await buildExport();
      downloadExport(data);
      toast("Backup downloaded", "success");
    } catch {
      toast("Export failed", "error");
    }
  };

  const handleImportFile = async (file: File) => {
    setBusy(true);
    try {
      const text = await file.text();
      const data = parseImport(text);
      if (!data) {
        toast("Not a DoTo backup", "error");
        return;
      }
      await applyImport(data);
      toast(
        `Imported ${data.items.length} item${data.items.length === 1 ? "" : "s"}`,
        "success"
      );
    } catch {
      toast("Import failed", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleResetSettings = async () => {
    setBusy(true);
    try {
      await resetSettings();
      setResetConfirming(false);
      toast("Settings back to defaults", "success");
    } catch {
      toast("Could not reset settings", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleWipe = async () => {
    setBusy(true);
    try {
      await wipeAllData();
      setConfirming(false);
      toast("All cleared", "success");
    } catch {
      toast("Couldn't clear data", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-7">
      <h2 className="mb-2.5 flex items-center gap-2 text-sm font-medium text-text-secondary">
        <RotateCcw className="h-4 w-4" />
        What happens to my data?
      </h2>
      <div className="rounded-[var(--radius-lg)] border border-border-subtle bg-surface p-4">
        <p className="mb-4 text-sm leading-relaxed text-text-tertiary">
          DoTo is fully offline. Your data never leaves this device unless you
          download a backup.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={busy}
            className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border-subtle px-3.5 py-2 text-sm font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-hover disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export backup
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border-subtle px-3.5 py-2 text-sm font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-hover disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            Import backup
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImportFile(file);
            e.target.value = "";
          }}
        />

        <StorageMeter storage={storage} />

        <div className="my-4 h-px bg-border-subtle" />

        <AnimatePresence mode="wait" initial={false}>
          {!resetConfirming ? (
            <motion.button
              key="reset"
              type="button"
              onClick={() => setResetConfirming(true)}
              disabled={busy}
              className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border-subtle px-3.5 py-2 text-sm font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-hover disabled:opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Reset settings to defaults
            </motion.button>
          ) : (
            <motion.div
              key="reset-confirm"
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE }}
            >
              <p className="text-sm text-text-secondary">
                Theme, font, sounds, haptics, cursor, and completion style go
                back to their defaults. Your tasks and notes are not touched.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleResetSettings()}
                  disabled={busy}
                  className="flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-3.5 py-2 text-sm font-medium text-text-onAccent transition-colors hover:bg-accent-hover disabled:opacity-50"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Reset settings
                </button>
                <button
                  type="button"
                  onClick={() => setResetConfirming(false)}
                  disabled={busy}
                  className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border-subtle px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="my-4 h-px bg-border-subtle" />

        <AnimatePresence mode="wait" initial={false}>
          {!confirming ? (
            <motion.button
              key="wipe"
              type="button"
              onClick={() => setConfirming(true)}
              disabled={busy}
              className="flex items-center gap-2 rounded-[var(--radius-md)] border border-error/40 bg-error/10 px-3.5 py-2 text-sm font-medium text-error transition-colors hover:bg-error/20 disabled:opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Trash2 className="h-4 w-4" />
              Delete all data
            </motion.button>
          ) : (
            <motion.div
              key="confirm"
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE }}
            >
              <p className="text-sm text-text-secondary">
                This permanently deletes{" "}
                <span className="font-medium text-error">everything</span>:
                tasks, notes, and settings. There is no undo. Consider an export
                first.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleWipe()}
                  disabled={busy}
                  className="flex items-center gap-2 rounded-[var(--radius-md)] bg-error px-3.5 py-2 text-sm font-medium text-text-onAccent transition-colors hover:opacity-90 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Yes, delete everything
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={busy}
                  className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border-subtle px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
/**
 * Attachments are stored as Blobs in IndexedDB, where a full device fails
 * writes silently. Surfacing the pressure early leaves room to export first.
 */
function StorageMeter({ storage }: { storage: StorageEstimate | null }) {
  if (!storage || storage.ratio === null) return null;

  const pct = Math.min(100, Math.round(storage.ratio * 100));
  const tight = storage.ratio >= STORAGE_WARN_RATIO;

  return (
    <div className="mt-4">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-medium text-text-secondary">
          {tight ? (
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
          ) : (
            <HardDrive className="h-3.5 w-3.5" />
          )}
          On-device storage
        </span>
        <span className="tabular-nums text-text-tertiary">
          {formatBytes(storage.usedBytes)} of {formatBytes(storage.quotaBytes)}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-hover"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="On-device storage used"
      >
        <motion.div
          className={tight ? "h-full bg-warning" : "h-full bg-accent"}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: EASE }}
        />
      </div>
      {tight && (
        <p className="mt-1.5 text-xs text-warning">
          Storage is nearly full. Export a backup and remove large attachments
          before adding more.
        </p>
      )}
    </div>
  );
}
