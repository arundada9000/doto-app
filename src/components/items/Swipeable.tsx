"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { useHaptics } from "@/lib/hooks/useHaptics";

interface SwipeableProps {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  rightLabel?: string;
  leftLabel?: string;
  children: React.ReactNode;
}

/** Distance at which the gesture commits on release. */
const THRESHOLD = 90;
/** How far past the threshold the row can still be pulled, with resistance. */
const OVERSHOOT = 40;

export function Swipeable({
  onSwipeRight,
  onSwipeLeft,
  rightLabel = "Done",
  leftLabel = "Delete",
  children,
}: SwipeableProps) {
  const x = useMotionValue(0);
  const [reveal, setReveal] = useState<"left" | "right" | null>(null);
  const [armed, setArmed] = useState(false);
  const firedRef = useRef(false);
  const armedRef = useRef(false);
  const { vibrate } = useHaptics();

  const canSwipeRight = !!onSwipeRight;
  const canSwipeLeft = !!onSwipeLeft;

  // The action label grows as the row approaches the commit point, so the
  // gesture says what it is about to do before you let go.
  const labelScale = useTransform(
    x,
    [-THRESHOLD, -THRESHOLD * 0.4, 0, THRESHOLD * 0.4, THRESHOLD],
    [1.15, 0.9, 0.8, 0.9, 1.15]
  );

  useMotionValueEvent(x, "change", (latest) => {
    if (!canSwipeLeft && !canSwipeRight) return;

    if (latest < -8) setReveal((r) => (r === "left" ? r : "left"));
    else if (latest > 8) setReveal((r) => (r === "right" ? r : "right"));
    else setReveal((r) => (r ? null : r));

    // One tick as the threshold is crossed in either direction, so the commit
    // point is felt rather than guessed at.
    const past = Math.abs(latest) >= THRESHOLD;
    if (past !== armedRef.current) {
      armedRef.current = past;
      setArmed(past);
      if (past) vibrate("light");
    }
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
            animate={{ opacity: armed ? 1 : 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.span style={{ scale: labelScale }}>{leftLabel}</motion.span>
          </motion.div>
        )}
        {reveal === "right" && (
          <motion.div
            aria-hidden
            className="absolute inset-y-0 left-0 flex w-24 items-center justify-center bg-secondary-color text-sm font-medium text-text-onAccent"
            initial={{ opacity: 0 }}
            animate={{ opacity: armed ? 1 : 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.span style={{ scale: labelScale }}>{rightLabel}</motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{ x }}
        drag="x"
        // Constrained to the directions that actually do something. A note has
        // no complete action, and dragging it right revealed nothing at all.
        dragConstraints={{
          left: canSwipeLeft ? -(THRESHOLD + OVERSHOOT) : 0,
          right: canSwipeRight ? THRESHOLD + OVERSHOOT : 0,
        }}
        dragElastic={0.18}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 40 }}
        onDragEnd={(_, info) => {
          const projected = info.offset.x + info.velocity.x * 0.4;
          if (canSwipeLeft && projected < -THRESHOLD) commit("left");
          else if (canSwipeRight && projected > THRESHOLD) commit("right");
          firedRef.current = false;
        }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 40 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
