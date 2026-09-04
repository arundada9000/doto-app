import { useSyncExternalStore } from "react";

function subscribeToMediaQuery(query: string, callback: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/**
 * Track a media query as state. Uses useSyncExternalStore so it is SSR-safe
 * and never triggers a setState-in-effect linter warning. SSR snapshot is
 * false, which is correct for entrance animations (content settles in place).
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => subscribeToMediaQuery(query, cb),
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** True when the visitor has asked the OS/site to reduce motion. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}