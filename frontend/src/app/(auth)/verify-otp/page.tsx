"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, ChevronLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";

/* ── Animations ────────────────────────────────────────────────────── */
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

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = React.useState(false);
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = pasted.split("").concat(Array(6 - pasted.length).fill(""));
    setOtp(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputs.current[focusIdx]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setLoading(true);
    // TODO: verify OTP via API
    console.log("OTP:", code);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Verified!");
    router.push("/reset-password");
    setLoading(false);
  };

  return (
    <div className="w-full max-w-[440px] mx-auto px-4 py-6 sm:px-0 sm:py-0 lg:my-auto">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl sm:shadow-gray-900/10 dark:sm:shadow-black/40 sm:border sm:border-gray-200/60 dark:sm:border-gray-700/40 transition-colors duration-500">
        {/* Header row: back + theme toggle */}
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

        {/* Content */}
        <div className="px-5 py-6 sm:px-10 sm:py-8 lg:px-10 lg:py-10 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center mb-7 sm:mb-8">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary uppercase tracking-[0.06em] transition-colors duration-500">
                Check Your Email
              </h1>
              <p className="text-[0.82rem] sm:text-sm text-gray-400 dark:text-gray-500 mt-2 font-medium transition-colors duration-500 leading-relaxed">
                We sent a 6-digit code. It expires in 10 minutes.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div variants={itemVariants} className="flex justify-center gap-2.5 sm:gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className="h-12 w-11 sm:h-13 sm:w-12 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-center text-lg font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 dark:text-gray-100"
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="mt-6 sm:mt-7">
                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-bold uppercase tracking-wider rounded-xl group"
                  loading={loading}
                >
                  Verify Code
                  {!loading && (
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              variants={itemVariants}
              className="mt-6 sm:mt-7 text-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Didn&apos;t receive it?{" "}
                <button className="font-bold text-primary hover:opacity-70 hover:underline transition-all">
                  Resend
                </button>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
