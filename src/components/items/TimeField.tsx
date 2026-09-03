"use client";

import { cn } from "@/lib/utils/cn";

interface TimeFieldProps {
  value: number | undefined;
  onChange: (ts: number | undefined) => void;
}

export function TimeField({ value, onChange }: TimeFieldProps) {
  const timeStr = value ? toTimeInputValue(value) : "";

  return (
    <label className="flex w-full items-center gap-2">
      <span className="text-sm text-text-tertiary">Time</span>
      <input
        type="time"
        value={timeStr}
        onChange={(e) => {
          const v = e.target.value;
          if (!v) {
            onChange(undefined);
            return;
          }
          const [h, m] = v.split(":").map(Number);
          const base = value ?? Date.now();
          const next = new Date(base);
          next.setHours(h ?? 0, m ?? 0, 0, 0);
          onChange(next.getTime());
        }}
        aria-label="Due time"
        className={cn(
          "h-10 w-full rounded-[var(--radius-md)] border border-border-subtle bg-surface px-3 text-sm text-text-primary transition-colors hover:border-border-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        )}
      />
    </label>
  );
}

function toTimeInputValue(ts: number): string {
  const d = new Date(ts);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}
