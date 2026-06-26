"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogIn, UserPlus } from "lucide-react";

export function AuthLeftPanel() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <div className="relative hidden lg:flex flex-col bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 overflow-hidden rounded-l-3xl select-none">
      {/* Decorative floating shapes */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-24 top-1/4 w-[360px] h-[360px] bg-white/[0.05] rounded-3xl -rotate-12"
      />
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -left-16 top-[42%] w-[280px] h-[280px] bg-white/[0.06] rounded-3xl -rotate-6"
      />
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute left-8 top-[55%] w-[180px] h-[180px] bg-white/[0.08] rounded-2xl rotate-3"
      />
      <motion.div
        animate={{ rotate: [0, 8, 0], y: [0, -5, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 right-10 w-14 h-14 bg-white/[0.05] rounded-xl rotate-12"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 left-12 w-12 h-12 bg-white/15 rounded-full"
      />
      <motion.div
        animate={{ y: [0, 6, 0], x: [0, -3, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-16 w-8 h-8 bg-primary/20 rounded-lg rotate-45"
      />

      {/* Center content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-[260px]"
        >
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
            <span className="text-2xl font-black text-white">K</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight leading-tight">
            Welcome to<br />KalaiArangam
          </h2>
          <p className="text-white/50 text-sm mt-3 font-medium leading-relaxed">
            Your all-in-one platform to manage and grow your business.
          </p>
        </motion.div>
      </div>

      {/* Tab buttons */}
      <div className="relative z-10 flex flex-col items-end w-full gap-2.5 mb-auto mt-auto">
        <Link
          href="/login"
          className={`
            relative flex items-center justify-center gap-2 w-44 h-12 rounded-l-2xl text-sm font-bold uppercase tracking-wider transition-all duration-300
            ${isLogin
              ? "bg-white text-black shadow-xl shadow-black/20 translate-x-[1px]"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white backdrop-blur-sm"
            }
          `}
        >
          {isLogin && (
            <motion.div
              layoutId="auth-tab-indicator"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <LogIn size={16} className={isLogin ? "ml-3" : ""} />
          Login
        </Link>

        <Link
          href="/register"
          className={`
            relative flex items-center justify-center gap-2 w-44 h-12 rounded-l-2xl text-sm font-bold uppercase tracking-wider transition-all duration-300
            ${!isLogin
              ? "bg-white text-black shadow-xl shadow-black/20 translate-x-[1px]"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white backdrop-blur-sm"
            }
          `}
        >
          {!isLogin && (
            <motion.div
              layoutId="auth-tab-indicator"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <UserPlus size={16} className={!isLogin ? "ml-3" : ""} />
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export function AuthMobileNav() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const isRegister = pathname === "/register";
  const showTabs = isLogin || isRegister;

  return (
    <div className="lg:hidden w-full">
      <div className="relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-8 overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-28 h-28 bg-white/[0.06] rounded-2xl -rotate-12" />
        <div className="absolute -left-1 top-[50%] -translate-y-1/2 w-20 h-20 bg-white/[0.08] rounded-xl rotate-3" />
        <div className="absolute right-6 top-5 w-8 h-8 bg-white/[0.05] rounded-lg rotate-12" />
        <div className="absolute right-12 bottom-4 w-6 h-6 bg-primary/15 rounded-md rotate-45" />

        <div className="absolute top-3 right-3 z-20">
          <ThemeToggle />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 shrink-0">
            <span className="text-base font-black text-white">K</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight leading-tight">KalaiArangam</h2>
            <p className="text-white/50 text-xs font-medium">Manage your business from one place</p>
          </div>
        </div>
      </div>

      {showTabs && (
        <div className="flex bg-gray-100 dark:bg-gray-800 mx-4 -mt-4 relative z-10 rounded-xl p-1 shadow-md transition-colors duration-500">
          <Link
            href="/login"
            className={`
              flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200
              ${isLogin
                ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-md"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }
            `}
          >
            <LogIn size={14} />
            Login
          </Link>
          <Link
            href="/register"
            className={`
              flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200
              ${isRegister
                ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-md"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }
            `}
          >
            <UserPlus size={14} />
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
