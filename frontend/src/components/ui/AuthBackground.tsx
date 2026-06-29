"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { EyeAnimationScene } from "@/components/ui/AuthEyeAnimation";
import { LogIn, UserPlus } from "lucide-react";
import { useAuthForm } from "@/store/auth-form.context";

export function AuthLeftPanel() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const { passwordLength, isPasswordVisible, isTyping } = useAuthForm();

  return (
    <div className="relative hidden lg:flex flex-col h-full rounded-l-3xl select-none overflow-hidden">
      {/* Deep layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50/80 to-white dark:from-neutral-900 dark:via-[#151B28] dark:to-neutral-800 transition-colors duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/[0.02] to-transparent dark:from-black/20 dark:to-transparent pointer-events-none" />

      {/* Decorative floating shapes — layered depth */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-24 top-1/4 w-[360px] h-[360px] bg-black/[0.02] dark:bg-white/[0.04] rounded-3xl -rotate-12 pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -left-16 top-[42%] w-[280px] h-[280px] bg-black/[0.03] dark:bg-white/[0.05] rounded-3xl -rotate-6 pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute left-8 top-[55%] w-[180px] h-[180px] bg-black/[0.04] dark:bg-white/[0.06] rounded-2xl rotate-3 pointer-events-none"
      />
      <motion.div
        animate={{ rotate: [0, 8, 0], y: [0, -5, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 right-10 w-14 h-14 bg-black/[0.02] dark:bg-white/[0.04] rounded-xl rotate-12 pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 left-12 w-12 h-12 bg-black/10 dark:bg-white/15 rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 6, 0], x: [0, -3, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-16 w-8 h-8 bg-primary/[0.07] dark:bg-primary/15 rounded-lg rotate-45 pointer-events-none"
      />

      {/* Top row: pill nav + theme toggle */}
      <div className="relative z-10 flex items-start justify-between px-5 pt-4 pb-2">
        {/* Pill-shaped tab switch */}
        <div className="relative flex bg-black/[0.06] dark:bg-white/[0.08] rounded-full p-1 backdrop-blur-sm">
          <Link
            href="/login"
            className="relative z-10 flex items-center justify-center gap-1.5 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.08em] transition-colors duration-200"
            style={{ minWidth: 90 }}
          >
            {isLogin && (
              <motion.div
                layoutId="auth-pill-indicator"
                className="absolute inset-0 rounded-full bg-white dark:bg-white shadow-md shadow-black/10 dark:shadow-black/25"
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
            )}
            <span className={`relative z-10 flex items-center gap-1.5 transition-colors duration-200 ${isLogin ? "text-black" : "text-black/50 dark:text-white/50"}`}>
              <LogIn size={13} />
              Login
            </span>
          </Link>
          <Link
            href="/register"
            className="relative z-10 flex items-center justify-center gap-1.5 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.08em] transition-colors duration-200"
            style={{ minWidth: 90 }}
          >
            {!isLogin && (
              <motion.div
                layoutId="auth-pill-indicator"
                className="absolute inset-0 rounded-full bg-white dark:bg-white shadow-md shadow-black/10 dark:shadow-black/25"
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
            )}
            <span className={`relative z-10 flex items-center gap-1.5 transition-colors duration-200 ${!isLogin ? "text-black" : "text-black/50 dark:text-white/50"}`}>
              <UserPlus size={13} />
              Sign Up
            </span>
          </Link>
        </div>

        <ThemeToggle />
      </div>

      {/* Eye animation — flush bottom, contained */}
      <div className="relative z-10 flex-1 flex items-end justify-center min-h-0">
        <EyeAnimationScene
          passwordLength={passwordLength}
          isPasswordVisible={isPasswordVisible}
          isTyping={isTyping}
        />
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
