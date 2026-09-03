"use client";

import Link from "next/link";
import { Home, RotateCw } from "lucide-react";

const LINES = [
  "This page got lost between a task and a note.",
  "404. Even our search cannot find this one.",
  "You swiped this page away by mistake.",
  "Nothing here. Not even a half-finished checklist.",
];

const line = LINES[new Date().getDate() % LINES.length];

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-[var(--radius-xl)] border border-border-subtle bg-surface">
        <span className="text-5xl">🫥</span>
        <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-text-onAccent">
          404
        </span>
      </div>

      <div className="max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Lost it
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {line}
          <br />
          <span className="text-text-tertiary">
            The good news: your tasks are all still safe.
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/inbox"
          className="flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-4 py-2.5 text-sm font-medium text-text-onAccent transition-colors hover:bg-accent-hover"
        >
          <Home className="h-4 w-4" />
          Back to inbox
        </Link>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border-subtle px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
        >
          <RotateCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    </div>
  );
}