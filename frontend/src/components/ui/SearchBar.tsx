"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search…", debounceMs = 300, className }: SearchBarProps) {
  const [local, setLocal] = React.useState(value);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocal(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(v), debounceMs);
  };

  const clear = () => { setLocal(""); onChange(""); };

  React.useEffect(() => { setLocal(value); }, [value]);

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search className="pointer-events-none absolute left-3 text-text-secondary" size={16} aria-hidden />
      <input
        type="search"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "h-9 w-full rounded-[var(--radius-sm)] border border-border bg-surface pl-9 pr-8 text-sm text-text-primary placeholder:text-text-placeholder",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors",
        )}
      />
      {local && (
        <button onClick={clear} className="absolute right-2.5 text-text-secondary hover:text-text-primary" aria-label="Clear search">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
