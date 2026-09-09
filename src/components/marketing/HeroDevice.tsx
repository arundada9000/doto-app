"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useMediaQuery";

const SCRIPT = "Call Ram tomorrow at 10 #work";

/**
 * The hero centrepiece: the Today screenshot inside a device frame that tilts
 * toward the cursor and floats on scroll.
 *
 * Both transforms are written straight to their nodes inside a shared
 * requestAnimationFrame rather than held in React state. The transform itself
 * was always compositor work, but routing it through state cost a full
 * reconciliation on every pointer and scroll event to get there.
 */
export function HeroDevice() {
  const frame = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tiltX = 0;
    let tiltY = 0;
    let float = 0;

    const write = () => {
      raf = 0;
      if (frame.current) {
        frame.current.style.transform = `translateY(${float}px)`;
      }
      if (panel.current) {
        panel.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };

    const onPointer = (e: PointerEvent) => {
      const el = frame.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      tiltX = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
      tiltY = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      schedule();
    };

    const onScroll = () => {
      float = window.scrollY * 0.06;
      schedule();
    };

    const el = frame.current;
    el?.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      el?.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={frame}
      className="relative mx-auto mt-16 w-full max-w-3xl"
      style={{
        perspective: 1400,
        transform: "translateY(0px)",
        transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        ref={panel}
        className="relative overflow-hidden rounded-[calc(var(--radius-xl)*2.1)] border border-border-strong/60 bg-surface shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)]"
        style={{
          transform: "rotateX(0deg) rotateY(0deg)",
          transformStyle: "preserve-3d",
          transition: "transform 0.25s ease-out",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.35), transparent 40%)",
          }}
        />
        <Image
          src="/screenshots/today-wide.png"
          alt="DoTo Today view: the day's progress ring, a streak, an overdue task, and the tasks still due"
          width={1600}
          height={820}
          priority
          className="w-full"
        />
      </div>

      {/* Floating capture chip */}
      <div
        className="absolute -right-3 top-8 hidden items-center gap-2 rounded-[calc(var(--radius-lg)*1.4)] px-3.5 py-2 shadow-lg sm:flex md:-right-10"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <span className="text-sm font-medium text-text-primary">
          Ctrl + K
        </span>
        <ArrowRight className="h-4 w-4 text-text-tertiary" aria-hidden />
      </div>
    </div>
  );
}

/**
 * Animated capture demo: types the plain-language sentence character by
 * character, then reveals the chips DoTo understood. Loops forever with a
 * calm pause, driven by timeouts under reduced-motion awareness.
 *
 * The finished state is the initial state, so the sentence and both chips are
 * in the server-rendered markup. Starting empty meant the clearest statement
 * of the headline feature existed only after hydration, which put it out of
 * reach of anything that reads the page without running scripts. The animation
 * rewinds to the beginning once it takes over.
 */
export function CaptureDemo() {
  const [typed, setTyped] = useState(SCRIPT);
  const [reveal, setReveal] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let i = 0;
    let cancelled = false;
    const step = () => {
      if (cancelled) return;
      i += 1;
      setTyped(SCRIPT.slice(0, i));
      if (i < SCRIPT.length) {
        window.setTimeout(step, 46);
      } else {
        window.setTimeout(() => setReveal(true), 350);
        window.setTimeout(restart, 5200);
      }
    };
    function restart() {
      if (cancelled) return;
      setReveal(false);
      setTyped("");
      i = 0;
      window.setTimeout(step, 420);
    }
    // Rewinds inside the timeout rather than in the effect body, so the first
    // paint keeps the server's finished state and no state is set during the
    // effect itself.
    const t = window.setTimeout(restart, 900);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [reduced]);

  const display = reduced ? SCRIPT : typed;
  const chipsIn = reduced ? true : reveal;

  return (
    <div className="ios-rise ios-rise-2 mx-auto mt-14 max-w-2xl overflow-hidden rounded-[calc(var(--radius-xl)*1.6)] border border-border-subtle bg-surface shadow-lg">
      <div className="p-7 md:p-9">
        <p className="text-xs uppercase tracking-wider text-text-tertiary">
          You type
        </p>
        <p className="mt-3 min-h-[3rem] font-mono text-lg text-text-primary md:text-xl">
          {display}
          {!reduced && (
            <span
              className="ml-0.5 inline-block h-5 w-[2px] animate-pulse bg-accent align-middle"
              aria-hidden
            />
          )}
        </p>
      </div>
      <div className="h-px bg-border-subtle" />
      <div className="p-7 md:p-9">
        <p className="text-xs uppercase tracking-wider text-text-tertiary">
          DoTo saves
        </p>
        <div className="mt-4 flex items-start gap-3">
          <span
            aria-hidden
            className="mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 border-border-strong"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[0.9375rem] text-text-primary">Call Ram</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <Chip
                active={chipsIn}
                text="Tomorrow, 10:00"
              />
              <Chip active={chipsIn} text="#work" hash />
            </div>
          </div>
        </div>
      </div>
      <p className="px-7 pb-5 text-center text-sm text-text-tertiary md:px-9">
        Never required. Type{" "}
        <span className="font-medium text-text-secondary">Buy milk</span> and
        you get a task called Buy milk.
      </p>
    </div>
  );
}

function Chip({
  active,
  text,
  hash,
}: {
  active: boolean;
  text: string;
  hash?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
        active
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-2 scale-[0.96] opacity-0"
      }`}
    >
      {hash && (
        <span aria-hidden className="font-semibold">
          #
        </span>
      )}
      {text}
    </span>
  );
}