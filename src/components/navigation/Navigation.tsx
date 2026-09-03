"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Inbox, Sun, CheckCircle2, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    path: "/inbox",
    label: "Inbox",
    icon: <Inbox className="h-5 w-5" />,
    shortcut: "I",
  },
  {
    path: "/today",
    label: "Today",
    icon: <Sun className="h-5 w-5" />,
    shortcut: "T",
  },
  {
    path: "/completed",
    label: "Completed",
    icon: <CheckCircle2 className="h-5 w-5" />,
    shortcut: "C",
  },
  {
    path: "/settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    shortcut: "S",
  },
];

export function useActiveItem() {
  const pathname = usePathname();
  return pathname.split("/")[1] || "inbox";
}

export { NAV_ITEMS };

export function NavLinks({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const active = useActiveItem();
  const router = useRouter();

  return (
    <nav className={cn("flex flex-col gap-1", className)} aria-label="Main">
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.path.slice(1);
        return (
          <Button
            key={item.path}
            variant="ghost"
            size="md"
            onClick={() => {
              router.push(item.path);
              onNavigate?.();
            }}
            className={cn(
              "relative isolate w-full justify-start gap-3 px-3 text-[0.9375rem]",
              isActive
                ? "text-accent"
                : "text-text-secondary hover:text-text-primary"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {/* Shares its layoutId with nothing else, so the highlight slides
                between links instead of each one fading independently. */}
            {isActive && (
              <motion.span
                layoutId="sidebar-nav-active"
                aria-hidden
                className="absolute inset-0 -z-10 rounded-[var(--radius-md)] bg-accent-soft"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            <kbd className="hidden rounded-[var(--radius-sm)] border border-border-subtle px-1.5 py-0.5 text-xs font-normal text-text-tertiary md:inline-block">
              {item.shortcut}
            </kbd>
          </Button>
        );
      })}
    </nav>
  );
}
