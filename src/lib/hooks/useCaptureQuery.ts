"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/stores/appStore";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useToastStore } from "@/lib/stores/toastStore";
import { parseCapture, extractLink } from "@/lib/utils/nlp";

/**
 * Module scope on purpose. A share must not be captured twice if the effect
 * runs again, which it does under StrictMode and on any remount, and a ref
 * would not survive that.
 */
const handledShares = new Set<string>();

export function useCaptureQuery() {
  const searchParams = useSearchParams();
  const addItem = useItemsStore((s) => s.addItem);
  const toast = useToastStore((s) => s.toast);

  useEffect(() => {
    const capture = searchParams.get("capture");
    const type = searchParams.get("type");

    if (capture === "1") {
      if (type === "task" || type === "note") {
        useAppStore.getState().setCaptureType(type);
      } else {
        useAppStore.getState().setCaptureType("auto");
      }
      useAppStore.getState().openQuickCapture();
      return;
    }

    // Share target. The manifest posts nothing because a static export has no
    // server, so the payload arrives as query parameters.
    const sharedTitle = searchParams.get("title");
    const sharedText = searchParams.get("text");
    const sharedUrl = searchParams.get("url");
    if (!sharedTitle && !sharedText && !sharedUrl) return;

    const signature = `${sharedTitle}|${sharedText}|${sharedUrl}`;
    if (handledShares.has(signature)) return;
    handledShares.add(signature);

    const body = [sharedTitle, sharedText].filter(Boolean).join(" ").trim();
    const link = sharedUrl || extractLink(body) || null;
    const raw = body || sharedUrl || "";
    if (!raw) return;

    const parsed = parseCapture(raw);

    void (async () => {
      try {
        await addItem({
          type: link ? "note" : "task",
          title: parsed.title || raw,
          content: link ? raw : undefined,
          dueAt: parsed.dueAt,
          recurrence: parsed.recurrence,
          tags: parsed.tags,
          attachments: [],
          links: link ? [link] : [],
        });
        toast("Saved to your inbox", "success");
      } catch {
        toast("Could not save what you shared", "error");
      } finally {
        // Drop the payload from the address bar so a refresh does not look
        // like a second share.
        if (typeof window !== "undefined") {
          window.history.replaceState({}, "", window.location.pathname);
        }
      }
    })();
  }, [searchParams, addItem, toast]);
}
