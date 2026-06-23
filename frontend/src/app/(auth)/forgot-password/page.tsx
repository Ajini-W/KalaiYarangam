"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { AuthLeftPanel, AuthMobileNav } from "@/components/ui/AuthBackground";
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
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
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
            {sent ? (
              <motion.div variants={itemVariants} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-green-700 dark:text-green-300 uppercase tracking-[0.05em] mb-2">
                  Check Your Email
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-400 font-medium mb-2">
                  We sent a password reset link to
                </p>
                <p className="text-sm font-semibold text-primary mb-6">
                  {submittedEmail}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
                  The link expires in 1 hour. If you don&apos;t see it, check your spam folder.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full h-11 text-sm font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-80 transition-all duration-300 group rounded-xl"
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
                <motion.div variants={itemVariants} className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-primary uppercase tracking-[0.05em] transition-colors duration-500">
                    Forgot Password?
                  </h1>
                  <p className="text-sm text-gray-400 dark:text-gray-400 mt-1.5 font-medium transition-colors duration-500">
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
                      className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500 h-10 rounded-xl"
                      {...register("email")}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      className="w-full h-11 text-sm font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-80 transition-all duration-300 group rounded-xl"
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

            {!sent && (
              <motion.p
                variants={itemVariants}
                className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 lg:hidden"
              >
                Remember password?{" "}
                <Link
                  href="/login"
                  className="font-bold text-primary hover:opacity-70 hover:underline transition-colors"
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
