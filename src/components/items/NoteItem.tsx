"use client";

import { motion } from "framer-motion";
import { Paperclip } from "lucide-react";
import type { Item } from "@/types";
import { formatRelative } from "@/lib/utils/dates";

export function NoteItem({ item }: { item: Item }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="group rounded-[var(--radius-md)] px-2 py-2.5 transition-colors hover:bg-hover">
        <p className="whitespace-pre-wrap break-words text-[0.9375rem] leading-relaxed text-text-primary">
          {item.title}
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-text-tertiary">
          <span>{formatRelative(item.createdAt)}</span>
          {item.attachments.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="h-3.5 w-3.5" />
              {item.attachments.length}
            </span>
          )}
        </div>
      </div>
    </motion.li>
  );
}
