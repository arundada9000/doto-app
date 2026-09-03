"use client";

import { cn } from "@/lib/utils/cn";

interface DateFieldProps {
  value: number | undefined;
  onChange: (ts: number | undefined) => void;
}

export function DateField({ value, onChange }: DateFieldProps) {
  const dateStr = value ? toDateInputValue(value) : "";

  return (
    <label className="flex w-full items-center gap-2">
      <span className="text-sm text-text-tertiary">Date</span>
      <input
        type="date"
        value={dateStr}
        onChange={(e) => {
          const v = e.target.value;
          if (!v) {
            onChange(undefined);
            return;
          }
          const [y, m, d] = v.split("-").map(Number);
          const base = value ?? Date.now();
          const existing = new Date(base);
          const next = new Date(y, (m ?? 1) - 1, d ?? 1);
          next.setHours(existing.getHours(), existing.getMinutes(), 0, 0);
          onChange(next.getTime());
        }}
        aria-label="Due date"
        className={cn(
          "h-10 flex-1 rounded-[var(--radius-md)] border border-border-subtle bg-surface px-3 text-sm text-text-primary transition-colors hover:border-border-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]",
          !value && "text-text-tertiary"
        )}
      />
    </label>
  );
}

function toDateInputValue(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
