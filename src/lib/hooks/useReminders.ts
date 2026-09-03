"use client";

import { useEffect, useRef } from "react";
import { useItemsStore } from "@/lib/stores/itemsStore";
import { useToastStore } from "@/lib/stores/toastStore";
import { useAppStore } from "@/lib/stores/appStore";
import { useSound } from "@/lib/hooks/useSound";
import { useHaptics } from "@/lib/hooks/useHaptics";

/** How often due reminders are swept. Reminders are minute-grained. */
const SWEEP_MS = 20_000;

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notificationPermission(): NotificationPermission | "unsupported" {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<
  NotificationPermission | "unsupported"
> {
  if (!notificationsSupported()) return "unsupported";
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

/**
 * Fires reminders while the app is open. There is no server and no push
 * subscription, so a system notification is best effort: the in-app toast and
 * sound always run, which keeps the feature honest when permission is denied
 * or the platform has no Notification support at all.
 */
export function useReminders() {
  const items = useItemsStore((s) => s.items);
  const loading = useItemsStore((s) => s.loading);
  const updateItem = useItemsStore((s) => s.updateItem);
  const toast = useToastStore((s) => s.toast);
  const openItem = useAppStore((s) => s.openItem);
  const { play } = useSound();
  const { vibrate } = useHaptics();

  // Guards against a slow store write letting the same reminder fire twice.
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (loading) return;

    const sweep = () => {
      const now = Date.now();
      const due = useItemsStore
        .getState()
        .items.filter(
          (i) =>
            !i.completed &&
            i.reminder !== undefined &&
            !i.isReminderSent &&
            i.reminder <= now &&
            !firedRef.current.has(i.id)
        );

      for (const item of due) {
        firedRef.current.add(item.id);

        if (notificationPermission() === "granted") {
          try {
            const n = new Notification("DoTo", {
              body: item.title,
              tag: `doto-reminder-${item.id}`,
              icon: "/icons/icon-192.png",
            });
            n.onclick = () => {
              window.focus();
              openItem(item.id);
              n.close();
            };
          } catch {
            // Some platforms reject constructed notifications; the toast below
            // is the fallback and always runs.
          }
        }

        play("reminder");
        vibrate("light");
        toast(item.title, "info", 8000, {
          label: "Open",
          onClick: () => openItem(item.id),
        });

        void updateItem(item.id, { isReminderSent: true });
      }
    };

    sweep();
    const id = setInterval(sweep, SWEEP_MS);
    return () => clearInterval(id);
    // items is a dependency so a newly captured reminder is swept promptly.
  }, [items, loading, updateItem, toast, openItem, play, vibrate]);
}
