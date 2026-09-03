"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, Plus } from "lucide-react";
import { useAppStore } from "@/lib/stores/appStore";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useToastStore } from "@/lib/stores/toastStore";
import { useSound } from "@/lib/hooks/useSound";
import { useHaptics } from "@/lib/hooks/useHaptics";
import { ChecklistEditor } from "@/components/items/ChecklistEditor";
import { ScheduleFields } from "@/components/items/ScheduleFields";
import type { RecurrenceRule } from "@/types";
import { cn } from "@/lib/utils/cn";

export function ItemEditor() {
  const editingItemId = useAppStore((s) => s.editingItemId);
  const closeItem = useAppStore((s) => s.closeItem);
  const item = useItemsStore((s) =>
    s.items.find((i) => i.id === editingItemId)
  );

  return (
    <AnimatePresence>
      {item && (
        <EditorDialog key={item.id} item={item} onClose={closeItem} />
      )}
    </AnimatePresence>
  );
}

function EditorDialog({
  item,
  onClose,
}: {
  item: NonNullable<ReturnType<typeof useItemsStore.getState>["items"][number]>;
  onClose: () => void;
}) {
  const updateItem = useItemsStore((s) => s.updateItem);
  const deleteItem = useItemsStore((s) => s.deleteItem);
  const toast = useToastStore((s) => s.toast);
  const { play } = useSound();
  const { vibrate } = useHaptics();

  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content ?? "");
  const [type, setType] = useState(item.type);
  const [dueAt, setDueAt] = useState<number | undefined>(item.dueAt);
  const [reminder, setReminder] = useState<number | undefined>(item.reminder);
  const [recurrence, setRecurrence] = useState<RecurrenceRule | undefined>(
    item.recurrence
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(item.tags);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (!tag) return;
    if (!tags.includes(tag)) setTags([...tags, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const save = async () => {
    await updateItem(item.id, {
      title: title.trim() || item.title,
      content: type === "note" ? content : undefined,
      type,
      dueAt,
      reminder,
      recurrence,
      tags,
    });
    play("confirm");
    vibrate("light");
    toast("Saved", "success", 1500);
    onClose();
  };

  const remove = async () => {
    await deleteItem(item.id);
    play("confirm");
    toast("Deleted", "default", 1500);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-overlay md:items-center md:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Edit item"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[var(--radius-xl)] bg-surface-raised shadow-lg md:rounded-[var(--radius-lg)]"
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <div className="flex gap-1">
            {(["task", "note"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                aria-pressed={type === t}
                className={cn(
                  "rounded-[var(--radius-md)] px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                  type === t
                    ? "bg-accent-soft text-accent"
                    : "text-text-secondary hover:bg-hover"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1.5 text-text-tertiary hover:bg-hover hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            aria-label="Title"
            className="w-full bg-transparent text-lg font-medium text-text-primary placeholder:text-text-tertiary focus:outline-none"
          />

          {type === "note" && (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a note..."
              aria-label="Note content"
              rows={5}
              className="mt-2 w-full resize-none bg-transparent text-[0.9375rem] leading-relaxed text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
          )}

          {type === "task" && item.checklist && item.checklist.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Checklist
              </h3>
              <ChecklistEditor itemId={item.id} entries={item.checklist} />
            </div>
          )}

          <div className="mt-5 border-t border-border-subtle pt-4">
            <ScheduleFields
              dueAt={dueAt}
              reminder={reminder}
              recurrence={recurrence}
              onChange={(patch) => {
                if (patch.dueAt !== undefined) setDueAt(patch.dueAt);
                if (patch.reminder !== undefined) setReminder(patch.reminder);
                if (patch.recurrence !== undefined)
                  setRecurrence(patch.recurrence);
              }}
            />
          </div>

          <div className="mt-5 border-t border-border-subtle pt-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Tags
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove ${tag}`}
                    className="rounded-full hover:text-error"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add tag"
                aria-label="Add tag"
                className="h-8 w-24 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
              />
              {tagInput && (
                <button
                  type="button"
                  onClick={addTag}
                  className="rounded p-1 text-text-secondary hover:bg-hover"
                  aria-label="Add tag"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border-subtle px-4 py-3">
          <button
            type="button"
            onClick={remove}
            aria-label="Delete item"
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-error hover:bg-error/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium text-text-secondary hover:bg-hover"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!title.trim()}
              className="rounded-[var(--radius-md)] bg-accent px-4 py-2 text-sm font-medium text-text-onAccent transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
