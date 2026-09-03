"use client";

import { useState } from "react";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import type { Item } from "@/types";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useHaptics } from "@/lib/hooks/useHaptics";
import { TaskItem, TaskRow } from "@/components/items/TaskItem";
import { NoteItem, NoteRow } from "@/components/items/NoteItem";

export function ItemList({
  items,
  reorderable = false,
}: {
  items: Item[];
  reorderable?: boolean;
}) {
  if (reorderable) return <ReorderableList items={items} />;

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

function ReorderableList({ items }: { items: Item[] }) {
  const reorderItems = useItemsStore((s) => s.reorderItems);
  // Order is held locally while a drag is in flight so the list follows the
  // pointer without a database write per frame. It commits on drop.
  const [draft, setDraft] = useState<Item[] | null>(null);
  const list = draft ?? items;

  const commit = () => {
    if (!draft) return;
    void reorderItems(draft.map((i) => i.id));
    setDraft(null);
  };

  return (
    <Reorder.Group
      as="ul"
      axis="y"
      values={list}
      onReorder={setDraft}
      className="flex flex-col"
    >
      {list.map((item) => (
        <ReorderableRow key={item.id} item={item} onCommit={commit} />
      ))}
    </Reorder.Group>
  );
}

function ReorderableRow({
  item,
  onCommit,
}: {
  item: Item;
  onCommit: () => void;
}) {
  const controls = useDragControls();
  const { vibrate } = useHaptics();

  const handle = (
    <button
      type="button"
      aria-label={`Reorder ${item.title}`}
      // Dragging starts from the handle only, so it cannot fight the swipe
      // gesture or swallow a tap meant to open the item.
      onPointerDown={(e) => {
        e.stopPropagation();
        vibrate("light");
        controls.start(e);
      }}
      onClick={(e) => e.stopPropagation()}
      className="mt-1 shrink-0 cursor-grab touch-none text-text-tertiary opacity-0 transition-opacity focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] active:cursor-grabbing group-hover:opacity-100 md:opacity-0"
    >
      <GripVertical className="h-4 w-4" />
    </button>
  );

  return (
    <Reorder.Item
      as="li"
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onCommit}
      data-item-id={item.id}
      className="group"
      whileDrag={{ scale: 1.01, zIndex: 20 }}
    >
      {item.type === "note" ? (
        <NoteRow item={item} handle={handle} />
      ) : (
        <TaskRow item={item} handle={handle} />
      )}
    </Reorder.Item>
  );
}
