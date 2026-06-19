import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo className="justify-center mb-6" />
          <h1 className="text-2xl font-bold text-white">Reset your password</h1>
          <p className="mt-2 text-sm text-zinc-500">Enter your email to receive a reset link.</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
            <input type="email" placeholder="you@company.com" className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-brand/50 focus:outline-none" />
          </div>
          <button className="w-full rounded-md bg-brand py-3 text-sm font-semibold text-black hover:bg-brand/90 transition-colors">
            Send Reset Link
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/auth/sign-in" className="text-brand hover:underline">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
