"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MoreVertical, Pencil, Check, RotateCcw, Trash2 } from "lucide-react";
import type { Item } from "@/types";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useAppStore } from "@/lib/stores/appStore";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { useCelebrationStore } from "@/lib/stores/celebrationStore";
import { useSound } from "@/lib/hooks/useSound";
import { useHaptics } from "@/lib/hooks/useHaptics";
import { useDeleteWithUndo } from "@/lib/hooks/useDeleteWithUndo";

export function ItemMenu({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { completeItem, uncompleteItem } = useItemsStore();
  const { remove } = useDeleteWithUndo();
  const openItem = useAppStore((s) => s.openItem);
  const { play } = useSound();
  const { vibrate } = useHaptics();
  const completion = useSettingsStore((s) => s.completion);
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);
  const celebrate = useCelebrationStore((s) => s.celebrate);

  const close = useCallback(() => setOpen(false), []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (open) {
      close();
      return;
    }
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const menuTop = Math.max(8, rect.bottom + 6);
    const menuLeft = Math.max(8, rect.right - 176);
    setPos({ top: menuTop, left: menuLeft });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onScroll = () => close();
    const onResize = () => close();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const action = (fn: () => void) => {
    close();
    fn();
  };

  const toggleComplete = () => {
    if (item.completed) {
      action(() => {
        uncompleteItem(item.id);
        vibrate("light");
      });
    } else {
      // The menu button sits inside the item row, so the row is the anchor the
      // effect should play over once the item leaves the list.
      const row = btnRef.current?.closest("[data-item-id]");
      if (row && !reduceMotion) {
        const rect = row.getBoundingClientRect();
        celebrate(completion, {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
      action(() => {
        completeItem(item.id);
        play("complete", completion);
        vibrate("success");
      });
    }
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label="Item actions"
        aria-expanded={open}
        aria-haspopup="menu"
        className="rounded p-1 text-text-tertiary transition-all hover:bg-hover hover:text-text-primary [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && pos && (
              <>
                <motion.div
                  key="backdrop"
                  className="fixed inset-0 z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    close();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    close();
                  }}
                />
                <motion.div
                  key="menu"
                  role="menu"
                  initial={{ opacity: 0, scale: 0.96, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -6 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{ top: pos.top, left: pos.left }}
                  className="fixed z-50 w-44 overflow-hidden rounded-[var(--radius-md)] border border-border-subtle bg-surface-raised p-1 shadow-xl"
                >
                  <MenuItem
                    icon={<Pencil className="h-4 w-4" />}
                    label="Edit"
                    onClick={() => action(() => openItem(item.id))}
                  />
                  <MenuItem
                    icon={
                      item.completed ? (
                        <RotateCcw className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )
                    }
                    label={item.completed ? "Mark not done" : "Complete"}
                    onClick={toggleComplete}
                  />
                  <MenuItem
                    icon={<Trash2 className="h-4 w-4" />}
                    label="Delete"
                    danger
                    onClick={() =>
                      action(async () => {
                        await remove(item);
                        play("confirm");
                      })
                    }
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2.5 py-2 text-sm transition-colors ${
        danger
          ? "text-error hover:bg-error/10"
          : "text-text-primary hover:bg-hover"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
