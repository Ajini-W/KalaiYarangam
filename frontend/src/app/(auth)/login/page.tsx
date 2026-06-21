"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState } from "react";
import { AtSign, Lock, Eye, EyeOff, ArrowRight, User, Sparkles } from "lucide-react";
import { AuthLeftPanel, AuthMobileNav } from "@/components/ui/AuthBackground";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/* ── Validation ────────────────────────────────────────────────────── */
const schema = z.object({
  identifier: z.string().refine(
    (val) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
      /^\+?[\d\s\-()]{7,15}$/.test(val),
    "Enter a valid email or phone number"
  ),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

/* ── Social Icons ──────────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09A6.97 6.97 0 0 1 5.49 12c0-.72.13-1.43.35-2.09V7.07H2.18A11.01 11.01 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

/* ── Page animations ───────────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

/* ── Component ─────────────────────────────────────────────────────── */
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    // TODO: call auth API
    console.log(data);
    toast.success("Logged in successfully!");
  };

  const handleGoogleLogin = () => toast.info("Connecting to Google…");

  return (
    <>
      {/* ── Left Panel (desktop) ───────────────────────────────── */}
      <AuthLeftPanel />

      {/* ── Right Panel ────────────────────────────────────────── */}
      <div className="relative flex flex-col bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl lg:rounded-r-3xl lg:rounded-l-none transition-colors duration-500">
        {/* Theme toggle — top right corner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="absolute top-4 right-4 z-20"
        >
          <ThemeToggle />
        </motion.div>

        {/* Mobile header + tabs */}
        <AuthMobileNav />

        {/* Form area */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 sm:px-12 sm:py-10 bg-gradient-to-b from-white via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/30 transition-colors duration-500">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[380px]"
          >
            {/* User avatar */}
            <motion.div variants={itemVariants} className="flex justify-center mb-5">
              <div className="relative">
                <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/30 ring-4 ring-brand-100 dark:ring-brand-900/50 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 transition-colors duration-500">
                  <User className="w-8 h-8 text-white" strokeWidth={1.8} />
                </div>
                {/* Sparkle accent */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-2xl font-bold text-brand-700 dark:text-brand-400 uppercase tracking-[0.05em] transition-colors duration-500">Login</h1>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1.5 font-medium transition-colors duration-500">Enter your credentials to continue</p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <motion.div variants={itemVariants}>
                <Input
                  label="Email or Phone"
                  type="text"
                  placeholder="you@example.com / +91 98765 43210"
                  required
                  error={errors.identifier?.message}
                  leftAddon={<AtSign size={16} />}
                  aria-label="Email or phone number"
                  className="dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 h-10 rounded-xl"
                  {...register("identifier")}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  error={errors.password?.message}
                  leftAddon={<Lock size={16} />}
                  rightAddon={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  aria-label="Password"
                  className="dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 h-10 rounded-xl"
                  {...register("password")}
                />
              </motion.div>

              {/* Remember me + Forgot password */}
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <Checkbox label="Remember me" className="accent-brand-600" />
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </motion.div>

              {/* Login button */}
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 shadow-lg shadow-brand-500/25 dark:shadow-brand-500/15 hover:shadow-brand-600/35 transition-all duration-300 group rounded-xl"
                  loading={isSubmitting}
                >
                  Login
                  {!isSubmitting && (
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-gray-700/50 transition-colors duration-500" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900 px-4 text-gray-400 dark:text-gray-500 font-medium transition-colors duration-500">
                  Or continue with
                </span>
              </div>
            </motion.div>

            {/* Social buttons */}
            <motion.div variants={itemVariants} className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center gap-3 px-6 h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-all duration-200 hover:shadow-lg dark:hover:shadow-black/20 hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                aria-label="Sign in with Google"
              >
                <GoogleIcon />
                Google
              </button>
            </motion.div>

            {/* Sign-up link (mobile only — desktop uses left panel tabs) */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 lg:hidden transition-colors duration-500"
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline transition-colors"
              >
                Sign Up
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
