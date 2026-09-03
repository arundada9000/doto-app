"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Check,
  RotateCcw,
  Trash2,
  Search,
  StickyNote,
} from "lucide-react";
import type { ContextMenuStyle, Item } from "@/types";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useAppStore } from "@/lib/stores/appStore";
import { useDeleteWithUndo } from "@/lib/hooks/useDeleteWithUndo";

interface MenuState {
  x: number;
  y: number;
  item?: Item;
}

export function ContextMenuProvider() {
  const contextMenu = useSettingsStore((s) => s.contextMenu);
  const [menu, setMenu] = useState<MenuState | null>(null);

  const onContextMenu = useCallback(
    (e: MouseEvent) => {
      if (contextMenu === "native") return;
      e.preventDefault();
      const el = e.target as HTMLElement | null;
      const itemEl = el?.closest?.("[data-item-id]") as HTMLElement | null;
      const id = itemEl?.dataset.itemId;
      const item = id ? useItemsStore.getState().items.find((i) => i.id === id) : undefined;
      const pad = 10;
      setMenu({ x: Math.min(e.clientX, window.innerWidth - 220 - pad), y: Math.min(e.clientY, window.innerHeight - 240 - pad), item });
    },
    [contextMenu]
  );

  useEffect(() => {
    document.addEventListener("contextmenu", onContextMenu);
    return () => document.removeEventListener("contextmenu", onContextMenu);
  }, [onContextMenu]);

  const close = useCallback(() => setMenu(null), []);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [menu, close]);

  if (contextMenu === "native") return null;

  return (
    <>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {menu && (
              <>
                <div
                  key="backdrop"
                  className="fixed inset-0 z-[70]"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    close();
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    close();
                  }}
                />
                <ThemedMenu key="menu" state={menu} style={contextMenu} onClose={close} />
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

function ThemedMenu({
  state,
  style,
  onClose,
}: {
  state: MenuState;
  style: ContextMenuStyle;
  onClose: () => void;
}) {
  const openQuickCapture = useAppStore((s) => s.openQuickCapture);
  const openSearch = useAppStore((s) => s.openSearch);
  const openItem = useAppStore((s) => s.openItem);
  const { setCaptureType } = useAppStore();
  const { completeItem, uncompleteItem } = useItemsStore();
  const { remove } = useDeleteWithUndo();

  const run = (fn: () => void) => {
    onClose();
    fn();
  };

  const toggleComplete = () => {
    if (!state.item) return;
    run(() => {
      if (state.item!.completed) uncompleteItem(state.item!.id);
      else completeItem(state.item!.id);
    });
  };

  const glass = style === "glass";
  const rounded = style === "rounded";

  const surface =
    glass
      ? "border border-white/20 bg-surface-raised/80 backdrop-blur-xl"
      : "border border-border-subtle bg-surface-raised";

  const radius = rounded ? "rounded-2xl px-3 py-2 shadow-2xl" : "rounded-[var(--radius-md)] px-2 py-1.5 shadow-xl";

  const itemRadius = rounded ? "rounded-xl" : "rounded-[var(--radius-sm)]";

  return (
    <motion.div
      role="menu"
      initial={{ opacity: 0, scale: style === "glass" ? 0.95 : 0.98, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -4 }}
      transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
      style={{ left: state.x, top: state.y }}
      className={`fixed z-[80] w-56 ${surface} ${radius}`}
    >
      {state.item ? (
        <>
          <div className={`flex items-center gap-2 px-2 pb-2 ${rounded ? "pb-2.5" : ""}`}>
            <p className="min-w-0 truncate text-sm font-medium text-text-primary">
              {state.item.title}
            </p>
          </div>
          <div className={glass ? "h-px bg-white/15" : "h-px bg-border-subtle"} />
          <MenuItem radius={itemRadius} icon={<Pencil className="h-4 w-4" />} label="Edit" onClick={() => run(() => openItem(state.item!.id))} />
          <MenuItem radius={itemRadius} icon={state.item.completed ? <RotateCcw className="h-4 w-4" /> : <Check className="h-4 w-4" />} label={state.item.completed ? "Mark not done" : "Complete"} onClick={toggleComplete} />
          <MenuItem radius={itemRadius} icon={<Trash2 className="h-4 w-4" />} label="Delete" danger onClick={() => run(() => remove(state.item!))} />
        </>
      ) : (
        <>
          <MenuItem radius={itemRadius} icon={<Plus className="h-4 w-4" />} label="New task" onClick={() => run(() => { setCaptureType("task"); openQuickCapture(); })} />
          <MenuItem radius={itemRadius} icon={<StickyNote className="h-4 w-4" />} label="New note" onClick={() => run(() => { setCaptureType("note"); openQuickCapture(); })} />
          <MenuItem radius={itemRadius} icon={<Search className="h-4 w-4" />} label="Search" onClick={() => run(() => openSearch())} />
        </>
      )}
    </motion.div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
  radius,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  radius: string;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 ${radius} px-2.5 py-2 text-sm transition-colors ${
        danger
          ? "text-error hover:bg-error/10"
          : "text-text-primary hover:bg-hover"
      }`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}