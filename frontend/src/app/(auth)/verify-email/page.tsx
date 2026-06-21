"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Mail, ArrowRight, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import { AuthLeftPanel, AuthMobileNav } from "@/components/ui/AuthBackground";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/auth.store";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type FormData = z.infer<typeof schema>;

type VerifyState = "verifying" | "success" | "error" | "idle";

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

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = useState<VerifyState>(token ? "verifying" : "idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [resending, setResending] = useState(false);

  const user = useAuthStore((s) => s.user);
  const verifyEmail = useAuthStore((s) => s.verifyEmail);
  const sendVerificationToken = useAuthStore((s) => s.sendVerificationToken);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: user?.email || "" },
  });

  const doVerify = useCallback(async () => {
    if (!token) return;
    setState("verifying");
    try {
      await verifyEmail(token);
      setState("success");
    } catch (error) {
      setState("error");
      setErrorMessage(error instanceof Error ? error.message : "Verification failed");
    }
  }, [token, verifyEmail]);

  useEffect(() => {
    doVerify();
  }, [doVerify]);

  const onResend = async (data: FormData) => {
    setResending(true);
    try {
      await sendVerificationToken(data.email);
      toast.success("Verification email sent! Check your inbox.");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to resend verification email";
      if (msg.toLowerCase().includes("not found")) {
        setError("email", { message: "No account found with this email address" });
      } else {
        toast.error(msg);
      }
    } finally {
      setResending(false);
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
            {state === "verifying" && (
              <motion.div variants={itemVariants} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mb-6">
                  <RefreshCw className="w-8 h-8 text-brand-600 dark:text-brand-400 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-brand-700 dark:text-brand-300 uppercase tracking-[0.05em] mb-2">
                  Verifying Email
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-400 font-medium">
                  Please wait while we verify your email address...
                </p>
              </motion.div>
            )}

            {state === "success" && (
              <motion.div variants={itemVariants} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-green-700 dark:text-green-300 uppercase tracking-[0.05em] mb-2">
                  Email Verified!
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-400 font-medium mb-6">
                  Your email has been successfully verified. You can now access all features.
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full h-11 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 shadow-lg shadow-brand-500/25 dark:shadow-brand-500/15 hover:shadow-brand-600/35 transition-all duration-300 group rounded-xl"
                >
                  Continue to Login
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {state === "error" && (
              <motion.div variants={itemVariants} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-6">
                  {errorMessage.toLowerCase().includes("expired") ? (
                    <Clock className="w-8 h-8 text-red-600 dark:text-red-400" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <h1 className="text-2xl font-bold text-red-700 dark:text-red-300 uppercase tracking-[0.05em] mb-2">
                  Verification Failed
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-400 font-medium mb-6">
                  {errorMessage}
                </p>
                {errorMessage.toLowerCase().includes("already verified") ? (
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full h-11 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 shadow-lg shadow-brand-500/25 dark:shadow-brand-500/15 hover:shadow-brand-600/35 transition-all duration-300 group rounded-xl"
                  >
                    Go to Login
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <form onSubmit={handleSubmit(onResend)} className="space-y-4 text-left mt-6">
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-2">
                      Request a new verification email below.
                    </p>
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
                    <Button
                      type="submit"
                      className="w-full h-11 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 shadow-lg shadow-brand-500/25 dark:shadow-brand-500/15 hover:shadow-brand-600/35 transition-all duration-300 group rounded-xl"
                      loading={resending}
                    >
                      Resend Verification Email
                      {!resending && (
                        <RefreshCw className="ml-2 w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                      )}
                    </Button>
                  </form>
                )}
              </motion.div>
            )}

            {state === "idle" && (
              <>
                <motion.div variants={itemVariants} className="text-center mb-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mb-6">
                    <Mail className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-brand-700 dark:text-brand-300 uppercase tracking-[0.05em] mb-2">
                    Verify Your Email
                  </h1>
                  <p className="text-sm text-gray-400 dark:text-gray-400 font-medium">
                    Enter your email to receive a verification link.
                  </p>
                </motion.div>
                <form onSubmit={handleSubmit(onResend)} className="space-y-5">
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
                      className="w-full h-11 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 shadow-lg shadow-brand-500/25 dark:shadow-brand-500/15 hover:shadow-brand-600/35 transition-all duration-300 group rounded-xl"
                      loading={resending}
                    >
                      Send Verification Email
                      {!resending && (
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      )}
                    </Button>
                  </motion.div>
                </form>
              </>
            )}

            {state === "success" && (
              <motion.p
                variants={itemVariants}
                className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 lg:hidden"
              >
                Go to{" "}
                <Link
                  href="/login"
                  className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline transition-colors"
                >
                  Sign In
                </Link>
              </motion.p>
            )}

            {state !== "success" && (
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
