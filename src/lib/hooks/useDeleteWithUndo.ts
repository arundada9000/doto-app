import { useCallback } from "react";
import type { Item } from "@/types";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useToastStore } from "@/lib/stores/toastStore";

export function useDeleteWithUndo() {
  const deleteItem = useItemsStore((s) => s.deleteItem);
  const restoreItem = useItemsStore((s) => s.restoreItem);
  const toast = useToastStore((s) => s.toast);

  const remove = useCallback(
    async (item: Item) => {
      await deleteItem(item.id);
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
    [deleteItem, restoreItem, toast]
  );

  return { remove };
}