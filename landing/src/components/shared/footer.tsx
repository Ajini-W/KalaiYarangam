import Link from "next/link";
import { Logo } from "./logo";
import { footerLinks } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black">
      {/* CTA strip */}
      <div className="border-b border-white/[0.06] py-16 text-center px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">
          Start Today
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Make Your Business a Revenue Machine
        </h2>
        <div className="flex items-center justify-center gap-3">
          <Logo />
        </div>
        <p className="mt-4 text-zinc-400 text-sm">
          We design and build platforms that drive results
        </p>
        <Link
          href="/auth/sign-up"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-black hover:bg-brand/90 transition-colors"
        >
          Get started
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-4 text-sm font-semibold text-white">{group}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-8 text-center">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} {siteConfig.name} — All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
