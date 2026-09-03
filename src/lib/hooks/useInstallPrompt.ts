"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return Boolean(
        localStorage.getItem("doto-install-dismissed") ||
          window.matchMedia("(display-mode: standalone)").matches ||
          (navigator as { standalone?: boolean }).standalone === true
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (dismissed) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => {
      setCanInstall(false);
      setDeferred(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", () => {});
    };
  }, [dismissed]);

  const promptInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") setCanInstall(false);
    setDeferred(null);
  };

  const dismiss = () => {
    setCanInstall(false);
    setDismissed(true);
    try {
      localStorage.setItem("doto-install-dismissed", "1");
    } catch {
      // storage unavailable
    }
  };

  return {
    canInstall: canInstall && !dismissed,
    promptInstall,
    dismiss,
  };
}