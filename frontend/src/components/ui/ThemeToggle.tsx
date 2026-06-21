"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

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
      className="relative flex items-center w-[52px] h-[26px] rounded-full p-[3px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 transition-all duration-500"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
          : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        boxShadow: isDark
          ? "inset 0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.25)"
          : "inset 0 1px 3px rgba(0,0,0,0.12), 0 0 0 1px rgba(203,213,225,0.8)",
      }}
    >
      {/* Background glow behind knob */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          background: isDark
            ? "radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.18) 0%, transparent 70%)"
            : "radial-gradient(ellipse at 20% 50%, rgba(251,191,36,0.18) 0%, transparent 70%)",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Rolling knob */}
      <motion.div
        className="relative z-10 flex items-center justify-center w-5 h-5 rounded-full"
        animate={{
          x: isDark ? 26 : 0,
          rotate: isDark ? 180 : 0,
          background: isDark
            ? "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)"
            : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
          boxShadow: isDark
            ? "0 1px 6px rgba(99,102,241,0.6), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "0 1px 6px rgba(245,158,11,0.5), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
        transition={{
          x: { type: "spring", stiffness: 500, damping: 30 },
          rotate: { type: "spring", stiffness: 300, damping: 20 },
          background: { duration: 0.4 },
          boxShadow: { duration: 0.4 },
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.15 }}
            >
              <Moon size={11} className="text-indigo-200" strokeWidth={2.5} />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.15 }}
            >
              <Sun size={11} className="text-white" strokeWidth={2.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
