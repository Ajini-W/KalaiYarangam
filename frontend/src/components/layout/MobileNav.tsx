"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, Bell, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";

const tabs = [
  { label: "Home",    href: "/dashboard",              icon: LayoutDashboard },
  { label: "Leads",   href: "/dashboard/leads",         icon: Users },
  { label: "Batches", href: "/dashboard/training/batches", icon: BookOpen },
  { label: "Alerts",  href: "/dashboard/notifications", icon: Bell },
  { label: "More",    href: "/dashboard/settings/organisation", icon: MoreHorizontal },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-surface md:hidden"
      aria-label="Mobile navigation"
    >
      {tabs.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors",
              active ? "text-primary" : "text-text-secondary",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
