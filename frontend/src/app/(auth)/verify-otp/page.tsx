"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { toast.error("Enter the 6-digit code"); return; }
    setLoading(true);
    // TODO: verify OTP via API
    console.log("OTP:", code);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Verified!");
    router.push("/reset-password");
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Check your email</h1>
      <p className="mt-1 text-sm text-text-secondary">
        We sent a 6-digit code. It expires in 10 minutes.
      </p>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="flex justify-center gap-2">
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
              className="h-12 w-11 rounded-[var(--radius-md)] border border-border bg-surface text-center text-lg font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        <Button type="submit" className="mt-6 w-full" loading={loading}>
          Verify Code
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Didn&apos;t receive it?{" "}
        <button className="font-medium text-primary hover:underline">Resend</button>
        {" · "}
        <Link href="/login" className="font-medium text-primary hover:underline">Back to login</Link>
      </p>
    </div>
  );
}
