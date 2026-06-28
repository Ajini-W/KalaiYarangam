"use client";

import * as React from "react";
import { Palette } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ColorPickerOption {
  label: string;
  value: string;
}

export interface ColorPickerProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  presets?: ColorPickerOption[];
  className?: string;
  id?: string;
}

const DEFAULT_PRESETS: ColorPickerOption[] = [
  { label: "Indigo", value: "#4F46E5" },
  { label: "Teal", value: "#0D9488" },
  { label: "Rose", value: "#E11D48" },
  { label: "Violet", value: "#7C3AED" },
  { label: "Blue", value: "#2563EB" },
  { label: "Emerald", value: "#059669" },
  { label: "Orange", value: "#EA580C" },
  { label: "Pink", value: "#DB2777" },
];

export function ColorPicker({
  label,
  error,
  hint,
  required,
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  className,
  id,
}: ColorPickerProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const isHex = /^#[0-9A-Fa-f]{6}$/.test(value);
  const textColor = isHex ? getContrastColor(value) : "#FFFFFF";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
        </label>
      )}

      <div className="flex items-center gap-2.5">
        <div className="relative shrink-0">
          <input
            type="color"
            id={`${inputId}-picker`}
            value={isHex ? value : "#4F46E5"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-9 w-9 cursor-pointer opacity-0"
            title="Pick a color"
          />
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-border transition-shadow hover:shadow-sm",
              error && "border-danger",
            )}
            style={{ backgroundColor: isHex ? value : "#4F46E5" }}
          >
            <Palette size={14} className="drop-shadow" style={{ color: textColor }} />
          </div>
        </div>

        <input
          type="text"
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#4F46E5"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            "h-9 flex-1 rounded-[var(--radius-sm)] border border-border bg-surface px-3 text-sm text-text-primary placeholder:text-text-placeholder font-mono",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            error && "border-danger focus:ring-danger",
          )}
        />
      </div>

      {presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {presets.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange(c.value)}
              className={cn(
                "h-5 w-5 rounded-full border-2 transition-all hover:scale-110",
                value === c.value ? "border-foreground scale-110" : "border-transparent",
              )}
              style={{ backgroundColor: c.value }}
              title={c.label}
              aria-label={`${label || "Color"}: ${c.label}`}
            />
          ))}
        </div>
      )}

      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-danger">{error}</p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-text-secondary">{hint}</p>
      )}
    </div>
  );
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#000000" : "#FFFFFF";
}
