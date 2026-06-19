import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo className="justify-center mb-6" />
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-zinc-500">Sign in to your account</p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/30"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-400">Password</label>
              <Link href="/auth/forgot-password" className="text-xs text-brand hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/30"
            />
          </div>
          <button className="w-full rounded-md bg-brand py-3 text-sm font-semibold text-black hover:bg-brand/90 transition-colors">
            Sign In
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="text-brand hover:underline font-medium">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
