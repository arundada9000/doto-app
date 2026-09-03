"use client";

import { RotateCw } from "lucide-react";

const LINES = [
  "A task exploded. Our bad.",
  "Even DoTo dropped something.",
  "The app tripped over its own checklist.",
  "Technical hiccup — nothing you did, promise.",
];

const line = LINES[new Date().getDate() % LINES.length];

export default function GlobalError({
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            padding: "0 24px",
            textAlign: "center",
            background: "var(--bg)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              height: 96,
              width: 96,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              fontSize: 48,
            }}
          >
            💥
            <span
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                height: 32,
                width: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "9999px",
                background: "var(--accent)",
                color: "var(--text-onAccent)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              oops
            </span>
          </div>

          <div style={{ maxWidth: 380 }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
              Something broke
            </h1>
            <p
              style={{
                marginTop: 8,
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--text-secondary)",
              }}
            >
              {line}
              <br />
              <span style={{ color: "var(--text-tertiary)" }}>
                Your data is untouched — this is just a display slip.
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => reset()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 10,
              border: "none",
              padding: "10px 16px",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              background: "var(--accent)",
              color: "var(--text-onAccent)",
            }}
          >
            <RotateCw size={16} />
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}