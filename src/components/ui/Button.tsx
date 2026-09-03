"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-text-onAccent hover:bg-accent-hover active:scale-[0.98]",
  secondary:
    "bg-accent-soft text-accent hover:bg-[var(--accent-soft)] hover:brightness-105",
  ghost:
    "bg-transparent text-text-secondary hover:bg-hover hover:text-text-primary",
  danger:
    "bg-transparent text-error hover:bg-[rgba(198,79,93,0.1)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-[var(--touch-target)] px-4 text-[0.9375rem] gap-2",
  lg: "h-12 px-5 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex select-none items-center justify-center rounded-[var(--radius-md)] font-medium transition-all duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
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
