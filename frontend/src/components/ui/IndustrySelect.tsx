"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface IndustryOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface IndustrySelectProps {
  label?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  options: IndustryOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function IndustrySelect({
  label,
  required,
  error,
  placeholder = "Select industry",
  options,
  value,
  onChange,
  className,
}: IndustrySelectProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  /* Close on outside click */
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Close on Escape */
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div ref={containerRef} className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "relative flex items-center justify-between w-full h-10 px-3 rounded-xl text-sm",
          "border transition-all duration-200 cursor-pointer",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          open
            ? "border-brand-500 ring-2 ring-brand-500/20 bg-white dark:bg-gray-800"
            : error
              ? "border-danger bg-white dark:bg-gray-800"
              : "border-border dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-brand-400 dark:hover:border-brand-500",
        )}
      >
        {selected ? (
          <span className="flex items-center gap-2 text-text-primary dark:text-gray-100">
            <span className="text-brand-600 dark:text-brand-400">{selected.icon}</span>
            <span className="font-medium">{selected.label}</span>
          </span>
        ) : (
          <span className="text-text-placeholder dark:text-gray-500">{placeholder}</span>
        )}

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-text-secondary dark:text-gray-400" />
        </motion.div>
      </button>

      {/* Error */}
      {error && <p role="alert" className="text-xs text-danger">{error}</p>}

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cn(
              "absolute z-50 mt-1 w-full rounded-xl border shadow-xl overflow-hidden",
              "bg-white dark:bg-gray-800",
              "border-gray-200 dark:border-gray-700",
              "shadow-gray-200/80 dark:shadow-black/40",
            )}
            style={{ top: "100%", left: 0 }}
            role="listbox"
          >
            {/* Header accent */}
            <div className="h-[3px] bg-gradient-to-r from-brand-500 to-brand-700" />

            <div className="p-1.5">
              {options.map((option, idx) => {
                const isSelected = option.value === value;
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.15 }}
                    onClick={() => {
                      onChange?.(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left",
                      "transition-all duration-150 cursor-pointer",
                      isSelected
                        ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300"
                        : "text-text-primary dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/60",
                    )}
                  >
                    {/* Icon bubble */}
                    <span
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors",
                        isSelected
                          ? "bg-brand-100 dark:bg-brand-800/50 text-brand-600 dark:text-brand-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
                      )}
                    >
                      {option.icon}
                    </span>

                    {/* Label + description */}
                    <span className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold leading-tight">{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-text-secondary dark:text-gray-400 mt-0.5 leading-tight">
                          {option.description}
                        </span>
                      )}
                    </span>

                    {/* Check mark */}
                    {isSelected && (
                      <Check
                        size={15}
                        className="ml-auto shrink-0 text-brand-600 dark:text-brand-400"
                        strokeWidth={2.5}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
