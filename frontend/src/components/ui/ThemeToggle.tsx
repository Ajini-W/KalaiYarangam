"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

/**
 * A premium animated theme toggle switch for dark/light mode.
 * Uses the `.dark` class on `<html>` (same pattern as Topbar).
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  /* Sync with current state on mount */
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        relative flex items-center w-[56px] h-[28px] rounded-full p-[3px]
        cursor-pointer transition-colors duration-500 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
        border
      "
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
          : "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
        borderColor: isDark ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.2)",
      }}
    >
      {/* Track decoration — tiny stars for dark, sun rays for light */}
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
          >
            <span className="absolute top-[6px] left-[8px] w-[2px] h-[2px] bg-yellow-300/70 rounded-full" />
            <span className="absolute top-[14px] left-[12px] w-[1.5px] h-[1.5px] bg-blue-200/60 rounded-full" />
            <span className="absolute top-[8px] left-[18px] w-[1px] h-[1px] bg-white/50 rounded-full" />
          </motion.div>
        ) : (
          <motion.div
            key="rays"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
          >
            <span className="absolute top-[7px] right-[10px] w-[3px] h-[3px] bg-amber-300/40 rounded-full blur-[1px]" />
            <span className="absolute bottom-[8px] right-[14px] w-[2px] h-[2px] bg-amber-400/30 rounded-full" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Knob */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="
          relative z-10 flex items-center justify-center w-[22px] h-[22px] rounded-full
          shadow-md
        "
        style={{
          marginLeft: isDark ? "auto" : "0",
          background: isDark
            ? "linear-gradient(135deg, #312e81 0%, #4338ca 100%)"
            : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
          boxShadow: isDark
            ? "0 2px 8px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)"
            : "0 2px 8px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon-icon"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Moon size={12} className="text-blue-200" strokeWidth={2.5} />
            </motion.div>
          ) : (
            <motion.div
              key="sun-icon"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Sun size={12} className="text-white" strokeWidth={2.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
