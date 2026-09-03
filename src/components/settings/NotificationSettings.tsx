"use client";

import { useSyncExternalStore } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";
import {
  notificationPermission,
  requestNotificationPermission,
} from "@/lib/hooks/useReminders";
import { useToastStore } from "@/lib/stores/toastStore";

type Permission = NotificationPermission | "unsupported" | "unknown";

// Permission lives on the Notification API rather than in React state. Reading
// it through an external store keeps the server render ("unknown") stable while
// letting a granted prompt re-render the section immediately.
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
const getSnapshot = (): Permission => notificationPermission();
const getServerSnapshot = (): Permission => "unknown";

export function NotificationSettings() {
  const toast = useToastStore((s) => s.toast);
  const permission = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const ask = async () => {
    const result = await requestNotificationPermission();
    listeners.forEach((l) => l());
    if (result === "granted") toast("Reminders will notify you", "success");
    else if (result === "denied") toast("Notifications blocked", "info");
  };

  const copy: Record<Permission, string> = {
    unknown: "Checking what this browser supports.",
    unsupported:
      "This browser cannot show system notifications. Reminders still appear inside DoTo while it is open.",
    granted:
      "Reminders appear as system notifications while DoTo is open, and always inside the app.",
    denied:
      "Notifications are blocked in your browser settings. Reminders still appear inside DoTo while it is open.",
    default:
      "Allow notifications and reminders will reach you as system notifications while DoTo is open.",
  };

  const Icon =
    permission === "granted" ? BellRing : permission === "denied" ? BellOff : Bell;

  return (
    <div className="rounded-[var(--radius-lg)] border border-border-subtle bg-surface p-4">
      <div className="flex items-start gap-3">
        <Icon
          className={
            permission === "granted"
              ? "mt-0.5 h-4 w-4 shrink-0 text-accent"
              : "mt-0.5 h-4 w-4 shrink-0 text-text-tertiary"
          }
        />
        <p className="text-sm leading-relaxed text-text-tertiary">
          {copy[permission]}
        </p>
      </div>

      {permission === "default" && (
        <button
          type="button"
          onClick={() => void ask()}
          className="mt-3 flex items-center gap-2 rounded-[var(--radius-md)] border border-border-subtle px-3.5 py-2 text-sm font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-hover"
        >
          <Bell className="h-4 w-4" />
          Allow notifications
        </button>
      )}
    </div>
  );
}
