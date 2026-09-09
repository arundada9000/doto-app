"use client";

import { useEffect, useRef } from "react";

/**
 * A hairline reading-progress bar that fills across the top of an article.
 *
 * The width is written straight to the node inside a requestAnimationFrame
 * rather than held in React state, so scrolling costs one style write per
 * frame instead of a full re-render per scroll event. It is also primed on
 * mount, which matters when the browser restores a mid-page scroll position.
 *
 * Deliberately not gated on reduced motion: the bar tracks scroll position one
 * to one, the same as a scrollbar, so it reports where you are rather than
 * animating on its own.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const write = () => {
      frame = 0;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const progress = max > 0 ? Math.min(1, root.scrollTop / max) : 0;
      if (bar.current) {
        bar.current.style.transform = `scaleX(${progress})`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };

    write();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1"
    >
      <div
        ref={bar}
        className="h-full bg-accent"
        style={{ transform: "scaleX(0)", transformOrigin: "left" }}
      />
    </div>
  );
}
