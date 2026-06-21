import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption { value: string; label: string; disabled?: boolean }

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, placeholder, options, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
            {label}
            {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            className={cn(
              "w-full h-9 appearance-none rounded-[var(--radius-sm)] border border-border bg-surface pl-3 pr-9 text-sm text-text-primary",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-overlay",
              error && "border-danger focus:ring-danger",
              className,
            )}
            {...props}
          >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map((o) => (
              <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
        </div>
        {error && <p role="alert" className="text-xs text-danger">{error}</p>}
        {hint && !error && <p className="text-xs text-text-secondary">{hint}</p>}
      </div>
    );
  },
);
Select.displayName = "Select";
