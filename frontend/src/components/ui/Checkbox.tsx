import * as React from "react";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, indeterminate, className, id, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? inputRef;
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    React.useEffect(() => {
      if (resolvedRef.current) resolvedRef.current.indeterminate = !!indeterminate;
    }, [indeterminate, resolvedRef]);

    return (
      <div className="flex items-start gap-2.5">
        <input
          ref={resolvedRef}
          id={inputId}
          type="checkbox"
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 rounded-[var(--radius-xs)] border border-border bg-surface accent-primary",
            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        {(label || description) && (
          <div className="flex flex-col">
            {label && <label htmlFor={inputId} className="text-sm font-medium text-text-primary cursor-pointer">{label}</label>}
            {description && <span className="text-xs text-text-secondary">{description}</span>}
          </div>
        )}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";
