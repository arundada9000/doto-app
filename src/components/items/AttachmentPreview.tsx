"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, X, Download } from "lucide-react";
import type { Attachment } from "@/types";

const subscribeNoop = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * Object URLs are created in an effect and revoked when it tears down. Creating
 * them inline during render, as this did, minted a fresh URL on every render
 * and never released one, pinning every image Blob in memory for the life of
 * the page.
 */
function useBlobSrc<T extends HTMLElement & { src: string }>(
  blob: Blob | undefined
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !(blob instanceof Blob)) return;
    const url = URL.createObjectURL(blob);
    el.src = url;
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  return ref;
}

/** Hands the file to the browser to save, releasing the URL straight after. */
export function downloadAttachment(attachment: Attachment) {
  if (!(attachment.data instanceof Blob)) return;
  const url = URL.createObjectURL(attachment.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = attachment.name || "attachment";
  link.click();
  URL.revokeObjectURL(url);
}

export function AttachmentThumb({
  attachment,
  onOpen,
}: {
  attachment: Attachment;
  onOpen: () => void;
}) {
  const isImage = attachment.type.startsWith("image/");
  const imgRef = useBlobSrc<HTMLImageElement>(
    isImage ? attachment.data : undefined
  );

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${attachment.name}`}
      className="block h-16 w-16 overflow-hidden rounded-[var(--radius-md)] transition-transform hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
    >
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          alt={attachment.name}
          className="h-16 w-16 object-cover"
        />
      ) : (
        <span className="flex h-16 w-16 flex-col items-center justify-center gap-1 bg-hover px-1 text-center">
          <FileText className="h-5 w-5 text-text-secondary" />
          <span className="line-clamp-2 text-[10px] leading-tight text-text-tertiary">
            {attachment.name}
          </span>
        </span>
      )}
    </button>
  );
}

export function AttachmentViewer({
  attachment,
  onClose,
}: {
  attachment: Attachment | null;
  onClose: () => void;
}) {
  // This renders only a portal, so it must stay empty until hydration finishes
  // or the client tree will not line up with the server one.
  const mounted = useSyncExternalStore(subscribeNoop, onClient, onServer);

  // Captured so this closes before the global Escape handler reaches the item
  // editor underneath, which would otherwise close both at once.
  useEffect(() => {
    if (!attachment) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [attachment, onClose]);

  const isImage = attachment?.type.startsWith("image/") ?? false;
  const imgRef = useBlobSrc<HTMLImageElement>(
    isImage ? attachment?.data : undefined
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {attachment && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-overlay p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={attachment.name}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised"
          >
            <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
                {attachment.name}
              </span>
              <button
                type="button"
                onClick={() => downloadAttachment(attachment)}
                aria-label={`Download ${attachment.name}`}
                className="rounded-[var(--radius-sm)] p-1.5 text-text-tertiary hover:bg-hover hover:text-text-primary"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-[var(--radius-sm)] p-1.5 text-text-tertiary hover:bg-hover hover:text-text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-surface p-4">
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  ref={imgRef}
                  alt={attachment.name}
                  className="max-h-[70vh] max-w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <FileText className="h-10 w-10 text-text-tertiary" />
                  <p className="text-sm text-text-secondary">
                    This file cannot be shown here. Download it to open it in
                    another app.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
