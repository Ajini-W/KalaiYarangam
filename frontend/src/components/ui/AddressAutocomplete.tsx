"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/cn";

export interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

export interface AddressResult {
  formatted: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (result: AddressResult) => void;
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  label,
  error,
  required,
  placeholder = "Search address...",
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = React.useState<AddressSuggestion[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchSuggestions = React.useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
        { headers: { "Accept-Language": "en" } },
      );
      if (!res.ok) return;
      const data: AddressSuggestion[] = await res.json();
      setSuggestions(data);
      setOpen(data.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 400);
  };

  const handleSelect = (suggestion: AddressSuggestion) => {
    const addr = suggestion.address || {};
    const city = addr.city || addr.town || addr.village || "";
    const state = addr.state || "";
    const pincode = addr.postcode || "";

    onChange(suggestion.display_name);
    onAddressSelect({
      formatted: suggestion.display_name,
      city,
      state,
      pincode,
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
    });

    setSuggestions([]);
    setOpen(false);
  };

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const inputId = label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-text-secondary">
          {loading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-text-secondary border-t-transparent" />
          ) : (
            <MapPin size={15} />
          )}
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "w-full h-9 rounded-[var(--radius-sm)] border border-border bg-surface px-3 pl-9 text-sm text-text-primary placeholder:text-text-placeholder",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            error && "border-danger focus:ring-danger",
          )}
        />
      </div>
      {open && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-[var(--radius-sm)] border border-border bg-surface shadow-lg">
          {suggestions.map((s, i) => (
            <li
              key={i}
              role="option"
              aria-selected={false}
              tabIndex={-1}
              onClick={() => handleSelect(s)}
              className="cursor-pointer px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay transition-colors border-b border-border last:border-b-0"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
