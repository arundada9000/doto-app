"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Inbox, Sun, CheckCircle2, Flame } from "lucide-react";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useAppStore } from "@/lib/stores/appStore";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { greetingFor, currentStreak, dayKey } from "@/lib/utils/dates";
import { ItemList } from "@/components/items/ItemList";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { cn } from "@/lib/utils/cn";

function PageHeader({
  title,
  subtitle,
  greeting,
}: {
  title: string;
  subtitle: string;
  greeting?: string;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-10 border-b border-border-subtle bg-bg py-4 backdrop-blur-md"
    >
      {greeting && (
        <p className="px-4 pb-1 text-sm text-accent md:px-6">{greeting}</p>
      )}
      <h1 className="px-4 text-2xl font-semibold tracking-tight text-text-primary md:px-6">
        {title}
      </h1>
      <p className="px-4 pt-0.5 text-sm text-text-secondary md:px-6">{subtitle}</p>
    </motion.header>
  );
}

export function InboxView() {
  const items = useItemsStore((s) => s.items);
  const loading = useItemsStore((s) => s.loading);
  const openQuickCapture = useAppStore((s) => s.openQuickCapture);
  const profileName = useSettingsStore((s) => s.profileName);

  const inboxItems = items
    .filter((i) => !i.completed && !i.dueAt)
    .sort((a, b) => a.createdAt - b.createdAt);

  const dueItems = items
    .filter((i) => !i.completed && i.dueAt)
    .sort((a, b) => (a.dueAt ?? 0) - (b.dueAt ?? 0));

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div>
      <PageHeader
        title="Inbox"
        subtitle="Everything you capture lands here. Deal with it later."
        greeting={greetingFor(profileName)}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-7 w-7" />}
          title="Your inbox is clear"
          message="Capture anything on your mind and it will appear here, ready when you are."
          actionLabel="Capture something"
          onAction={openQuickCapture}
        />
      ) : (
        <div className="p-2 md:p-4">
          {dueItems.length > 0 && (
            <section className="mb-1">
              <h2 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Scheduled
              </h2>
              <ItemList items={dueItems} />
            </section>
          )}
          <section>
            {dueItems.length > 0 && inboxItems.length > 0 && (
              <h2 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Unsorted
              </h2>
            )}
            <ItemList items={inboxItems} />
          </section>
        </div>
      )}
    </div>
  );
}

export function TodayView() {
  const items = useItemsStore((s) => s.items);
  const loading = useItemsStore((s) => s.loading);
  const openQuickCapture = useAppStore((s) => s.openQuickCapture);
  const profileName = useSettingsStore((s) => s.profileName);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const todaysItems = items
    .filter((i) => {
      if (i.completed) return false;
      if (i.dueAt) {
        return i.dueAt >= startOfToday.getTime() && i.dueAt < endOfToday.getTime();
      }
      return false;
    })
    .sort((a, b) => (a.dueAt ?? 0) - (b.dueAt ?? 0));

  const overdueItems = items
    .filter((i) => !i.completed && i.dueAt && i.dueAt < startOfToday.getTime())
    .sort((a, b) => (a.dueAt ?? 0) - (b.dueAt ?? 0));

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const startOfTodayMs = startOfToday.getTime();
  const doneToday = items.filter(
    (i) =>
      i.completed &&
      i.completedAt &&
      i.completedAt >= startOfTodayMs &&
      i.completedAt < endOfToday.getTime()
  ).length;
  const plannedToday = todaysItems.length;
  const totalToday = doneToday + plannedToday;
  const progress = totalToday > 0 ? doneToday / totalToday : 0;

  const streak = useMemo(() => {
    const doneDays = new Set<string>();
    for (const i of items) {
      if (i.completed && i.completedAt) doneDays.add(dayKey(i.completedAt));
    }
    return currentStreak(doneDays);
  }, [items]);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className={cn("h-full")}>
      <PageHeader title="Today" subtitle={todayLabel} greeting={greetingFor(profileName)} />

      <TodaySummary
        doneToday={doneToday}
        plannedToday={plannedToday}
        progress={progress}
        streak={streak}
      />

      {overdueItems.length === 0 && todaysItems.length === 0 ? (
        <EmptyState
          icon={<Sun className="h-7 w-7" />}
          title="Nothing due today"
          message="Enjoy the calm. Capture anything new whenever it comes to mind."
          actionLabel="Capture something"
          onAction={openQuickCapture}
        />
      ) : (
        <div className="p-2 md:p-4">
          {overdueItems.length > 0 && (
            <section className="mb-1">
              <h2 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-error">
                Overdue
              </h2>
              <ItemList items={overdueItems} />
            </section>
          )}
          <section>
            {todaysItems.length > 0 && (
              <>
                {overdueItems.length > 0 && (
                  <h2 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                    Later today
                  </h2>
                )}
                <ItemList items={todaysItems} />
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export function CompletedView() {
  const items = useItemsStore((s) => s.items);
  const loading = useItemsStore((s) => s.loading);

  const completedItems = items
    .filter((i) => i.completed)
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div>
      <PageHeader
        title="Completed"
        subtitle="A quiet record of everything you have finished."
      />

      {completedItems.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="h-7 w-7" />}
          title="Nothing completed yet"
          message="Finish a task and it will be marked off here."
        />
      ) : (
        <div className="p-2 md:p-4">
          <ItemList items={completedItems} />
        </div>
      )}
    </div>
  );
}

function StreakBadge({ streak }: { streak: number }) {
  const dayWord = streak === 1 ? "day" : "days";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.12 }}
      className="flex shrink-0 items-center gap-1.5 rounded-[var(--radius-md)] border border-border-subtle bg-surface px-2.5 py-1.5"
    >
      <Flame className="h-4 w-4 text-accent" aria-hidden />
      <span
        className="text-sm font-semibold tabular-nums text-text-primary"
        aria-hidden
      >
        {streak}
      </span>
      <span className="sr-only">
        Current streak: {streak} consecutive {dayWord} with a completed task.
      </span>
    </motion.div>
  );
}

function TodaySummary({
  doneToday,
  plannedToday,
  progress,
  streak,
}: {
  doneToday: number;
  plannedToday: number;
  progress: number;
  streak: number;
}) {
  if (doneToday === 0 && plannedToday === 0 && streak === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-4 border-b border-border-subtle px-4 py-3 md:px-6"
    >
      <ProgressRing value={progress} size={56} stroke={5} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary">
          {doneToday > 0 ? (
            <>
              Finished <span className="text-secondary-color">{doneToday}</span>{" "}
              {doneToday === 1 ? "task" : "tasks"} today
            </>
          ) : (
            "Nothing wrapped up yet. Go get one."
          )}
        </p>
        {plannedToday > 0 && (
          <p className="mt-0.5 text-xs text-text-tertiary">
            {plannedToday} {plannedToday === 1 ? "task" : "tasks"} still on today&apos;s
            plate.
          </p>
        )}
        {plannedToday === 0 && streak > 0 && (
          <p className="mt-0.5 text-xs text-text-tertiary">
            {streak} {streak === 1 ? "day" : "days"} running.
          </p>
        )}
      </div>
      {streak > 0 && <StreakBadge streak={streak} />}
    </motion.div>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-4 p-5" aria-hidden>
      <div className="h-9 w-40 animate-pulse rounded-md bg-hover" />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-14 animate-pulse rounded-[var(--radius-md)] bg-hover" />
      ))}
    </div>
  );
}
