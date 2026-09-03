"use client";

import { useEffect, useRef, useState } from "react";

/** Scrolled past this, the header collapses. */
const COLLAPSE_AT = 64;
/** Back above this, it expands. The gap is hysteresis, not a rounding error. */
const EXPAND_AT = 24;
/**
 * Upper bound on the height the header gives up when it collapses. Collapsing
 * shortens the scrollable content by roughly this much, so unless there is at
 * least this much slack beyond the trigger the collapse would scroll the page
 * back up, re-expand the header, and oscillate.
 */
const SHRINK_ALLOWANCE = 96;

function scrollParentOf(el: HTMLElement): HTMLElement | null {
  let node = el.parentElement;
  while (node) {
    const overflowY = getComputedStyle(node).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") return node;
    node = node.parentElement;
  }
  return null;
}

/**
 * Collapse state for a scroll-linked header. Returns a ref to place at the top
 * of the scrolling content and whether the header should be collapsed.
 */
export function useCollapsedHeader() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const scroller = scrollParentOf(anchor);
    if (!scroller) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollable = scroller.scrollHeight - scroller.clientHeight;
      const top = scroller.scrollTop;

      setCollapsed((wasCollapsed) => {
        if (wasCollapsed) return top > EXPAND_AT;
        // Only collapse when there is room to absorb the height it frees.
        return top > COLLAPSE_AT && scrollable > COLLAPSE_AT + SHRINK_ALLOWANCE;
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { anchorRef, collapsed };
}
