"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone } from "lucide-react";
import { AuthLeftPanel, AuthMobileNav } from "@/components/ui/AuthBackground";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/auth.store";

/* ── Validation ────────────────────────────────────────────────────── */
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

/* ── Component ─────────────────────────────────────────────────────── */
export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const registerUser = useAuthStore((s) => s.register);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const passwordValue = watch("password");

  const passwordStrength = useMemo(() => {
    const val = passwordValue || "";
    let score = 0;
    if (val.length >= 8) score++;
    if (val.length >= 12) score++;
    if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[^a-zA-Z0-9]/.test(val)) score++;
    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"];
    const textColors = ["", "text-red-600 dark:text-red-400", "text-orange-600 dark:text-orange-400", "text-yellow-600 dark:text-yellow-400", "text-green-600 dark:text-green-400", "text-emerald-600 dark:text-emerald-400"];
    return { score, label: labels[score] || "", color: colors[score] || "", textColor: textColors[score] || "" };
  }, [passwordValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      toast.success("Account created! Check your email to verify.");
      router.push("/verify-email");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/auth/google`;
  };

  return (
    <div className="w-full max-w-[1020px] min-h-dvh sm:min-h-0 lg:min-h-[640px] grid grid-cols-1 lg:grid-cols-[38%_62%] lg:rounded-3xl overflow-hidden lg:shadow-2xl lg:shadow-gray-900/10 dark:lg:shadow-black/40 lg:border lg:border-gray-200/60 dark:lg:border-gray-700/40 bg-white dark:bg-gray-900 transition-colors duration-500">
      {/* ── Left Panel (desktop) ───────────────────────────────── */}
      <AuthLeftPanel />

      {/* ── Right Panel ────────────────────────────────────────── */}
      <div className="flex flex-col bg-white dark:bg-gray-900 lg:rounded-r-3xl lg:rounded-l-none transition-colors duration-500">
        {/* Mobile header + tabs */}
        <AuthMobileNav />

        {/* Form area */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-10 bg-white dark:bg-gray-900 transition-colors duration-500 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {/* Theme toggle — top right (desktop only, mobile has it in AuthMobileNav) */}
          <div className="hidden lg:block absolute top-5 right-5 z-20">
            <ThemeToggle />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[420px]"
          >
            {/* Heading */}
            <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-7">
              <h1 className="text-2xl sm:text-[1.65rem] font-bold text-primary uppercase tracking-[0.06em] transition-colors duration-500">
                Create Account
              </h1>
              <p className="text-[0.82rem] sm:text-sm text-gray-400 dark:text-gray-500 mt-2 font-medium transition-colors duration-500">
                Fill in your details to get started
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 sm:space-y-4" noValidate>
              {/* Name */}
              <motion.div variants={itemVariants}>
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Abishek Kumar"
                  required
                  error={errors.name?.message}
                  leftAddon={<User size={16} />}
                  aria-label="Full name"
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500 h-11 rounded-xl"
                  {...register("name")}
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  error={errors.email?.message}
                  leftAddon={<Mail size={16} />}
                  aria-label="Email address"
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500 h-11 rounded-xl"
                  {...register("email")}
                />
              </motion.div>

              {/* Phone */}
              <motion.div variants={itemVariants}>
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  error={errors.phone?.message}
                  leftAddon={<Phone size={16} />}
                  aria-label="Phone number"
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500 h-11 rounded-xl"
                  {...register("phone")}
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  required
                  error={errors.password?.message}
                  leftAddon={<Lock size={16} />}
                  rightAddon={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-gray-400 hover:text-primary transition-colors focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  aria-label="Password"
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500 h-11 rounded-xl"
                  {...register("password")}
                />

                {passwordValue && (
                  <div className="mt-2.5 space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                            i <= passwordStrength.score
                              ? passwordStrength.color
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium transition-colors duration-300 ${passwordStrength.textColor}`}>
                      {passwordStrength.label}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Submit */}
              <motion.div variants={itemVariants} className="pt-1">
                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-bold uppercase tracking-wider rounded-xl group"
                  loading={isSubmitting}
                >
                  Create Account
                  {!isSubmitting && (
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative my-5 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700/70 transition-colors duration-500" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-gray-900 px-4 text-gray-400 dark:text-gray-500 font-medium transition-colors duration-500">
                  or continue with
                </span>
              </div>
            </motion.div>

            {/* Social buttons */}
            <motion.div variants={itemVariants} className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="flex items-center justify-center gap-3 w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-all duration-200 hover:shadow-md dark:hover:shadow-black/20 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Sign up with Google"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </motion.div>

            {/* Login link (mobile only) */}
            <motion.div
              variants={itemVariants}
              className="mt-6 sm:mt-7 text-center lg:hidden"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-primary hover:opacity-70 hover:underline transition-all"
                >
                  Sign In
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
