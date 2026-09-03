"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Zap, ListTodo, CalendarClock, Search, MousePointerClick, Palette } from "lucide-react";
import { useAppStore } from "@/lib/stores/appStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const STEPS: {
  icon: typeof Zap;
  title: string;
  body: string;
}[] = [
  {
    icon: Zap,
    title: "Capture in a second",
    body: "Tap the Capture button or press Ctrl+K and just type. Don't organize yet — DoTo figures out tasks vs. notes as you type.",
  },
  {
    icon: ListTodo,
    title: "Tasks, notes & checklists",
    body: "Open any item to add a note, tags, attachments, or a checklist. Break big work into small, tickable pieces.",
  },
  {
    icon: CalendarClock,
    title: "Schedule or repeat",
    body: "Set a due date, reminder, or recurrence. The Today view gathers everything on your plate.",
  },
  {
    icon: Search,
    title: "Find it fast",
    body: "Press / or use the search bar to find anything across titles, notes, tags, and links.",
  },
  {
    icon: MousePointerClick,
    title: "Satisfying to finish",
    body: "Swipe a task, or tick the circle. You'll get a little reward — pick your favourite in Settings.",
  },
  {
    icon: Palette,
    title: "Make it yours",
    body: "Themes, fonts, cursors, sounds — everything in Settings. And it all works offline, on your device only.",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function OnboardingTour() {
  const open = useAppStore((s) => s.onboardOpen);
  const close = useAppStore((s) => s.closeOnboard);
  const [step, setStep] = useState(0);

  const finish = () => {
    useAppStore.getState().openHelp();
    close();
  };

  const isLast = step === STEPS.length - 1;
  const CurrentIcon = STEPS[step].icon;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Welcome to DoTo"
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.97, y: 6, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="w-full max-w-sm overflow-hidden rounded-[var(--radius-xl)] border border-border-subtle bg-surface-raised shadow-lg"
          >
            <div className="flex items-center justify-between px-5 pt-4">
              <button
                type="button"
                onClick={close}
                aria-label="Dismiss"
                className="text-xs font-medium text-text-tertiary transition-colors hover:text-text-primary"
              >
                Skip
              </button>
              <div className="flex items-center gap-1">
                {STEPS.map((_, i) => (
                  <motion.span
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-colors",
                      i <= step ? "bg-accent" : "bg-border-strong"
                    )}
                    animate={{ width: i === step ? 20 : 6 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-text-tertiary transition-colors hover:bg-hover hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 pb-2 pt-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="flex flex-col items-center text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.05 }}
                    className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent"
                  >
                    <CurrentIcon className="h-7 w-7" />
                  </motion.span>
                  <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                    {STEPS[step].title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {STEPS[step].body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-3 px-5 pb-5 pt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                Back
              </Button>
              <Button size="sm" onClick={() => (isLast ? finish() : setStep((s) => s + 1))}>
                {isLast ? "Open the manual" : "Next"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}