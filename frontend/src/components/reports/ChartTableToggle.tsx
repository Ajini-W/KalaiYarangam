"use client";

import { BarChart3, Table2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ReportViewMode } from "@/types/reports";

interface ChartTableToggleProps {
  mode: ReportViewMode;
  onChange: (mode: ReportViewMode) => void;
  className?: string;
}

export function ChartTableToggle({ mode, onChange, className }: ChartTableToggleProps) {
  return (
    <div className={cn("inline-flex rounded-[var(--radius-sm)] border border-border p-0.5", className)}>
      {(["chart", "table"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-[var(--radius-xs)] px-3 py-1.5 text-sm font-medium transition-colors",
            mode === m
              ? "bg-primary text-primary-foreground"
              : "text-text-secondary hover:text-text-primary",
          )}
          aria-pressed={mode === m}
        >
          {m === "chart" ? <BarChart3 size={14} /> : <Table2 size={14} />}
          {m === "chart" ? "Chart" : "Table"}
        </button>
      ))}
    </div>
  );
}
