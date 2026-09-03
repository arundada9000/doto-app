"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, invalid, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-[var(--touch-target)] w-full rounded-[var(--radius-md)] border bg-surface px-3.5 text-base text-text-primary placeholder:text-text-tertiary transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]",
          invalid
            ? "border-error"
            : "border-border-subtle hover:border-border-strong",
          className
        )}
        {...props}
      />
    );
  }
);
