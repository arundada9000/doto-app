"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-[var(--touch-target)] w-[var(--touch-target)]",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ className, label, size = "md", children, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-md)] text-text-secondary transition-colors hover:bg-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] active:bg-active",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
