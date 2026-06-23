"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Mail, ArrowRight, RefreshCw, CheckCircle, XCircle, Clock, Send, ChevronLeft } from "lucide-react";
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
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
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
    <div className="w-full max-w-[440px] mx-auto px-4 py-6 sm:px-0 sm:py-0 lg:my-auto">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl sm:shadow-gray-900/10 dark:sm:shadow-black/40 sm:border sm:border-gray-200/60 dark:sm:border-gray-700/40 transition-colors duration-500">
        {/* Header row: back + theme toggle */}
        {state !== "success" ? (
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
        ) : (
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
            {state === "verifying" && (
              <motion.div variants={itemVariants} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary uppercase tracking-[0.06em] mb-2">
                  Verifying Email
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                  Please wait while we verify your email address...
                </p>
              </motion.div>
            )}

            {state === "success" && (
              <motion.div variants={itemVariants} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-5">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300 uppercase tracking-[0.05em] mb-2">
                  Email Verified!
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 font-medium mb-6 leading-relaxed">
                  Your email has been successfully verified. You can now access all features.
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full h-11 text-sm font-bold uppercase tracking-wider rounded-xl group"
                >
                  Continue to Login
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {state === "error" && (
              <motion.div variants={itemVariants} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-5">
                  {errorMessage.toLowerCase().includes("expired") ? (
                    <Clock className="w-8 h-8 text-red-600 dark:text-red-400" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-300 uppercase tracking-[0.05em] mb-2">
                  Verification Failed
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 font-medium mb-6 leading-relaxed">
                  {errorMessage}
                </p>
                {errorMessage.toLowerCase().includes("already verified") ? (
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full h-11 text-sm font-bold uppercase tracking-wider rounded-xl group"
                  >
                    Go to Login
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <form onSubmit={handleSubmit(onResend)} className="space-y-4 text-left">
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
                      className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500 h-11 rounded-xl"
                      {...register("email")}
                    />
                    <Button
                      type="submit"
                      className="w-full h-11 text-sm font-bold uppercase tracking-wider rounded-xl group"
                      loading={resending}
                    >
                      Resend Verification Email
                      {!resending && (
                        <Send className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      )}
                    </Button>
                  </form>
                )}
              </motion.div>
            )}

            {state === "idle" && (
              <>
                <motion.div variants={itemVariants} className="text-center mb-7 sm:mb-8">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-primary uppercase tracking-[0.06em] mb-2">
                    Verify Your Email
                  </h1>
                  <p className="text-[0.82rem] sm:text-sm text-gray-400 dark:text-gray-500 font-medium leading-relaxed">
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
                      className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500 h-11 rounded-xl"
                      {...register("email")}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      className="w-full h-11 text-sm font-bold uppercase tracking-wider rounded-xl group"
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}
