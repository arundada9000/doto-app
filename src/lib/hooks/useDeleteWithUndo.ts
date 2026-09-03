import { useCallback } from "react";
import type { Item } from "@/types";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useToastStore } from "@/lib/stores/toastStore";
import { useUndoStore } from "@/lib/stores/undoStore";

export function useDeleteWithUndo() {
  const deleteItem = useItemsStore((s) => s.deleteItem);
  const restoreItem = useItemsStore((s) => s.restoreItem);
  const toast = useToastStore((s) => s.toast);
  const pushUndo = useUndoStore((s) => s.push);

  const remove = useCallback(
    async (item: Item) => {
      await deleteItem(item.id);
      // The toast is the immediate affordance; the stack is what Ctrl+Z walks.
      pushUndo("Delete undone", () => restoreItem(item));
      toast(
        "Item deleted",
        "default",
        5000,
        {
          label: "Undo",
          onClick: () => restoreItem(item),
        }
      );
    },
    [deleteItem, restoreItem, toast, pushUndo]
  );

  return { remove };
}