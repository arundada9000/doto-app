"use client";

import { motion } from "framer-motion";
import type { CompletionStyle } from "@/types";
import { cn } from "@/lib/utils/cn";

const CONFETTI_COLORS = [
  "bg-accent",
  "bg-secondary-color",
  "bg-warning",
  "bg-error",
  "bg-info",
];

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function rand(i: number): number {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Positioned by CelebrationLayer over the item that was completed. The root is
 * deliberately not clipped: particles travel further than the row is tall, and
 * an overflow-hidden ancestor would swallow most of the effect.
 */
export function CompletionCelebration({ style }: { style: CompletionStyle }) {
  if (style === "none") return null;

  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {style === "confetti" && <ConfettiEffect />}
      {style === "strikethrough" && <StrikethroughEffect />}
      {style === "burn" && <BurnEffect />}
      {style === "melt" && <MeltEffect />}
      {style === "check" && <CheckEffect />}
    </span>
  );
}

function ConfettiEffect() {
  const COUNT = 24;
  const parts = Array.from({ length: COUNT }, (_, i) => {
    const angle = (i / COUNT) * Math.PI * 2;
    const distance = 40 + (i % 3) * 22;
    return {
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rot: rand(i) * 360,
      w: 6 + (i % 3) * 2,
      h: 3 + (i % 2) * 3,
      delay: ((i % 5) * 0.02) + rand(i) * 0.03,
    };
  });

  return (
    <>
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className={cn("absolute left-1/2 top-1/2 rounded-[2px]", p.color)}
          style={{ width: p.w, height: p.h }}
          initial={{ scale: 0, x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 1],
            x: p.x,
            y: p.y,
            rotate: p.rot,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.9, delay: p.delay, ease: EASE_OUT }}
        />
      ))}
    </>
  );
}

function StrikethroughEffect() {
  return (
    <>
      <motion.span
        className="absolute left-4 right-4 top-1/2 h-[2.5px] -translate-y-1/2 rounded-full bg-secondary-color"
        initial={{ scaleX: 0, opacity: 0.9 }}
        animate={{ scaleX: 1, opacity: 0.9 }}
        transition={{ duration: 0.28, ease: EASE_OUT }}
        style={{ transformOrigin: "left" }}
      />
      <svg
        className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 24 24"
        fill="none"
      >
        <motion.path
          d="M6 13l4 4 8-9"
          stroke="var(--secondary-color)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        />
      </svg>
    </>
  );
}

function BurnEffect() {
  const embers = Array.from({ length: 14 }, (_, i) => ({
    x: -40 + (i / 13) * 80,
    drift: rand(i) * 30 - 15,
    size: 2 + (i % 3) * 1.5,
    delay: (i % 6) * 0.06,
  }));

  return (
    <>
      <motion.span
        className="absolute inset-0 bg-warning/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute inset-0 backdrop-brightness-110"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />
      {embers.map((e, i) => (
        <motion.span
          key={i}
          className="absolute bottom-1/2 left-1/2 rounded-full bg-warning"
          style={{ width: e.size, height: e.size }}
          initial={{ x: e.x, y: 0, opacity: 1 }}
          animate={{
            x: e.x + e.drift,
            y: -8 - (i % 4) * 8,
            opacity: [1, 1, 0],
            scale: [1, 1.4, 0],
          }}
          transition={{ duration: 0.7, delay: e.delay, ease: [0.4, 0, 0.6, 1] }}
        />
      ))}
    </>
  );
}

function MeltEffect() {
  const drops = Array.from({ length: 12 }, (_, i) => ({
    x: -45 + (i / 11) * 90,
    drop: 40 + (i % 4) * 14,
    delay: i * 0.03,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));

  return (
    <>
      {drops.map((d, i) => (
        <motion.span
          key={i}
          className={cn("absolute left-1/2 top-1/2 rounded-b-full", d.color)}
          style={{ width: 4 + (i % 3) * 2, height: 8 + (i % 3) * 3 }}
          initial={{ x: d.x, y: 0, opacity: 0, scaleY: 1 }}
          animate={{
            x: d.x,
            y: d.drop,
            opacity: [0, 1, 0],
            scaleY: [1, 1.3, 0.6],
          }}
          transition={{ duration: 0.6, delay: d.delay, ease: [0.4, 0, 0.6, 1] }}
        />
      ))}
    </>
  );
}

function CheckEffect() {
  return (
    <motion.span
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      <motion.span
        className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-color shadow-md"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        // A spring takes exactly two keyframes. The overshoot past 1 comes from
        // the spring itself rather than an intermediate keyframe.
        transition={{ type: "spring", stiffness: 420, damping: 18 }}
      >
        <motion.svg
          className="h-7 w-7 text-text-onAccent"
          viewBox="0 0 24 24"
          fill="none"
        >
          <motion.path
            d="M6 13l4 4 8-9"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
          />
        </motion.svg>
      </motion.span>
    </motion.span>
  );
}