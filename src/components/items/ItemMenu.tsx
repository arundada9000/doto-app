"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MoreVertical, Pencil, Check, RotateCcw, Trash2 } from "lucide-react";
import type { Item } from "@/types";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useAppStore } from "@/lib/stores/appStore";
import { useSound } from "@/lib/hooks/useSound";
import { useHaptics } from "@/lib/hooks/useHaptics";

export function ItemMenu({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { completeItem, uncompleteItem, deleteItem } = useItemsStore();
  const openItem = useAppStore((s) => s.openItem);
  const { play } = useSound();
  const { vibrate } = useHaptics();

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const action = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  const toggleComplete = () => {
    if (item.completed) {
      action(() => {
        uncompleteItem(item.id);
        vibrate("light");
      });
    } else {
      action(() => {
        completeItem(item.id);
        play("complete");
        vibrate("success");
      });
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label="Item actions"
        aria-expanded={open}
        className="rounded p-1 text-text-tertiary transition-all hover:bg-hover hover:text-text-primary [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-8 z-30 w-40 overflow-hidden rounded-[var(--radius-md)] border border-border-subtle bg-surface-raised p-1 shadow-lg"
            onClick={(e) => e.stopPropagation()}
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
                  await deleteItem(item.id);
                  play("confirm");
                })
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
      className={`flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2.5 py-1.5 text-sm transition-colors ${
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
