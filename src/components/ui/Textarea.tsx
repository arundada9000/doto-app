"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full resize-none rounded-[var(--radius-md)] border border-border-subtle bg-surface px-3.5 py-2.5 text-base text-text-primary placeholder:text-text-tertiary transition-colors hover:border-border-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]",
          className
        )}
        {...props}
      />
    );
  }
);
