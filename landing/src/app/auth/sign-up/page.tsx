import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo className="justify-center mb-6" />
          <h1 className="text-2xl font-bold text-white">Start your free trial</h1>
          <p className="mt-2 text-sm text-zinc-500">14 days free. No credit card required.</p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">First name</label>
              <input type="text" placeholder="First" className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Last name</label>
              <input type="text" placeholder="Last" className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/30" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
            <input type="email" placeholder="you@company.com" className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
            <input type="password" placeholder="Min. 8 characters" className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/30" />
          </div>
          <button className="w-full rounded-md bg-brand py-3 text-sm font-semibold text-black hover:bg-brand/90 transition-colors">
            Create Account
          </button>
          <p className="text-center text-xs text-zinc-600">
            By signing up you agree to our{" "}
            <Link href="/terms" className="text-zinc-400 hover:text-white underline">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="text-zinc-400 hover:text-white underline">Privacy Policy</Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-brand hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
