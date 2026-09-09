"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Reveal — a scroll-triggered entrance for marketing sections.
 *
 * The scrolling state is driven by an IntersectionObserver callback (async,
 * so it stays clear of the set-state-in-effect rule), and the animation is
 * gated through Tailwind's `motion-safe:` variant: under reduced motion the
 * hidden translate/opacity are simply not applied, so the content is always
 * visible.
 *
 * The hidden state does ship in the server-rendered markup, since the reveal
 * has to start from somewhere. `data-reveal` is the hook that makes that safe:
 * globals.css switches the hidden state off until the inline script in the
 * root layout marks the document as scripted, so a failed or slow bundle
 * leaves the page readable instead of blank.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header" | "figure" | "aside";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const isShown = shown;
  return (
    <Tag
      ref={ref as never}
      data-reveal=""
      className={`${className} motion-safe:transition-all motion-safe:duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
        isShown
          ? "motion-safe:translate-y-0 motion-safe:opacity-100"
          : "motion-safe:translate-y-6 motion-safe:opacity-0"
      }`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}