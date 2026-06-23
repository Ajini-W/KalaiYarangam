"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

const variants = {
  primary:   "bg-primary text-primary-foreground hover:opacity-80 active:opacity-90 disabled:opacity-50",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-80 active:opacity-90 disabled:opacity-50",
  outline:   "border border-border bg-transparent text-text-primary hover:bg-surface-raised disabled:opacity-50",
  ghost:     "bg-transparent text-text-primary hover:bg-surface-overlay disabled:opacity-50",
  danger:    "bg-danger text-white hover:bg-danger-700 active:bg-danger-700 disabled:opacity-50",
  link:      "bg-transparent text-primary hover:underline p-0 h-auto disabled:opacity-50",
} as const;

const sizes = {
  xs: "h-7  px-2.5 text-xs  gap-1   rounded-[var(--radius-sm)]",
  sm: "h-8  px-3   text-sm  gap-1.5 rounded-[var(--radius-sm)]",
  md: "h-9  px-4   text-sm  gap-2   rounded-[var(--radius-md)]",
  lg: "h-11 px-5   text-base gap-2  rounded-[var(--radius-md)]",
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, leftIcon, rightIcon, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  ),
);
Button.displayName = "Button";
