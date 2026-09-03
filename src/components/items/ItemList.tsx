"use client";

import { AnimatePresence } from "framer-motion";
import type { Item } from "@/types";
import { TaskItem } from "@/components/items/TaskItem";
import { NoteItem } from "@/components/items/NoteItem";

export function ItemList({ items }: { items: Item[] }) {
  return (
    <ul className="flex flex-col">
      <AnimatePresence initial={false}>
        {items.map((item, index) =>
          item.type === "note" ? (
            <NoteItem key={item.id} item={item} />
          ) : (
            <TaskItem key={item.id} item={item} index={index} />
          )
        )}
      </AnimatePresence>
    </ul>
  );
}
