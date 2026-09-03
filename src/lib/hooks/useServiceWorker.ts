"use client";

import { useEffect } from "react";

export function useServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (typeof window === "undefined") return;

    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {});
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
}
