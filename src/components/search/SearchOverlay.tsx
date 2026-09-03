"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useAppStore } from "@/lib/stores/appStore";
import { useItemsStore } from "@/lib/stores/itemsStore";
import type { Item } from "@/types";
export function SearchOverlay() {
  const open = useAppStore((s) => s.searchOpen);
  const close = useAppStore((s) => s.closeSearch);

  return (
    <AnimatePresence>
      {open && <SearchDialog key="search-dialog" onClose={close} />}
    </AnimatePresence>
  );
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const items = useItemsStore((s) => s.items);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(id);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items
      .filter((item) => {
        const title = item.title.toLowerCase();
        const content = item.content?.toLowerCase() ?? "";
        const tags = item.tags.some((tag) => tag.toLowerCase().includes(q));
        const links = item.links.some((link) => link.toLowerCase().includes(q));
        return title.includes(q) || content.includes(q) || tags || links;
      })
      .slice(0, 30);
  }, [items, query]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-overlay px-4 pt-[10vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.99 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised shadow-lg"
      >
        <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-text-tertiary" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, notes, tags..."
            aria-label="Search"
            className="w-full bg-transparent text-base text-text-primary placeholder:text-text-tertiary focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear"
              className="text-text-tertiary hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <p className="px-3 py-6 text-center text-sm text-text-tertiary">
              Type to search across everything
            </p>
          ) : results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-text-tertiary">
              No results for &quot;{query}&quot;
            </p>
          ) : (
            <ul className="flex flex-col">
              {results.map((item) => (
                <SearchResult key={item.id} item={item} onClose={onClose} />
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SearchResult({ item, onClose }: { item: Item; onClose: () => void }) {
  const openItem = useAppStore((s) => s.openItem);
  return (
    <li>
      <button
        type="button"
        onClick={() => {
          onClose();
          openItem(item.id);
        }}
        className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left hover:bg-hover"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm text-text-primary">
            {item.title}
          </span>
          {item.tags.length > 0 && (
            <span className="mt-0.5 block text-xs text-text-tertiary">
              {item.tags.map((t) => `#${t}`).join(" ")}
            </span>
          )}
        </span>
        {item.completed && (
          <span className="shrink-0 rounded-full bg-secondary-soft px-2 py-0.5 text-xs text-secondary-color">
            Done
          </span>
        )}
      </button>
    </li>
  );
}
