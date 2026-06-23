"use client";

import * as React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "./Badge";

export interface FilterOption { value: string; label: string }
export interface FilterDef { key: string; label: string; options: FilterOption[] }

export interface FilterBarProps {
  filters: FilterDef[];
  active: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  className?: string;
}

export function FilterBar({ filters, active, onChange, onClear, className }: FilterBarProps) {
  const activeCount = Object.values(active).filter(Boolean).length;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
        <SlidersHorizontal size={15} />
        Filters
      </span>
      {filters.map((f) => (
        <select
          key={f.key}
          value={active[f.key] ?? ""}
          onChange={(e) => onChange(f.key, e.target.value)}
          className={cn(
            "h-8 rounded-[var(--radius-sm)] border border-border bg-surface px-2.5 text-xs text-text-primary",
            "focus:outline-none focus:ring-2 focus:ring-primary transition-colors",
            active[f.key] && "border-primary text-primary",
          )}
          aria-label={f.label}
        >
          <option value="">{f.label}</option>
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ))}
      {activeCount > 0 && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-danger hover:underline"
          aria-label="Clear all filters"
        >
          <X size={12} />
          Clear ({activeCount})
        </button>
      )}
      {activeCount > 0 && (
        <Badge variant="brand" size="sm">{activeCount} active</Badge>
      )}
    </div>
  );
}
