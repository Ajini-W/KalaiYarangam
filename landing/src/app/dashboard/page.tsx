import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
        <p className="text-zinc-500 mb-8">Your business dashboard is coming soon.</p>
        <Link href="/" className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-black hover:bg-brand/90 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
