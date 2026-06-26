import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAddon, rightAddon, required, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
            {label}
            {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="absolute left-3 text-text-secondary">{leftAddon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              "w-full h-9 rounded-[var(--radius-sm)] border border-border bg-surface px-3 text-sm text-text-primary placeholder:text-text-placeholder",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-overlay",
              "read-only:bg-surface-overlay read-only:cursor-default",
              error && "border-danger focus:ring-danger",
              leftAddon && "pl-9",
              rightAddon && "pr-9",
              className,
            )}
            {...props}
          />
          {rightAddon && (
            <span className="absolute right-3 text-text-secondary">{rightAddon}</span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-danger">{error}</p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-text-secondary">{hint}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
