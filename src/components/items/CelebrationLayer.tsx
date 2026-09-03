"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useCelebrationStore } from "@/lib/stores/celebrationStore";
import { CompletionCelebration } from "@/components/items/CompletionCelebration";

const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * Completion effects render here rather than inside the item they came from.
 * Completing an item removes it from the Inbox and Today lists immediately, so
 * an effect owned by that row would unmount with it before it could play.
 */
export function CelebrationLayer() {
  const celebrations = useCelebrationStore((s) => s.celebrations);
  // This component renders nothing but a portal, so it has to stay empty until
  // hydration finishes or the client tree will not line up with the server one.
  const mounted = useSyncExternalStore(subscribe, onClient, onServer);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[55] overflow-hidden"
    >
      {celebrations.map((c) => (
        <span
          key={c.id}
          className="absolute"
          style={{
            top: c.rect.top,
            left: c.rect.left,
            width: c.rect.width,
            height: c.rect.height,
          }}
        >
          <CompletionCelebration style={c.style} />
        </span>
      ))}
    </div>,
    document.body
  );
}
