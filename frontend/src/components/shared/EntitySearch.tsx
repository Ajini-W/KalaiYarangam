"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { searchEntities, type SearchResultItem, type SearchType } from "@/services/search.service";

export interface EntitySearchProps {
  searchType: SearchType;
  onSelect: (item: SearchResultItem) => void;
  placeholder?: string;
  extraParams?: Record<string, string>;
  className?: string;
  disabled?: boolean;
}

const PLACEHOLDERS: Record<SearchType, string> = {
  students: "Search students…",
  leads: "Search leads…",
  batches: "Search batches…",
  trainers: "Search trainers…",
};

export function EntitySearch({
  searchType,
  onSelect,
  placeholder,
  extraParams,
  className,
  disabled,
}: EntitySearchProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResultItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const runSearch = React.useCallback(
    (value: string) => {
      clearTimeout(timer.current);
      if (value.trim().length < 2) {
        setResults([]);
        return;
      }
      timer.current = setTimeout(async () => {
        setLoading(true);
        try {
          const items = await searchEntities(searchType, value.trim(), extraParams);
          setResults(items);
          setOpen(true);
        } catch {
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [searchType, extraParams],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    runSearch(value);
  };

  const handleSelect = (item: SearchResultItem) => {
    onSelect(item);
    setQuery(item.label);
    setOpen(false);
    setResults([]);
  };

  const clear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-3 text-text-secondary"
          size={16}
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder ?? PLACEHOLDERS[searchType]}
          disabled={disabled}
          aria-autocomplete="list"
          aria-expanded={open}
          className={cn(
            "h-9 w-full rounded-[var(--radius-sm)] border border-border bg-surface pl-9 pr-8 text-sm text-text-primary placeholder:text-text-placeholder",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
        {query && !disabled && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-2.5 text-text-secondary hover:text-text-primary"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-[var(--radius-md)] border border-border bg-surface shadow-[var(--shadow-2)]"
        >
          {loading && (
            <li className="px-3 py-2 text-sm text-text-secondary">Searching…</li>
          )}
          {!loading && results.length === 0 && query.trim().length >= 2 && (
            <li className="px-3 py-2 text-sm text-text-secondary">No results found</li>
          )}
          {!loading &&
            results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  onClick={() => handleSelect(item)}
                  className="flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-surface-overlay"
                >
                  <span className="font-medium text-text-primary">{item.label}</span>
                  {item.subtitle && (
                    <span className="text-xs text-text-secondary">{item.subtitle}</span>
                  )}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
