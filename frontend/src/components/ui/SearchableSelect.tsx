"use client";

import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SearchableOption {
  value: string;
  label: string;
  secondary?: string;
}

export interface SearchableSelectProps {
  label?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  options: SearchableOption[];
  value?: string;
  onChange: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
}

export function SearchableSelect({
  label,
  required,
  error,
  placeholder = "Search...",
  options,
  value,
  onChange,
  loading,
  disabled,
  className,
  emptyMessage = "No options available",
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = React.useMemo(
    () =>
      search
        ? options.filter(
            (o) =>
              o.label.toLowerCase().includes(search.toLowerCase()) ||
              (o.secondary ?? "").toLowerCase().includes(search.toLowerCase()),
          )
        : options,
    [options, search],
  );

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); setSearch(""); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  React.useEffect(() => {
    if (selected && !open) {
      setSearch(selected.label);
    }
    if (!selected && !open) {
      setSearch("");
    }
  }, [selected, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (!open) setOpen(true);
    if (value && val !== selected?.label) {
      onChange("");
    }
  };

  const handleFocus = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  const select = (opt: SearchableOption) => {
    onChange(opt.value);
    setSearch(opt.label);
    setOpen(false);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearch("");
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn("relative flex flex-col gap-1", className)}>
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
        </label>
      )}

      <div
        className={cn(
          "relative flex items-center w-full h-9 rounded-[var(--radius-sm)] border bg-surface transition-colors",
          "focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
          error ? "border-danger" : "border-border",
          open && "border-primary ring-2 ring-primary/20",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={handleInputChange}
          onFocus={handleFocus}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "h-full w-full rounded-[var(--radius-sm)] bg-transparent pl-3 pr-9 text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none",
            disabled && "cursor-not-allowed",
          )}
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {loading ? (
            <svg className="animate-spin h-4 w-4 text-text-secondary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : value ? (
            <span onMouseDown={(e) => e.stopPropagation()}>
              <X size={14} className="cursor-pointer text-text-secondary hover:text-text-primary" onClick={clear} />
            </span>
          ) : null}
          <ChevronDown
            size={16}
            className={cn("text-text-secondary transition-transform", open && "rotate-180")}
          />
        </div>
      </div>

      {error && <p role="alert" className="text-xs text-danger">{error}</p>}

      {open && (
        <div className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface shadow-[var(--shadow-1)]">
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="px-3 py-6 text-center text-sm text-text-secondary">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-text-secondary">
                {search ? "No matching results" : emptyMessage}
              </div>
            ) : (
              filtered.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => select(opt)}
                    className={cn(
                      "w-full flex flex-col px-3 py-2 text-left text-sm transition-colors hover:bg-surface-raised",
                      isSelected && "bg-primary/5",
                    )}
                  >
                    <span className={cn("truncate", isSelected ? "font-medium text-primary" : "text-text-primary")}>
                      {opt.label}
                    </span>
                    {opt.secondary && (
                      <span className="truncate text-xs text-text-secondary">{opt.secondary}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
