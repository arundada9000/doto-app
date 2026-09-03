"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Paperclip, Clock, Link2 } from "lucide-react";
import type { Item } from "@/types";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useAppStore } from "@/lib/stores/appStore";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { useSound } from "@/lib/hooks/useSound";
import { useHaptics } from "@/lib/hooks/useHaptics";
import { useDeleteWithUndo } from "@/lib/hooks/useDeleteWithUndo";
import { formatRelative } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";
import { Swipeable } from "@/components/items/Swipeable";
import { ItemMenu } from "@/components/items/ItemMenu";
import { CompletionCelebration } from "@/components/items/CompletionCelebration";

export function TaskItem({ item, index }: { item: Item; index: number }) {
  const { completeItem, uncompleteItem } = useItemsStore();
  const { remove } = useDeleteWithUndo();
  const openItem = useAppStore((s) => s.openItem);
  const { play } = useSound();
  const { vibrate } = useHaptics();
  const completion = useSettingsStore((s) => s.completion);
  const [celebrating, setCelebrating] = useState(false);

  const toggle = () => {
    if (item.completed) {
      uncompleteItem(item.id);
      return;
    }
    setCelebrating(true);
    completeItem(item.id);
    play("complete", completion);
    vibrate("success");
    setTimeout(() => setCelebrating(false), 950);
  };

  const open = () => openItem(item.id);

  const checklistCount = item.checklist?.length ?? 0;
  const checklistDone = item.checklist?.filter((c) => c.completed).length ?? 0;
  const isOverdue =
    item.dueAt && item.dueAt < new Date().getTime() && !item.completed;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: checklistCount > 0 ? -60 : 0, height: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group"
      data-item-id={item.id}
      style={{ zIndex: index }}
    >
      <Swipeable
        onSwipeRight={toggle}
        onSwipeLeft={async () => {
          await remove(item);
          play("confirm");
          vibrate("light");
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={open}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open())}
          className="relative flex items-start gap-3 rounded-[var(--radius-md)] px-2 py-2.5 transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]">
        {celebrating && <CompletionCelebration />}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          aria-label={item.completed ? "Mark as not done" : "Mark as done"}
          aria-pressed={item.completed}
          className="relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-border-strong transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
        >
          <AnimatePresence>
            {item.completed && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary-color"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.05, type: "spring", stiffness: 500, damping: 20 }}
                >
                  <Check className="h-3.5 w-3.5 text-text-onAccent" strokeWidth={3} />
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "break-words text-[0.9375rem] leading-snug text-text-primary transition-colors",
              item.completed && "text-text-tertiary line-through"
            )}
          >
            {item.title}
          </p>

          {(checklistCount > 0 || item.attachments.length > 0 || item.links.length > 0) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
              {checklistCount > 0 && (
                <span>
                  {checklistDone}/{checklistCount}
                </span>
              )}
              {item.attachments.length > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Paperclip className="h-3.5 w-3.5" />
                  {item.attachments.length}
                </span>
              )}
              {item.links.length > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Link2 className="h-3.5 w-3.5" />
                  {item.links.length}
                </span>
              )}
            </div>
          )}

          {item.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium text-accent"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {item.dueAt && (
          <span
            className={cn(
              "mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              isOverdue
                ? "bg-error/10 text-error"
                : item.completed
                  ? "bg-hover text-text-tertiary"
                  : "bg-accent-soft text-accent"
            )}
          >
            <Clock className="h-3 w-3" />
            {formatRelative(item.dueAt)}
          </span>
        )}

        <ItemMenu item={item} />
      </div>
      </Swipeable>
    </motion.li>
  );
}
