"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  X,
  Sparkles,
  Mic,
  Square,
  Hash,
  ListChecks,
  Rows3,
  CornerDownLeft,
  Paperclip,
  Terminal,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useAppStore } from "@/lib/stores/appStore";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useToastStore } from "@/lib/stores/toastStore";
import { parseCapture, extractLink } from "@/lib/utils/nlp";
import { useSound } from "@/lib/hooks/useSound";
import { useHaptics } from "@/lib/hooks/useHaptics";
import { useKnownTags, activeTagAt } from "@/lib/hooks/useKnownTags";
import { useVoiceCapture } from "@/lib/hooks/useVoiceCapture";
import { cn } from "@/lib/utils/cn";
import type { Attachment, ChecklistEntry, ItemType } from "@/types";

const TYPE_LABELS: Record<string, string> = {
  auto: "Smart",
  task: "Task",
  note: "Note",
};

const MAX_TAG_SUGGESTIONS = 5;

export function QuickCapture() {
  const open = useAppStore((s) => s.quickCaptureOpen);
  const close = useAppStore((s) => s.closeQuickCapture);

  return (
    <AnimatePresence>
      {open && <CaptureDialog key="capture-dialog" onClose={close} />}
    </AnimatePresence>
  );
}

interface Command {
  id: string;
  label: string;
  run: () => void;
}

function CaptureDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const captureType = useAppStore((s) => s.captureType);
  const openHelp = useAppStore((s) => s.openHelp);
  const openShortcuts = useAppStore((s) => s.openShortcuts);
  const addItem = useItemsStore((s) => s.addItem);
  const toast = useToastStore((s) => s.toast);
  const { play } = useSound();
  const { vibrate } = useHaptics();
  const knownTags = useKnownTags();

  const [value, setValue] = useState("");
  const [caret, setCaret] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(0);
  const [pendingLines, setPendingLines] = useState<string[] | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const voice = useVoiceCapture((text) => {
    setValue(text);
    setCaret(text.length);
  });

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(id);
  }, []);

  const commandMode = value.startsWith(">");
  const commandQuery = commandMode ? value.slice(1).trim().toLowerCase() : "";

  const commands = useMemo<Command[]>(
    () => [
      { id: "inbox", label: "Go to Inbox", run: () => router.push("/inbox") },
      { id: "today", label: "Go to Today", run: () => router.push("/today") },
      {
        id: "completed",
        label: "Go to Completed",
        run: () => router.push("/completed"),
      },
      {
        id: "settings",
        label: "Open Settings",
        run: () => router.push("/settings"),
      },
      { id: "manual", label: "Open the user manual", run: openHelp },
      { id: "shortcuts", label: "Show keyboard shortcuts", run: openShortcuts },
    ],
    [router, openHelp, openShortcuts]
  );

  const matchingCommands = useMemo(
    () =>
      commandMode
        ? commands.filter((c) => c.label.toLowerCase().includes(commandQuery))
        : [],
    [commandMode, commands, commandQuery]
  );

  const parsed = !commandMode && value.trim() ? parseCapture(value) : null;

  const activeTag = commandMode ? null : activeTagAt(value, caret);
  const tagSuggestions = useMemo(() => {
    if (!activeTag) return [];
    const used = new Set(parsed?.tags ?? []);
    return knownTags
      .filter((t) => t.startsWith(activeTag.query) && !used.has(t))
      .slice(0, MAX_TAG_SUGGESTIONS);
  }, [activeTag, knownTags, parsed]);

  // Keep the highlighted row in range as the list beneath it changes.
  const listLength = commandMode
    ? matchingCommands.length
    : tagSuggestions.length;
  const safeHighlight = listLength > 0 ? Math.min(highlight, listLength - 1) : 0;

  const updateValue = (next: string, nextCaret?: number) => {
    setValue(next);
    setCaret(nextCaret ?? next.length);
    setHighlight(0);
  };

  const applyTag = (tag: string) => {
    if (!activeTag) return;
    const before = value.slice(0, activeTag.start);
    const after = value.slice(caret);
    const next = `${before}${tag} ${after}`;
    const nextCaret = before.length + tag.length + 1;
    updateValue(next, nextCaret);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(nextCaret, nextCaret);
    });
  };

  const runCommand = (command: Command) => {
    command.run();
    onClose();
  };

  const buildAttachment = (file: File): Attachment => ({
    id: nanoid(),
    name: file.name || "Pasted image",
    type: file.type,
    size: file.size,
    data: file,
    createdAt: Date.now(),
  });

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const files = [...(e.clipboardData?.files ?? [])].filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length > 0) {
      e.preventDefault();
      setAttachments((prev) => [...prev, ...files.map(buildAttachment)]);
      vibrate("light");
      return;
    }

    const text = e.clipboardData?.getData("text") ?? "";
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length > 1) {
      e.preventDefault();
      setPendingLines(lines);
    }
  };

  const captureLinesAsItems = async () => {
    if (!pendingLines) return;
    try {
      for (const line of pendingLines) {
        const p = parseCapture(line);
        const link = extractLink(line);
        await addItem({
          type: link ? "note" : "task",
          title: p.title,
          dueAt: p.dueAt,
          recurrence: p.recurrence,
          tags: p.tags,
          attachments: [],
          links: link ? [link] : [],
        });
      }
      play("capture");
      vibrate("success");
      toast(`Captured ${pendingLines.length} items`, "success", 2500);
      setPendingLines(null);
      onClose();
    } catch {
      setError("Could not save. Please try again.");
      play("error");
    }
  };

  const captureLinesAsChecklist = async () => {
    if (!pendingLines) return;
    const [first, ...rest] = pendingLines;
    const source = rest.length > 0 ? rest : pendingLines;
    const entries: ChecklistEntry[] = source.map((text, index) => ({
      id: nanoid(),
      text,
      completed: false,
      order: index,
    }));
    try {
      await addItem({
        type: "checklist",
        title: rest.length > 0 ? first : "Checklist",
        checklist: entries,
        tags: [],
        attachments: [],
        links: [],
      });
      play("capture");
      vibrate("success");
      toast("Captured as a checklist", "success", 2500);
      setPendingLines(null);
      onClose();
    } catch {
      setError("Could not save. Please try again.");
      play("error");
    }
  };

  const captureLinesAsOne = () => {
    if (!pendingLines) return;
    updateValue(pendingLines.join(" "));
    setPendingLines(null);
    inputRef.current?.focus();
  };

  const submit = async () => {
    if (commandMode) {
      const command = matchingCommands[safeHighlight];
      if (command) runCommand(command);
      return;
    }

    const text = value.trim();
    if (!text && attachments.length === 0) return;

    const p = parseCapture(text || "Attachment");
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
        tags: p.tags,
        attachments,
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
    const listOpen = listLength > 0;

    if (listOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const delta = e.key === "ArrowDown" ? 1 : -1;
      setHighlight((h) => (h + delta + listLength) % listLength);
      return;
    }

    if (!commandMode && tagSuggestions.length > 0 && e.key === "Tab") {
      e.preventDefault();
      applyTag(tagSuggestions[safeHighlight]);
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!commandMode && tagSuggestions.length > 0) {
        applyTag(tagSuggestions[safeHighlight]);
        return;
      }
      void submit();
    }
  };

  const syncCaret = (e: React.SyntheticEvent<HTMLInputElement>) =>
    setCaret(e.currentTarget.selectionStart ?? e.currentTarget.value.length);

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
            {commandMode ? (
              <Terminal className="h-4 w-4 text-accent" />
            ) : (
              <Sparkles className="h-4 w-4 text-accent" />
            )}
            {commandMode ? "Commands" : "Quick Capture"}
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
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={value}
              onChange={(e) =>
                updateValue(e.target.value, e.target.selectionStart ?? undefined)
              }
              onKeyDown={onKeyDown}
              onKeyUp={syncCaret}
              onClick={syncCaret}
              onPaste={onPaste}
              placeholder={
                voice.listening ? "Listening..." : "Got something on your mind?"
              }
              aria-label="What do you want to capture?"
              className="w-full bg-transparent text-lg text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
            {voice.supported && !commandMode && (
              <button
                type="button"
                onClick={() => (voice.listening ? voice.stop() : voice.start())}
                aria-label={
                  voice.listening ? "Stop listening" : "Capture by voice"
                }
                aria-pressed={voice.listening}
                className={cn(
                  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                  voice.listening
                    ? "border-transparent bg-accent text-text-onAccent"
                    : "border-border-subtle text-text-tertiary hover:border-border-strong hover:text-text-primary"
                )}
              >
                {voice.listening && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-accent"
                    animate={{ opacity: [0.5, 0], scale: [1, 1.6] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
                <span className="relative">
                  {voice.listening ? (
                    <Square className="h-3.5 w-3.5" fill="currentColor" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </span>
              </button>
            )}
          </div>

          <AnimatePresence initial={false}>
            {commandMode && matchingCommands.length > 0 && (
              <SuggestionList key="commands">
                {matchingCommands.map((c, i) => (
                  <SuggestionRow
                    key={c.id}
                    icon={<CornerDownLeft className="h-3.5 w-3.5" />}
                    label={c.label}
                    active={i === safeHighlight}
                    onClick={() => runCommand(c)}
                  />
                ))}
              </SuggestionList>
            )}

            {!commandMode && tagSuggestions.length > 0 && (
              <SuggestionList key="tags">
                {tagSuggestions.map((tag, i) => (
                  <SuggestionRow
                    key={tag}
                    icon={<Hash className="h-3.5 w-3.5" />}
                    label={tag}
                    active={i === safeHighlight}
                    onClick={() => applyTag(tag)}
                  />
                ))}
              </SuggestionList>
            )}

            {pendingLines && (
              <motion.div
                key="paste"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3 rounded-[var(--radius-md)] border border-border-subtle bg-surface p-3"
              >
                <p className="text-sm text-text-secondary">
                  That paste has {pendingLines.length} lines. How should it land?
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <PasteChoice
                    icon={<Rows3 className="h-4 w-4" />}
                    label={`${pendingLines.length} separate items`}
                    onClick={() => void captureLinesAsItems()}
                  />
                  <PasteChoice
                    icon={<ListChecks className="h-4 w-4" />}
                    label="One checklist"
                    onClick={() => void captureLinesAsChecklist()}
                  />
                  <PasteChoice
                    icon={<CornerDownLeft className="h-4 w-4" />}
                    label="Keep as one line"
                    onClick={captureLinesAsOne}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {attachments.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {attachments.map((a) => (
                <span
                  key={a.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
                >
                  <Paperclip className="h-3 w-3" />
                  {a.name}
                  <button
                    type="button"
                    aria-label={`Remove ${a.name}`}
                    onClick={() =>
                      setAttachments((prev) => prev.filter((x) => x.id !== a.id))
                    }
                    className="rounded-full p-0.5 hover:bg-accent/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
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
              {parsed?.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 rounded-full bg-accent-soft px-2.5 py-1 font-medium text-accent"
                >
                  <Hash className="h-3 w-3" />
                  {tag}
                </span>
              ))}
              {!commandMode && value.trim() && extractLink(value) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 font-medium text-accent">
                  Link
                </span>
              )}
            </div>
            {!commandMode && (
              <span className="shrink-0 text-xs text-text-tertiary">
                {TYPE_LABELS[captureType]}
              </span>
            )}
          </div>

          {(error || voice.error) && (
            <p className="mt-3 text-sm text-error" role="alert">
              {error ?? voice.error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border-subtle px-4 py-3">
          <span className="mr-auto hidden text-xs text-text-tertiary sm:block">
            {commandMode
              ? "Enter runs the highlighted command"
              : "Type > for commands"}
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
            onClick={() => void submit()}
            disabled={!value.trim() && attachments.length === 0}
            className="rounded-[var(--radius-md)] bg-accent px-4 py-2 text-sm font-medium text-text-onAccent transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {commandMode ? "Run" : "Capture"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SuggestionList({ children }: { children: React.ReactNode }) {
  return (
    <motion.ul
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="mt-3 overflow-hidden rounded-[var(--radius-md)] border border-border-subtle bg-surface"
    >
      {children}
    </motion.ul>
  );
}

function SuggestionRow({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
          active
            ? "bg-accent-soft text-accent"
            : "text-text-secondary hover:bg-hover"
        )}
      >
        <span className={active ? "text-accent" : "text-text-tertiary"}>
          {icon}
        </span>
        {label}
      </button>
    </li>
  );
}

function PasteChoice({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border-subtle px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-hover"
    >
      {icon}
      {label}
    </button>
  );
}
