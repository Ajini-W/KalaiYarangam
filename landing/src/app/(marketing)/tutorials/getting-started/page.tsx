import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Tutorial" };
export default function Page() {
  return (
    <section className="bg-black min-h-screen pt-32 pb-20 px-4">
      <div className="mx-auto max-w-3xl">
        <Link href="/tutorials" className="text-xs text-zinc-500 hover:text-brand mb-6 inline-block">← Back to Tutorials</Link>
        <h1 className="text-3xl font-bold text-white mb-4">getting started</h1>
        <p className="text-zinc-400">Tutorial content coming soon.</p>
      </div>
    </section>
  );
}
