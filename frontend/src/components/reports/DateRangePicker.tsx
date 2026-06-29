"use client";

import * as React from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

export interface DateRangePickerProps {
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
  className?: string;
}

export function DateRangePicker({ from, to, onChange, className }: DateRangePickerProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
      <Input
        label="From"
        type="date"
        value={from}
        onChange={(e) => onChange({ from: e.target.value, to })}
      />
      <Input
        label="To"
        type="date"
        value={to}
        onChange={(e) => onChange({ from, to: e.target.value })}
      />
    </div>
  );
}

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export function useDefaultDateRange() {
  return React.useState(defaultRange);
}
