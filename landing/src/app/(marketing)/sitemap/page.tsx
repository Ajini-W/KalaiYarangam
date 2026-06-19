import type { Metadata } from "next";
import Link from "next/link";
import { footerLinks } from "@/config/navigation";

export const metadata: Metadata = { title: "Sitemap" };

export default function SitemapPage() {
  return (
    <section className="bg-black min-h-screen pt-32 pb-20 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-12">Sitemap</h1>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h2 className="text-sm font-semibold text-white mb-4">{group}</h2>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-brand transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
