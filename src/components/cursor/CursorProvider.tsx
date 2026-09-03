"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useSpring } from "framer-motion";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import type { CursorStyle } from "@/types";

const ACTIVE = new Set<CursorStyle>(["pointer", "ring", "dot", "diamond", "crosshair"]);

function subscribeToMediaQuery(query: string, callback: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => subscribeToMediaQuery(query, cb),
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function CursorProvider() {
  const cursor = useSettingsStore((s) => s.cursor);
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);
  const [visible, setVisible] = useState(false);
  const x = useSpring(0, { stiffness: 220, damping: 28, mass: 0.5 });
  const y = useSpring(0, { stiffness: 220, damping: 28, mass: 0.5 });
  const ringRef = useRef<HTMLDivElement>(null);

  const active = ACTIVE.has(cursor);
  const pointerFine = useMediaQuery("(pointer: fine)");
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = active && pointerFine && !prefersReduced && !reduceMotion;

  useEffect(() => {
    if (!enabled) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 11);
      y.set(e.clientY - 7);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);
    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    document.documentElement.style.cursor = "none";
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
      document.documentElement.style.cursor = "";
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      ref={ringRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90]"
      style={{ x, y }}
    >
      <motion.div
        className={cnByStyle(cursor)}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }}
        transition={{ duration: 0.15 }}
      >
        {cursor === "crosshair" && (
          <>
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function cnByStyle(cursor: CursorStyle): string {
  switch (cursor) {
    case "pointer":
      return "h-5 w-5 rounded-full border-2 border-accent bg-accent/20";
    case "ring":
      return "h-7 w-7 rounded-full border-2 border-accent shadow-[0_0_0_3px_rgba(0,0,0,0.06)]";
    case "dot":
      return "h-3 w-3 rounded-full bg-accent";
    case "diamond":
      return "h-4 w-4 rotate-45 border-2 border-accent bg-accent/20";
    case "crosshair":
      return "h-6 w-6 rounded-full text-accent opacity-90";
    default:
      return "h-4 w-4 rounded-full bg-accent";
  }
}