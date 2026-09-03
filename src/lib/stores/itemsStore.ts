import { create } from "zustand";
import { nanoid } from "nanoid";
import { itemsTable } from "@/lib/db";
import type { Item, NewItem, ChecklistEntry } from "@/types";

interface ItemsState {
  items: Item[];
  loading: boolean;
  hydrate: () => Promise<void>;
  addItem: (newItem: NewItem) => Promise<Item>;
  updateItem: (id: string, updates: Partial<Omit<Item, "id" | "createdAt">>) => Promise<void>;
  completeItem: (id: string) => Promise<void>;
  uncompleteItem: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  restoreItem: (item: Item) => Promise<void>;
  reorderItems: (ids: string[]) => Promise<void>;
  toggleChecklistItem: (itemId: string, checklistId: string) => Promise<void>;
  addChecklistEntry: (itemId: string, text: string) => Promise<void>;
  removeChecklistEntry: (itemId: string, checklistId: string) => Promise<void>;
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: [],
  loading: true,

  hydrate: async () => {
    try {
      const all = await itemsTable.orderBy("order").toArray();
      set({ items: all, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addItem: async (newItem) => {
    const now = Date.now();
    const items = get().items;
    const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.order)) : 0;

    const item: Item = {
      id: newItem.id ?? nanoid(),
      type: newItem.type,
      title: newItem.title,
      content: newItem.content,
      checklist: newItem.checklist ?? [],
      completed: newItem.completed ?? false,
      createdAt: newItem.createdAt ?? now,
      updatedAt: newItem.updatedAt ?? now,
      dueAt: newItem.dueAt,
      completedAt: newItem.completedAt,
      reminder: newItem.reminder,
      recurrence: newItem.recurrence,
      tags: newItem.tags ?? [],
      attachments: newItem.attachments ?? [],
      links: newItem.links ?? [],
      order: newItem.order ?? maxOrder + 1,
      isReminderSent: false,
    };

    await itemsTable.put(item);
    set({ items: [...get().items, item] });
    return item;
  },

  updateItem: async (id, updates) => {
    const now = Date.now();
    const patched = { ...updates, updatedAt: now };
    await itemsTable.update(id, patched);
    set({
      items: get().items.map((i) =>
        i.id === id ? { ...i, ...patched } : i
      ),
    });
  },

  completeItem: async (id) => {
    const now = Date.now();
    await itemsTable.update(id, { completed: true, completedAt: now, updatedAt: now });
    set({
      items: get().items.map((i) =>
        i.id === id ? { ...i, completed: true, completedAt: now, updatedAt: now } : i
      ),
    });
  },

  uncompleteItem: async (id) => {
    const now = Date.now();
    await itemsTable.update(id, { completed: false, completedAt: undefined, updatedAt: now });
    set({
      items: get().items.map((i) =>
        i.id === id ? { ...i, completed: false, completedAt: undefined, updatedAt: now } : i
      ),
    });
  },

  deleteItem: async (id) => {
    await itemsTable.delete(id);
    set({ items: get().items.filter((i) => i.id !== id) });
  },

  restoreItem: async (item) => {
    const restored = { ...item, updatedAt: Date.now() };
    await itemsTable.put(restored);
    set({ items: [...get().items, restored] });
  },

  reorderItems: async (ids) => {
    const now = Date.now();
    const updates: Promise<unknown>[] = [];
    const items = get().items;

    ids.forEach((id, index) => {
      const item = items.find((i) => i.id === id);
      if (item && item.order !== index) {
        updates.push(itemsTable.update(id, { order: index, updatedAt: now }));
      }
    });

    await Promise.all(updates);

    set({
      items: items.map((i) => {
        const idx = ids.indexOf(i.id);
        return idx !== -1 ? { ...i, order: idx, updatedAt: now } : i;
      }),
    });
  },

  toggleChecklistItem: async (itemId, checklistId) => {
    const item = get().items.find((i) => i.id === itemId);
    if (!item?.checklist) return;

    const now = Date.now();
    const updatedChecklist = item.checklist.map((entry) =>
      entry.id === checklistId ? { ...entry, completed: !entry.completed } : entry
    );

    await itemsTable.update(itemId, { checklist: updatedChecklist, updatedAt: now });
    set({
      items: get().items.map((i) =>
        i.id === itemId ? { ...i, checklist: updatedChecklist, updatedAt: now } : i
      ),
    });
  },

  addChecklistEntry: async (itemId, text) => {
    const item = get().items.find((i) => i.id === itemId);
    if (!item) return;

    const now = Date.now();
    const existing = item.checklist ?? [];
    const maxOrder = existing.length > 0 ? Math.max(...existing.map((e) => e.order)) : 0;

    const entry: ChecklistEntry = {
      id: nanoid(),
      text,
      completed: false,
      order: maxOrder + 1,
    };

    const updatedChecklist = [...existing, entry];
    await itemsTable.update(itemId, { checklist: updatedChecklist, updatedAt: now });
    set({
      items: get().items.map((i) =>
        i.id === itemId ? { ...i, checklist: updatedChecklist, updatedAt: now } : i
      ),
    });
  },

  removeChecklistEntry: async (itemId, checklistId) => {
    const item = get().items.find((i) => i.id === itemId);
    if (!item?.checklist) return;

    const now = Date.now();
    const updatedChecklist = item.checklist.filter((e) => e.id !== checklistId);
    await itemsTable.update(itemId, { checklist: updatedChecklist, updatedAt: now });
    set({
      items: get().items.map((i) =>
        i.id === itemId ? { ...i, checklist: updatedChecklist, updatedAt: now } : i
      ),
    });
  },
}));
