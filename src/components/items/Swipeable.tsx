"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent } from "framer-motion";

interface SwipeableProps {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  rightLabel?: string;
  leftLabel?: string;
  children: React.ReactNode;
}

const THRESHOLD = 90;

export function Swipeable({
  onSwipeRight,
  onSwipeLeft,
  rightLabel = "Done",
  leftLabel = "Delete",
  children,
}: SwipeableProps) {
  const x = useMotionValue(0);
  const [reveal, setReveal] = useState<"left" | "right" | null>(null);
  const firedRef = useRef(false);

  const canSwipeRight = !!onSwipeRight;
  const canSwipeLeft = !!onSwipeLeft;

  useMotionValueEvent(x, "change", (latest) => {
    if (!canSwipeLeft && !canSwipeRight) return;
    if (latest < -8) setReveal((r) => (r === "left" ? r : "left"));
    else if (latest > 8) setReveal((r) => (r === "right" ? r : "right"));
    else setReveal((r) => (r ? null : r));
  });

  const commit = (dir: "left" | "right") => {
    if (firedRef.current) return;
    firedRef.current = true;
    if (dir === "right") onSwipeRight?.();
    else onSwipeLeft?.();
  };

  if (!canSwipeRight && !canSwipeLeft) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-md)]">
      <AnimatePresence>
        {reveal === "left" && (
          <motion.div
            aria-hidden
            className="absolute inset-y-0 right-0 flex w-24 items-center justify-center bg-error text-sm font-medium text-text-onAccent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {leftLabel}
          </motion.div>
        )}
        {reveal === "right" && (
          <motion.div
            aria-hidden
            className="absolute inset-y-0 left-0 flex w-24 items-center justify-center bg-secondary-color text-sm font-medium text-text-onAccent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {rightLabel}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -THRESHOLD - 30, right: THRESHOLD + 30 }}
        dragElastic={0.3}
        onDragEnd={(_, info) => {
          const v = info.offset.x + info.velocity.x * 0.4;
          if (v < -THRESHOLD) commit("left");
          else if (v > THRESHOLD) commit("right");
          firedRef.current = false;
        }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 40 }}
        whileTap={{ cursor: "grabbing" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
