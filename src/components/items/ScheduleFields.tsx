"use client";

import { Bell, Calendar } from "lucide-react";
import type { RecurrenceRule } from "@/types";
import { DateField } from "@/components/items/DateField";
import { TimeField } from "@/components/items/TimeField";
import { cn } from "@/lib/utils/cn";

interface ScheduleFieldsProps {
  dueAt?: number;
  reminder?: number;
  recurrence?: RecurrenceRule;
  onChange: (patch: {
    dueAt?: number;
    reminder?: number;
    recurrence?: RecurrenceRule;
  }) => void;
}

const REMINDER_OPTIONS: { label: string; minutes: number | null }[] = [
  { label: "No reminder", minutes: null },
  { label: "At due time", minutes: 0 },
  { label: "10 minutes before", minutes: 10 },
  { label: "30 minutes before", minutes: 30 },
  { label: "1 hour before", minutes: 60 },
  { label: "1 day before", minutes: 1440 },
];

// Index matches Date.getDay(), so Sunday is first.
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const RECURRENCE_OPTIONS: { label: string; value?: RecurrenceRule }[] = [
  { label: "Does not repeat" },
  { label: "Daily", value: { type: "daily", interval: 1 } },
  { label: "Weekly", value: { type: "weekly", interval: 1 } },
  { label: "Monthly", value: { type: "monthly", interval: 1 } },
  { label: "Yearly", value: { type: "yearly", interval: 1 } },
];

export function ScheduleFields({
  dueAt,
  reminder,
  recurrence,
  onChange,
}: ScheduleFieldsProps) {
  const reminderMinutes =
    dueAt != null && reminder != null
      ? Math.max(0, Math.round((dueAt - reminder) / 60000))
      : null;

  const reflectReminder = (
    due: number | undefined,
    selectedMinutes: number | null | undefined
  ) => {
    if (due == null || selectedMinutes == null) {
      return { dueAt: due, reminder: undefined };
    }
    return { dueAt: due, reminder: due - selectedMinutes * 60000 };
  };

  const setDue = (ts: number | undefined) => {
    onChange(reflectReminder(ts, reminderMinutes));
  };

  const setTime = (ts: number | undefined) => {
    onChange(reflectReminder(ts, reminderMinutes));
  };

  const setReminder = (minutes: number | null) => {
    onChange(reflectReminder(dueAt, minutes));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <DateField value={dueAt} onChange={setDue} />
        <TimeField value={dueAt} onChange={setTime} />
      </div>

      {dueAt != null && (
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 shrink-0 text-text-tertiary" />
          <select
            value={reminderMinutes == null ? -1 : reminderMinutes}
            onChange={(e) =>
              setReminder(e.target.value === "-1" ? null : Number(e.target.value))
            }
            aria-label="Reminder"
            className="h-10 flex-1 rounded-[var(--radius-md)] border border-border-subtle bg-surface px-3 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          >
            {REMINDER_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.minutes ?? -1}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Calendar className="h-4 w-4 shrink-0 text-text-tertiary" />
        {RECURRENCE_OPTIONS.map((opt) => {
          // Matched on type alone. Capture can set weekdays from a phrase such
          // as "every monday", and comparing the whole rule made that show as
          // unselected, so choosing Weekly again silently erased the days.
          const isActive = recurrence?.type === opt.value?.type;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() =>
                onChange({
                  // Re-selecting the active option keeps the rule as it stands,
                  // rather than replacing it with the bare preset and losing
                  // any weekdays already on it.
                  recurrence: isActive
                    ? recurrence
                    : opt.value && { ...opt.value },
                })
              }
              aria-pressed={isActive}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border-subtle text-text-secondary hover:border-border-strong"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {recurrence?.type === "weekly" && (
        <div className="flex flex-wrap items-center gap-1.5 pl-6">
          {WEEKDAYS.map((day, index) => {
            const selected = recurrence.daysOfWeek?.includes(index) ?? false;
            return (
              <button
                key={DAY_LABELS[index]}
                type="button"
                aria-pressed={selected}
                aria-label={`Repeat on ${DAY_LABELS[index]}`}
                onClick={() => {
                  const current = recurrence.daysOfWeek ?? [];
                  const next = selected
                    ? current.filter((d) => d !== index)
                    : [...current, index].sort((a, b) => a - b);
                  onChange({
                    recurrence: {
                      ...recurrence,
                      // No days selected means plain weekly, which is what the
                      // rule already meant before any day was picked.
                      daysOfWeek: next.length > 0 ? next : undefined,
                    },
                  });
                }}
                className={cn(
                  "h-7 w-7 rounded-full border text-[11px] font-medium transition-colors",
                  selected
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border-subtle text-text-tertiary hover:border-border-strong hover:text-text-secondary"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
