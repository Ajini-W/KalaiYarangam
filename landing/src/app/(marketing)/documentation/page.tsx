import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Documentation" };

const docs = [
  { href: "/documentation/api", title: "API Reference", desc: "Full REST API documentation with examples." },
  { href: "/documentation/guides", title: "Integration Guides", desc: "Connect Kalai Arangam with your existing tools." },
  { href: "/documentation/release-notes", title: "Release Notes", desc: "What's new in every version." },
];

export default function DocumentationPage() {
  return (
    <section className="bg-black min-h-screen pt-32 pb-20 px-4">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">Documentation</p>
        <h1 className="text-4xl font-bold text-white mb-12">Developer Docs</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          {docs.map((d) => (
            <Link key={d.href} href={d.href} className="group rounded-xl border border-white/[0.06] bg-zinc-950 p-6 hover:border-brand/30 transition-all">
              <h2 className="font-semibold text-white group-hover:text-brand transition-colors mb-2">{d.title}</h2>
              <p className="text-sm text-zinc-500">{d.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
