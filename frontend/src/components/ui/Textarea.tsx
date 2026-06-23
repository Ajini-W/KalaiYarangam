import * as React from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
            {label}
            {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            "w-full min-h-[80px] rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-overlay",
            error && "border-danger focus:ring-danger",
            className,
          )}
          {...props}
        />
        {error && <p id={`${inputId}-error`} role="alert" className="text-xs text-danger">{error}</p>}
        {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-text-secondary">{hint}</p>}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
