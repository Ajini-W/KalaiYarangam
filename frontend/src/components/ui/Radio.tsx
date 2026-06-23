import * as React from "react";
import { cn } from "@/lib/cn";

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className, id, ...props }, ref) => {
    const inputId = id ?? `radio-${label?.toLowerCase().replace(/\s+/g, "-")}`;
    return (
      <div className="flex items-start gap-2.5">
        <input
          ref={ref}
          id={inputId}
          type="radio"
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 border border-border bg-surface accent-primary",
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
Radio.displayName = "Radio";

export interface RadioGroupProps {
  legend?: string;
  children: React.ReactNode;
  direction?: "vertical" | "horizontal";
  className?: string;
}

export function RadioGroup({ legend, children, direction = "vertical", className }: RadioGroupProps) {
  return (
    <fieldset className={cn("flex", direction === "horizontal" ? "flex-row flex-wrap gap-4" : "flex-col gap-2", className)}>
      {legend && <legend className="mb-1 text-sm font-medium text-text-primary">{legend}</legend>}
      {children}
    </fieldset>
  );
}
