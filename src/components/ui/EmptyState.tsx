import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <motion.div
        className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-hover text-text-tertiary"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 15 }}
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {icon}
        </motion.div>
      </motion.div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {message && (
        <p className="mt-1.5 max-w-sm text-sm text-text-secondary">{message}</p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={cn(
            "mt-5 inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-accent px-5 text-sm font-medium text-text-onAccent transition-colors hover:bg-accent-hover"
          )}
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
