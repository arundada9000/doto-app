"use client";

import { useRef, useState } from "react";
import { Link2, X, Image as ImageIcon, Plus } from "lucide-react";
import { nanoid } from "nanoid";
import type { Attachment, Item } from "@/types";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useToastStore } from "@/lib/stores/toastStore";
import { cn } from "@/lib/utils/cn";
import {
  AttachmentThumb,
  AttachmentViewer,
} from "@/components/items/AttachmentPreview";

export function AttachmentsEditor({ item }: { item: Item }) {
  const updateItem = useItemsStore((s) => s.updateItem);
  const toast = useToastStore((s) => s.toast);
  const fileInput = useRef<HTMLInputElement>(null);
  const [linkInput, setLinkInput] = useState("");
  const [viewing, setViewing] = useState<Attachment | null>(null);

  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const incoming = Array.from(files).map((file) => ({
      id: nanoid(),
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      data: file as Blob,
      createdAt: Date.now(),
    }));
    const attachments = [...item.attachments, ...incoming];
    await updateItem(item.id, { attachments });
    toast("Attachment added", "success", 1500);
  };

  const removeFile = async (id: string) => {
    const attachments = item.attachments.filter((a) => a.id !== id);
    await updateItem(item.id, { attachments });
  };

  const addLink = async () => {
    const raw = linkInput.trim();
    if (!raw) return;
    const url = raw.startsWith("http") ? raw : `https://${raw}`;
    if (!item.links.includes(url)) {
      await updateItem(item.id, { links: [...item.links, url] });
    }
    setLinkInput("");
  };

  const removeLink = async (url: string) => {
    await updateItem(item.id, { links: item.links.filter((l) => l !== url) });
  };

  return (
    <div className="flex flex-col gap-3">
      <AttachmentViewer
        attachment={viewing}
        onClose={() => setViewing(null)}
      />
      <div className="flex flex-wrap gap-2">
        {[...item.attachments].reverse().map((att) => (
          <div
            key={att.id}
            className="relative overflow-hidden rounded-[var(--radius-md)] border border-border-subtle"
          >
            <AttachmentThumb attachment={att} onOpen={() => setViewing(att)} />
            <button
              type="button"
              onClick={() => removeFile(att.id)}
              aria-label={`Remove ${att.name}`}
              className="absolute right-0.5 top-0.5 rounded-full bg-black/50 p-0.5 text-white hover:bg-black/70"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border-2 border-dashed border-border-strong text-text-tertiary transition-colors hover:border-accent hover:text-accent"
        >
          <ImageIcon className="h-4 w-4" />
          <span className="text-[10px]">Add</span>
        </button>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/*,application/pdf,text/plain"
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        {item.links.length > 0 && (
          <ul className="flex flex-col gap-1">
            {item.links.map((link) => (
              <li
                key={link}
                className="group flex items-center gap-2 rounded-[var(--radius-md)] bg-hover px-2 py-1.5"
              >
                <Link2 className="h-3.5 w-3.5 shrink-0 text-accent" />
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 truncate text-sm text-accent hover:underline"
                >
                  {link}
                </a>
                <button
                  type="button"
                  onClick={() => removeLink(link)}
                  aria-label="Remove link"
                  className="rounded p-0.5 text-text-tertiary hover:text-error"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 shrink-0 text-text-tertiary" />
          <input
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())}
            placeholder="Add a link (e.g. example.com)"
            aria-label="Add a link"
            className={cn(
              "h-8 w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
            )}
          />
          <button
            type="button"
            onClick={addLink}
            disabled={!linkInput.trim()}
            aria-label="Add link"
            className="rounded p-1 text-text-secondary hover:bg-hover disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
