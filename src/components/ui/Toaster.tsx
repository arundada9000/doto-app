"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useToastStore } from "@/lib/stores/toastStore";
import { cn } from "@/lib/utils/cn";

const ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-success" />,
  error: <AlertCircle className="h-5 w-5 text-error" />,
  info: <Info className="h-5 w-5 text-info" />,
  default: null,
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-center gap-2.5 rounded-[var(--radius-md)] border border-border-subtle bg-surface-raised px-3.5 py-3 text-sm text-text-primary shadow-lg",
              toast.variant === "error" && "border-error/30",
              toast.variant === "success" && "border-success/30"
            )}
            role={toast.variant === "error" ? "alert" : "status"}
          >
            {ICONS[toast.variant]}
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              className="rounded p-1 text-text-tertiary hover:bg-hover hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
