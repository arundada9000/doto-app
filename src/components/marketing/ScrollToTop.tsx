"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useReducedMotion } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils/cn";

const CIRCUMFERENCE = 2 * Math.PI * 21;

/**
 * A floating "back to top" button with a progress ring that fills as the page
 * is scrolled, standing in for the reading-progress bar it replaced.
 *
 * The ring is written straight to the SVG node inside a requestAnimationFrame
 * so scrolling costs one attribute write per frame. Visibility lives in state
 * (updated only by scroll events, never synchronously in the effect), and the
 * click handler respects reduced motion by jumping instead of smoothing.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const origin = useRef<SVGCircleElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let frame = 0;

    const write = () => {
      frame = 0;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const progress = max > 0 ? Math.min(1, root.scrollTop / max) : 0;
      if (origin.current) {
        origin.current.style.strokeDashoffset = String(
          CIRCUMFERENCE * (1 - progress)
        );
      }
    };

    const schedule = () => {
      setVisible(document.documentElement.scrollTop > 240);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
      className={cn(
        "pointer-events-auto fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface/80 backdrop-blur-md transition-all duration-200",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      )}
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      <svg
        aria-hidden
        viewBox="0 0 48 48"
        className="absolute inset-0 h-full w-full -rotate-90"
      >
        <circle
          cx={24}
          cy={24}
          r={21}
          fill="none"
          strokeWidth={2.5}
          className="stroke-border-strong"
          opacity={0.45}
        />
        <circle
          ref={origin}
          cx={24}
          cy={24}
          r={21}
          fill="none"
          strokeWidth={2.5}
          strokeLinecap="round"
          className="stroke-accent"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <ArrowUp className="h-5 w-5 text-text-primary" strokeWidth={2.5} />
    </button>
  );
}