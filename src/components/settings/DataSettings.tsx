"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Upload, Trash2, RotateCcw } from "lucide-react";
import {
  buildExport,
  downloadExport,
  parseImport,
  applyImport,
  wipeAllData,
} from "@/lib/data";
import { useToastStore } from "@/lib/stores/toastStore";

const EASE = [0.16, 1, 0.3, 1] as const;

export function DataSettings() {
  const toast = useToastStore((s) => s.toast);
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

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
                <span className="font-medium text-error">everything</span> —
                tasks, notes, settings. No undo. Consider an export first.
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