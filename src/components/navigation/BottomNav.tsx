"use client";

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
        "flex h-14 w-14 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] transition-colors",
        active ? "text-accent" : "text-text-tertiary"
      )}
    >
      {icon}
    </button>
  );
}
