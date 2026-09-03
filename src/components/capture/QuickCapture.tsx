"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/stores/appStore";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useToastStore } from "@/lib/stores/toastStore";
import { parseCapture, extractLink } from "@/lib/utils/nlp";
import { useSound } from "@/lib/hooks/useSound";
import { useHaptics } from "@/lib/hooks/useHaptics";
import type { ItemType } from "@/types";

const TYPE_LABELS: Record<string, string> = {
  auto: "Smart",
  task: "Task",
  note: "Note",
};

export function QuickCapture() {
  const open = useAppStore((s) => s.quickCaptureOpen);
  const close = useAppStore((s) => s.closeQuickCapture);

  return (
    <AnimatePresence>
      {open && <CaptureDialog key="capture-dialog" onClose={close} />}
    </AnimatePresence>
  );
}

function CaptureDialog({ onClose }: { onClose: () => void }) {
  const captureType = useAppStore((s) => s.captureType);
  const addItem = useItemsStore((s) => s.addItem);
  const toast = useToastStore((s) => s.toast);
  const { play } = useSound();
  const { vibrate } = useHaptics();

  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(id);
  }, []);

  const parsed = value.trim() ? parseCapture(value) : null;

  const submit = async () => {
    const text = value.trim();
    if (!text) return;

    const p = parseCapture(text);
    const link = extractLink(text);
    let type: ItemType = "note";
    if (captureType !== "auto") {
      type = captureType;
    } else {
      type = link ? "note" : p.title.length <= 80 ? "task" : "note";
    }

    try {
      await addItem({
        type,
        title: p.title,
        content: type === "note" ? p.title : undefined,
        dueAt: p.dueAt,
        recurrence: p.recurrence,
        tags: [],
        attachments: [],
        links: link ? [link] : [],
      });
      play("capture");
      vibrate("light");
      toast(p.dueAt ? "Captured with a reminder" : "Captured", "success", 2000);
      onClose();
    } catch {
      setError("Could not save. Please try again.");
      play("error");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center bg-overlay px-4 pt-[12vh] md:pt-[18vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Quick capture"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
            <Sparkles className="h-4 w-4 text-accent" />
            Quick Capture
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-[var(--radius-sm)] p-1.5 text-text-tertiary hover:bg-hover hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Got something on your mind?"
            aria-label="What do you want to capture?"
            className="w-full bg-transparent text-lg text-text-primary placeholder:text-text-tertiary focus:outline-none"
          />

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-text-tertiary">
              {parsed?.dueAt && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 font-medium text-accent">
                  {new Date(parsed.dueAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              )}
              {parsed?.recurrence && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary-soft px-2.5 py-1 font-medium text-secondary-color">
                  Repeats {parsed.recurrence.type}
                </span>
              )}
              {value.trim() && extractLink(value) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 font-medium text-accent">
                  Link
                </span>
              )}
            </div>
            <span className="text-xs text-text-tertiary">
              {TYPE_LABELS[captureType]}
            </span>
          </div>

          {error && (
            <p className="mt-3 text-sm text-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border-subtle px-4 py-3">
          <span className="mr-auto text-xs text-text-tertiary">
            Try &quot;Call Ram tomorrow at 10&quot;
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-md)] px-3.5 py-2 text-sm font-medium text-text-secondary hover:bg-hover"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            className="rounded-[var(--radius-md)] bg-accent px-4 py-2 text-sm font-medium text-text-onAccent transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            Capture
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
