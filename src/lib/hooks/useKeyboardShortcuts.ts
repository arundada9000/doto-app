"use client";

import { useCallback } from "react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/lib/stores/appStore";

export function useKeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = useCallback(
    (path: string) => {
      if (pathname !== path) router.push(path);
    },
    [router, pathname]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        useAppStore.getState().openQuickCapture();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        useAppStore.getState().openSearch();
        return;
      }

      if (e.key === "Escape" && !e.isComposing) {
        if (useAppStore.getState().closeTopLayer()) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }

      if (isTyping) return;

      if (e.key === "n") {
        e.preventDefault();
        useAppStore.getState().openQuickCapture();
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        useAppStore.getState().openSearch();
        return;
      }

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        useAppStore.getState().openShortcuts();
        return;
      }

      switch (e.key.toLowerCase()) {
        case "t":
          navigate("/today");
          break;
        case "i":
          navigate("/inbox");
          break;
        case "c":
          navigate("/completed");
          break;
        case "s":
          navigate("/settings");
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, router]);
}
