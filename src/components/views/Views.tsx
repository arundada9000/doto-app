"use client";

import { motion } from "framer-motion";
import { Inbox, Sun, CheckCircle2 } from "lucide-react";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useAppStore } from "@/lib/stores/appStore";
import { ItemList } from "@/components/items/ItemList";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils/cn";

function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-10 border-b border-border-subtle bg-bg py-4 backdrop-blur-md"
    >
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

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className={cn("h-full")}>
      <PageHeader title="Today" subtitle={todayLabel} />

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
