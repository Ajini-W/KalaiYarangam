"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IdCard, Lock, Settings, ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/auth.store";
import { getDashboardRoute } from "@/lib/dashboard-route";

const sections = [
  { href: "/dashboard/profile/info", label: "Profile Info", icon: IdCard },
  { href: "/dashboard/profile/security", label: "Password & Security", icon: Lock },
  { href: "/dashboard/profile/preferences", label: "Preferences", icon: Settings },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const dashboardRoute = getDashboardRoute(user?.role ?? "");

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="flex flex-col flex-1 mx-auto w-full max-w-screen-xl px-4 py-6 md:px-6 lg:px-8">
      {/* Header with back button */}
      <div className="mb-6">
        <button
          onClick={() => router.push(dashboardRoute)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-text-primary">My Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your personal information and security preferences.</p>
      </div>

      <div className="flex flex-1 gap-0 lg:gap-6">
        {/* Desktop side panel */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col">
          {/* User card */}
          <div className="mb-4 rounded-[var(--radius-md)] border border-border bg-surface p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text-primary">{user?.name}</p>
                <p className="truncate text-xs text-text-secondary">{user?.email}</p>
                {user?.role && (
                  <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    {user.role.replace(/_/g, " ")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile section navigation */}
          <nav className="space-y-1" aria-label="Profile sections">
            {sections.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-text-secondary hover:bg-surface-overlay hover:text-text-primary"
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="flex-1">{label}</span>
                  <ChevronRight size={14} className={cn("shrink-0 transition-transform", active && "translate-x-0.5")} />
                </Link>
              );
            })}

            {/* Divider + dashboard link */}
            <div className="border-t border-border my-3" />
            <Link
              href={dashboardRoute}
              className="flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={18} className="shrink-0" />
              <span>Dashboard</span>
            </Link>
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="lg:hidden mb-4 flex gap-1 overflow-x-auto rounded-[var(--radius-md)] border border-border bg-surface p-1">
          {sections.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
