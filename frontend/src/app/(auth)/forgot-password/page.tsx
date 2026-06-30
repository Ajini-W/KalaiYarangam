"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft, CheckCircle, KeyRound, ChevronLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/auth.store";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [serverError, setServerError] = useState("");
  const forgotPassword = useAuthStore((s) => s.forgotPassword);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      await forgotPassword({ email: data.email });
      setSubmittedEmail(data.email);
      setSent(true);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to send reset link";
      if (msg.toLowerCase().includes("not found")) {
        setError("email", { message: "No account found with this email address" });
      } else {
        setServerError(msg);
      }
    }
  };

  return (
    <div className="w-full max-w-[440px] mx-auto px-4 py-6 sm:px-0 sm:py-0 lg:my-auto">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl sm:shadow-gray-900/10 dark:sm:shadow-black/40 sm:border sm:border-gray-200/60 dark:sm:border-gray-700/40 transition-colors duration-500">
        {/* Header row: back + theme toggle */}
        <div className="flex items-center justify-between px-5 pt-4 sm:px-6 sm:pt-5">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} />
            Back to login
          </Link>
          <ThemeToggle />
        </div>

        {/* Content */}
        <div className="px-5 py-6 sm:px-10 sm:py-8 lg:px-10 lg:py-10 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sent ? (
              <motion.div variants={itemVariants} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-5">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300 uppercase tracking-[0.05em] mb-2">
                  Check Your Email
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 font-medium mb-1">
                  We sent a password reset link to
                </p>
                <p className="text-sm font-semibold text-primary mb-5">
                  {submittedEmail}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 leading-relaxed">
                  The link expires in 1 hour. If you don&apos;t see it, check your spam folder.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full h-11 text-sm font-bold uppercase tracking-wider rounded-xl group"
                  >
                    Back to Login
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    onClick={() => setSent(false)}
                    variant="outline"
                    className="w-full h-11 text-sm font-semibold rounded-xl"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Send Again
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
                <motion.div variants={itemVariants} className="text-center mb-7 sm:mb-8">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <KeyRound className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-primary uppercase tracking-[0.06em] transition-colors duration-500">
                    Forgot Password?
                  </h1>
                  <p className="text-[0.82rem] sm:text-sm text-gray-400 dark:text-gray-500 mt-2 font-medium transition-colors duration-500 leading-relaxed">
                    No worries, we&apos;ll send you reset instructions
                  </p>
                </motion.div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  {serverError && (
                    <motion.div variants={itemVariants}>
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-700 dark:text-red-400 text-center font-medium">{serverError}</p>
                      </div>
                    </motion.div>
                  )}
                  <motion.div variants={itemVariants}>
                    <Input
                      label="Email Address"
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
                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      className="w-full h-11 text-sm font-bold uppercase tracking-wider rounded-xl group"
                      loading={isSubmitting}
                    >
                      Send Reset Link
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
