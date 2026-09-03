"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import type { ChecklistEntry } from "@/types";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { cn } from "@/lib/utils/cn";

export function ChecklistEditor({
  itemId,
  entries,
}: {
  itemId: string;
  entries: ChecklistEntry[];
}) {
  const { toggleChecklistItem, addChecklistEntry, removeChecklistEntry } =
    useItemsStore();
  const [newText, setNewText] = useState("");

  const add = () => {
    const text = newText.trim();
    if (!text) return;
    addChecklistEntry(itemId, text);
    setNewText("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  const sorted = [...entries].sort((a, b) => a.order - b.order);

  return (
    <ul className="flex flex-col gap-1">
      {sorted.map((entry) => (
        <li key={entry.id} className="group flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleChecklistItem(itemId, entry.id)}
            aria-pressed={entry.completed}
            aria-label={entry.completed ? "Uncheck" : "Check"}
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
              entry.completed
                ? "border-secondary-color bg-secondary-color text-text-onAccent"
                : "border-border-strong hover:border-accent"
            )}
          >
            {entry.completed && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
          </button>
          <span
            className={cn(
              "flex-1 break-words text-sm text-text-primary",
              entry.completed && "text-text-tertiary line-through"
            )}
          >
            {entry.text}
          </span>
          <button
            type="button"
            onClick={() => removeChecklistEntry(itemId, entry.id)}
            aria-label="Remove"
            className="rounded p-1 text-text-tertiary opacity-0 transition-opacity hover:bg-hover hover:text-error focus-visible:opacity-100 group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </li>
      ))}
      <li className="flex items-center gap-2">
        <span className="h-6 w-6 shrink-0 rounded-md border-2 border-dashed border-border-strong" />
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Add a checklist item"
          aria-label="Add checklist item"
          className="h-9 w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
        />
        <button
          type="button"
          onClick={add}
          disabled={!newText.trim()}
          aria-label="Add"
          className="rounded p-1 text-text-secondary hover:bg-hover disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </li>
    </ul>
  );
}
