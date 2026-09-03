"use client";

import { motion } from "framer-motion";
import { Paperclip } from "lucide-react";
import type { Item } from "@/types";
import { useAppStore } from "@/lib/stores/appStore";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useSound } from "@/lib/hooks/useSound";
import { useHaptics } from "@/lib/hooks/useHaptics";
import { Swipeable } from "@/components/items/Swipeable";
import { ItemMenu } from "@/components/items/ItemMenu";
import { formatRelative } from "@/lib/utils/dates";

export function NoteItem({ item }: { item: Item }) {
  const openItem = useAppStore((s) => s.openItem);
  const deleteItem = useItemsStore((s) => s.deleteItem);
  const { play } = useSound();
  const { vibrate } = useHaptics();
  const open = () => openItem(item.id);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <Swipeable
        leftLabel="Delete"
        onSwipeLeft={async () => {
          await deleteItem(item.id);
          play("confirm");
          vibrate("light");
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={open}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open())}
          className="group rounded-[var(--radius-md)] px-2 py-2.5 transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
        >
        <p className="whitespace-pre-wrap break-words text-[0.9375rem] leading-relaxed text-text-primary">
          {item.title}
        </p>
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
          <div className="mt-1.5 flex items-center gap-2 text-xs text-text-tertiary">
            <span className="flex-1">{formatRelative(item.createdAt)}</span>
            {item.attachments.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <Paperclip className="h-3.5 w-3.5" />
                {item.attachments.length}
              </span>
            )}
            <ItemMenu item={item} />
          </div>
        </div>
      </Swipeable>
    </motion.li>
  );
}
