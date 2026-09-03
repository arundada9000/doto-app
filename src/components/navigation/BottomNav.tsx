"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Plus, Inbox, Sun, CheckCircle2, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAppStore } from "@/lib/stores/appStore";

const ITEMS = [
  { path: "/inbox", label: "Inbox", icon: Inbox },
  { path: "/today", label: "Today", icon: Sun },
  { path: "/completed", label: "Completed", icon: CheckCircle2 },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const openQuickCapture = useAppStore((s) => s.openQuickCapture);

  return (
    <nav
      data-translucent="surface"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface/90 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur-md md:hidden"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {ITEMS.slice(0, 2).map((item) => (
          <MobileNavButton
            key={item.path}
            active={pathname.startsWith(item.path)}
            onClick={() => router.push(item.path)}
            label={item.label}
            icon={<item.icon className="h-6 w-6" />}
          />
        ))}

        <button
          type="button"
          onClick={openQuickCapture}
          aria-label="Capture"
          className="flex h-14 w-14 -translate-y-3 items-center justify-center rounded-full bg-accent text-text-onAccent shadow-md transition-transform active:scale-95"
        >
          <Plus className="h-7 w-7" />
        </button>

        {ITEMS.slice(2).map((item) => (
          <MobileNavButton
            key={item.path}
            active={pathname.startsWith(item.path)}
            onClick={() => router.push(item.path)}
            label={item.label}
            icon={<item.icon className="h-6 w-6" />}
          />
        ))}
      </div>
    </nav>
  );
}

function MobileNavButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex h-14 w-14 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] transition-colors",
        active ? "text-accent" : "text-text-tertiary"
      )}
    >
      {/* One shared indicator slides between tabs rather than each tab
          fading its own, so the movement reads as a single object. */}
      {active && (
        <motion.span
          layoutId="bottom-nav-active"
          aria-hidden
          className="absolute inset-x-2 inset-y-1 -z-10 rounded-[var(--radius-md)] bg-accent-soft"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <motion.span
        animate={{ scale: active ? 1.08 : 1, y: active ? -1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        {icon}
      </motion.span>
    </button>
  );
}
