"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Zap,
  ListTodo,
  CalendarClock,
  ListChecks,
  Search,
  MousePointerClick,
  Palette,
  WifiOff,
} from "lucide-react";
import { useAppStore } from "@/lib/stores/appStore";

const TOPICS: {
  icon: typeof Zap;
  section: string;
  title: string;
  body: string;
}[] = [
  {
    icon: Zap,
    section: "01 · Capture",
    title: "Capture instantly",
    body: "Hit the Capture button or press Ctrl+K (or just tap on mobile) to jot down anything in seconds. Type a URL and it turns into a link chip automatically.",
  },
  {
    icon: ListTodo,
    section: "02 · Organize",
    title: "Tasks & notes",
    body: "DoTo sorts as you type — a line looks like a task becomes a task, anything else a note. Open any item to edit notes, tags, and attachments.",
  },
  {
    icon: CalendarClock,
    section: "03 · Plan",
    title: "Schedule & remind",
    body: "Add a due date, set a reminder, or make a task repeat daily, weekly, monthly, or yearly. Today gathers everything due.",
  },
  {
    icon: ListChecks,
    section: "04 · Detail",
    title: "Checklists",
    body: "Break a task into subtasks with a checklist. It lives right inside the item and ticks off as you go.",
  },
  {
    icon: Search,
    section: "05 · Find",
    title: "Search it all",
    body: "Press / or use the search bar in the sidebar to find anything — titles, notes, tags, and pasted links — in a single keystroke.",
  },
  {
    icon: MousePointerClick,
    section: "06 · Gestures",
    title: "Swipe & right-click",
    body: "Swipe a task left to delete or right to complete. Right-click any item (desktop) for a quick menu — pick its style in Settings.",
  },
  {
    icon: Palette,
    section: "07 · Make it yours",
    title: "Themes & cursor",
    body: "Choose from many themes and fonts, swap the cursor, and enable sounds, haptics, or reduce-motion in Settings.",
  },
  {
    icon: WifiOff,
    section: "08 · Offline-first",
    title: "Private & offline",
    body: "DoTo works fully offline and keeps everything on your device. Nothing is sent to a server — installable as an app, ready anywhere.",
  },
];

const SHORTCUTS: { keys: string[][]; action: string }[] = [
  {
    action: "Quick capture",
    keys: [["Ctrl", "K"], ["N"]],
  },
  {
    action: "Search everything",
    keys: [["/"], ["Ctrl", "F"]],
  },
  {
    action: "Go to Today",
    keys: [["T"]],
  },
  {
    action: "Go to Inbox",
    keys: [["I"]],
  },
  {
    action: "Go to Completed",
    keys: [["C"]],
  },
  {
    action: "Open Settings",
    keys: [["S"]],
  },
  {
    action: "Close dialogs",
    keys: [["Esc"]],
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const CLOSE_EASE = [0.4, 0, 0.2, 1] as const;

export function HelpOverlay() {
  const open = useAppStore((s) => s.helpOpen);
  const close = useAppStore((s) => s.closeHelp);
  const [tab, setTab] = useState<"guide" | "shortcuts">("guide");
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="help-overlay"
          className="fixed inset-0 z-50 bg-overlay px-4 py-[6vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="User manual"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="mx-auto flex h-full max-h-[82vh] w-full max-w-lg flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-accent">
                  User manual
                </p>
                <h2 className="text-lg font-semibold text-text-primary">
                  How to use DoTo
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-text-tertiary transition-colors hover:bg-hover hover:text-text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-1 border-b border-border-subtle px-3 py-2">
              {(["guide", "shortcuts"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded-[var(--radius-sm)] px-3 py-1.5 text-sm transition-colors ${
                    tab === t
                      ? "bg-accent-soft font-medium text-accent"
                      : "text-text-tertiary hover:text-text-primary"
                  }`}
                >
                  {t === "guide" ? "Guide" : "Shortcuts"}
                </button>
              ))}
            </div>

            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-5">
              {tab === "guide" ? (
                <div className="flex flex-col gap-3">
                  {TOPICS.map((t, i) => (
                    <TopicCard key={t.title} topic={t} index={i} />
                  ))}
                </div>
              ) : (
                <ShortcutsList />
              )}
            </div>

            <div className="border-t border-border-subtle px-5 py-3 text-center text-xs text-text-tertiary">
              Tip: everything works offline and stays on your device.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TopicCard({
  topic: t,
  index,
}: {
  topic: (typeof TOPICS)[number];
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3, ease: EASE }}
      className="flex gap-3 rounded-[var(--radius-md)] border border-border-subtle bg-surface p-3.5"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent-soft text-accent">
        <t.icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
          {t.section}
        </p>
        <h3 className="text-sm font-semibold text-text-primary">{t.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">
          {t.body}
        </p>
      </div>
    </motion.article>
  );
}

function ShortcutsList() {
  return (
    <motion.ul
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.04 } } }}
      className="flex flex-col gap-2"
    >
      {SHORTCUTS.map((s) => (
        <motion.li
          key={s.action}
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.25, ease: CLOSE_EASE },
            },
          }}
          className="flex items-center justify-between rounded-[var(--radius-md)] border border-border-subtle bg-surface px-3.5 py-3"
        >
          <span className="text-sm text-text-primary">{s.action}</span>
          <span className="flex items-center gap-1">
            {s.keys.map((combo, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-xs text-text-tertiary">or</span>}
                {combo.map((k) => (
                  <kbd
                    key={k}
                    className="rounded border border-border-strong bg-hover px-1.5 py-0.5 text-[11px] font-medium text-text-secondary"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            ))}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}