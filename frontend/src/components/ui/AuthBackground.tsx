"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * Left panel of the auth card.
 * Gradient background with angular material-design layered shapes
 * and Login / Sign Up navigation tabs.
 */
export function AuthLeftPanel() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <div className="relative hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 overflow-hidden rounded-l-3xl select-none">
      {/* ── Layered Angular Geometric Shapes ────────────────────── */}

      {/* Bottom-most layer — large angled sheet */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-20 top-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-white/[0.07] rounded-3xl -rotate-12 origin-center"
      />

      {/* Middle layer — medium sheet */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -left-12 top-[38%] -translate-y-1/2 w-[280px] h-[280px] bg-white/[0.08] rounded-3xl -rotate-6 origin-center"
      />

      {/* Top layer — smaller sheet */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -left-4 top-[44%] -translate-y-1/2 w-[220px] h-[220px] bg-white/[0.10] rounded-2xl rotate-2 origin-center"
      />

      {/* Extra depth: small accent shapes */}
      <motion.div
        animate={{ rotate: [0, 5, 0], y: [0, -4, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 right-6 w-16 h-16 bg-white/[0.06] rounded-xl rotate-12"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-16 left-8 w-10 h-10 bg-white/20 rounded-full"
      />

      {/* ── Navigation Tabs (side-aligned, overlapping into card) ── */}
      <div className="relative z-10 flex flex-col items-end w-full pr-0 gap-2 mt-auto mb-auto">
        <Link
          href="/login"
          className={`
            relative flex items-center justify-center w-40 h-12 rounded-l-2xl text-sm font-bold uppercase tracking-wider transition-all duration-300
            ${isLogin
              ? "bg-white text-brand-700 shadow-xl shadow-brand-900/20 translate-x-[1px]"
              : "bg-white/15 text-white/80 hover:bg-white/25 hover:text-white"
            }
          `}
        >
          Login
          {isLogin && (
            <motion.div
              layoutId="auth-tab-indicator"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-brand-500 rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </Link>

        <Link
          href="/register"
          className={`
            relative flex items-center justify-center w-40 h-12 rounded-l-2xl text-sm font-bold uppercase tracking-wider transition-all duration-300
            ${!isLogin
              ? "bg-white text-brand-700 shadow-xl shadow-brand-900/20 translate-x-[1px]"
              : "bg-white/15 text-white/80 hover:bg-white/25 hover:text-white"
            }
          `}
        >
          Sign Up
          {!isLogin && (
            <motion.div
              layoutId="auth-tab-indicator"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-brand-500 rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </Link>
      </div>
    </div>
  );
}

/**
 * Mobile top navigation bar for auth pages.
 */
export function AuthMobileNav() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <div className="lg:hidden w-full">
      {/* Gradient header */}
      <div className="relative bg-gradient-to-r from-brand-500 to-brand-700 rounded-t-3xl px-6 py-8 overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-32 h-32 bg-white/[0.08] rounded-2xl -rotate-12" />
        <div className="absolute -left-2 top-[45%] -translate-y-1/2 w-24 h-24 bg-white/[0.10] rounded-xl rotate-3" />
        <div className="absolute right-4 top-4 w-10 h-10 bg-white/[0.06] rounded-lg rotate-12" />

        {/* Theme toggle — top right of mobile header */}
        <div className="absolute top-3 right-3 z-20">
          <ThemeToggle />
        </div>

        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-black text-white tracking-tight">KalaiArangam</h2>
          <p className="text-white/60 text-xs mt-1 font-medium">Manage your business from one place</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-gray-100 dark:bg-gray-800 mx-6 -mt-5 relative z-10 rounded-xl p-1 shadow-sm transition-colors duration-500">
        <Link
          href="/login"
          className={`
            flex-1 text-center py-2.5 text-sm font-bold rounded-lg transition-all duration-200
            ${isLogin
              ? "bg-white dark:bg-gray-700 text-brand-700 dark:text-brand-400 shadow-md"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }
          `}
        >
          Login
        </Link>
        <Link
          href="/register"
          className={`
            flex-1 text-center py-2.5 text-sm font-bold rounded-lg transition-all duration-200
            ${!isLogin
              ? "bg-white dark:bg-gray-700 text-brand-700 dark:text-brand-400 shadow-md"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }
          `}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
