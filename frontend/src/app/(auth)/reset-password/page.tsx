"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, XCircle, ShieldCheck, ChevronLeft } from "lucide-react";
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
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
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
    <div className="w-full max-w-[440px] mx-auto px-4 py-6 sm:px-0 sm:py-0 lg:my-auto">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl sm:shadow-gray-900/10 dark:sm:shadow-black/40 sm:border sm:border-gray-200/60 dark:sm:border-gray-700/40 transition-colors duration-500">
        {/* Header row: back + theme toggle */}
        {!success && !isNoToken && (
          <div className="flex items-center justify-between px-5 pt-4 sm:px-6 sm:pt-5">
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-primary transition-colors"
            >
              <ChevronLeft size={16} />
              Back
            </Link>
            <ThemeToggle />
          </div>
        )}
        {(!success && isNoToken) && (
          <div className="flex justify-end px-5 pt-4 sm:px-6 sm:pt-5">
            <ThemeToggle />
          </div>
        )}

        {/* Content */}
        <div className="px-5 py-6 sm:px-10 sm:py-8 lg:px-10 lg:py-10 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {success ? (
              <motion.div variants={itemVariants} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-5">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300 uppercase tracking-[0.05em] mb-2">
                  Password Updated!
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 font-medium mb-6">
                  Your password has been reset successfully.
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full h-11 text-sm font-bold uppercase tracking-wider rounded-xl group"
                >
                  Back to Login
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            ) : isNoToken ? (
              <motion.div variants={itemVariants} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-5">
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-300 uppercase tracking-[0.05em] mb-2">
                  Invalid Link
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 font-medium mb-6">
                  This reset link is invalid or missing. Please request a new one.
                </p>
                <Button
                  onClick={() => router.push("/forgot-password")}
                  className="w-full h-11 text-sm font-bold uppercase tracking-wider rounded-xl"
                >
                  Request New Link
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div variants={itemVariants} className="text-center mb-7 sm:mb-8">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-primary uppercase tracking-[0.06em] transition-colors duration-500">
                    Reset Password
                  </h1>
                  <p className="text-[0.82rem] sm:text-sm text-gray-400 dark:text-gray-500 mt-2 font-medium transition-colors duration-500">
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5" noValidate>
                  <motion.div variants={itemVariants}>
                    <Input
                      label="New Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
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
                      aria-label="New password"
                      className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500 h-11 rounded-xl"
                      {...register("password")}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Input
                      label="Confirm Password"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter new password"
                      required
                      error={errors.confirm?.message}
                      leftAddon={<Lock size={16} />}
                      rightAddon={
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="text-gray-400 hover:text-primary transition-colors focus:outline-none"
                          aria-label={showConfirm ? "Hide password" : "Show password"}
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                      aria-label="Confirm password"
                      className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500 h-11 rounded-xl"
                      {...register("confirm")}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants} className="pt-1">
                    <Button
                      type="submit"
                      className="w-full h-11 text-sm font-bold uppercase tracking-wider rounded-xl group"
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}
