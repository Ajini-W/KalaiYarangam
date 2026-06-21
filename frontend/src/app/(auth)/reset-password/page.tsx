"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { AuthLeftPanel, AuthMobileNav } from "@/components/ui/AuthBackground";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/auth.store";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });
type FormData = z.infer<typeof schema>;

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

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const resetPassword = useAuthStore((s) => s.resetPassword);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    if (!token) {
      setError("Missing reset token. Please use the link from your email.");
      return;
    }
    try {
      await resetPassword({ token, password: data.password });
      setSuccess(true);
      toast.success("Password updated successfully!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to reset password");
    }
  };

  const isNoToken = !token && !success;

  return (
    <>
      <AuthLeftPanel />
      <div className="flex flex-col bg-white dark:bg-gray-900 rounded-3xl lg:rounded-r-3xl lg:rounded-l-none transition-colors duration-500">
        <AuthMobileNav />
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-8 sm:px-12 sm:py-10 bg-white dark:bg-gray-900 transition-colors duration-500 lg:rounded-br-3xl">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
            <ThemeToggle />
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[380px]"
          >
            {success ? (
              <motion.div variants={itemVariants} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-green-700 dark:text-green-300 uppercase tracking-[0.05em] mb-2">
                  Password Updated!
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-400 font-medium mb-6">
                  Your password has been reset successfully.
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full h-11 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 shadow-lg shadow-brand-500/25 dark:shadow-brand-500/15 hover:shadow-brand-600/35 transition-all duration-300 group rounded-xl"
                >
                  Back to Login
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            ) : isNoToken ? (
              <motion.div variants={itemVariants} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-6">
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-red-700 dark:text-red-300 uppercase tracking-[0.05em] mb-2">
                  Invalid Link
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-400 font-medium mb-6">
                  This reset link is invalid or missing. Please request a new one.
                </p>
                <Button
                  onClick={() => router.push("/forgot-password")}
                  className="w-full h-11 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 shadow-lg shadow-brand-500/25 dark:shadow-brand-500/15 hover:shadow-brand-600/35 transition-all duration-300 rounded-xl"
                >
                  Request New Link
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div variants={itemVariants} className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-brand-700 dark:text-brand-300 uppercase tracking-[0.05em] transition-colors duration-500">
                    Reset Password
                  </h1>
                  <p className="text-sm text-gray-400 dark:text-gray-400 mt-1.5 font-medium transition-colors duration-500">
                    Enter your new password below
                  </p>
                </motion.div>
                {error && (
                  <motion.div variants={itemVariants}>
                    <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-700 dark:text-red-400 text-center font-medium">{error}</p>
                    </div>
                  </motion.div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <motion.div variants={itemVariants}>
                    <Input
                      label="New Password"
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
                      aria-label="New password"
                      className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500 h-10 rounded-xl"
                      {...register("password")}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Input
                      label="Confirm Password"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      error={errors.confirm?.message}
                      leftAddon={<Lock size={16} />}
                      rightAddon={
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors focus:outline-none"
                          aria-label={showConfirm ? "Hide password" : "Show password"}
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                      aria-label="Confirm password"
                      className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500 h-10 rounded-xl"
                      {...register("confirm")}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      className="w-full h-11 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 shadow-lg shadow-brand-500/25 dark:shadow-brand-500/15 hover:shadow-brand-600/35 transition-all duration-300 group rounded-xl"
                      loading={isSubmitting}
                    >
                      Update Password
                      {!isSubmitting && (
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      )}
                    </Button>
                  </motion.div>
                </form>
              </>
            )}

            {!success && (
              <motion.p
                variants={itemVariants}
                className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 lg:hidden"
              >
                Back to{" "}
                <Link
                  href="/login"
                  className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline transition-colors"
                >
                  Sign In
                </Link>
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
