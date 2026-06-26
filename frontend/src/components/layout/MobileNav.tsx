"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Bell,
  MoreHorizontal,
  Calendar,
  FileText,
  CreditCard,
  IdCard,
  ClipboardCheck,
  BookMarked,
  Target,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/auth.store";

interface MobileTab {
  label: string;
  href: string;
  icon: React.ElementType;
}

const roleTabs: Record<string, MobileTab[]> = {
  OWNER: [
    { label: "Home", href: "/owner/dashboard", icon: LayoutDashboard },
    { label: "Leads", href: "/owner/leads", icon: Target },
    { label: "Students", href: "/owner/students", icon: Users },
    { label: "Alerts", href: "/owner/notifications", icon: Bell },
    { label: "More", href: "/owner/reports", icon: MoreHorizontal },
  ],
  BRANCH_MANAGER: [
    { label: "Home", href: "/branch-manager/dashboard", icon: LayoutDashboard },
    { label: "Leads", href: "/branch-manager/leads", icon: Target },
    { label: "Students", href: "/branch-manager/students", icon: Users },
    { label: "Alerts", href: "/branch-manager/notifications", icon: Bell },
    { label: "More", href: "/branch-manager/reports", icon: MoreHorizontal },
  ],
  STAFF: [
    { label: "Home", href: "/staff/dashboard", icon: LayoutDashboard },
    { label: "Leads", href: "/staff/leads", icon: Target },
    { label: "Students", href: "/staff/students", icon: Users },
    { label: "Alerts", href: "/staff/notifications", icon: Bell },
    { label: "More", href: "/staff/reports", icon: MoreHorizontal },
  ],
  TRAINER: [
    { label: "Home", href: "/staff/dashboard", icon: LayoutDashboard },
    { label: "Leads", href: "/staff/leads", icon: Target },
    { label: "Students", href: "/staff/students", icon: Users },
    { label: "Alerts", href: "/staff/notifications", icon: Bell },
    { label: "More", href: "/staff/reports", icon: MoreHorizontal },
  ],
  STUDENT: [
    { label: "Home", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Courses", href: "/student/my-courses", icon: BookMarked },
    { label: "Payments", href: "/student/fees", icon: CreditCard },
    { label: "Alerts", href: "/student/notifications", icon: Bell },
    { label: "Profile", href: "/student/profile", icon: IdCard },
  ],
  CLIENT: [
    { label: "Home", href: "/client/dashboard", icon: LayoutDashboard },
    { label: "Bookings", href: "/client/bookings", icon: Calendar },
    { label: "Invoices", href: "/client/invoices", icon: FileText },
    { label: "Alerts", href: "/client/notifications", icon: Bell },
    { label: "Profile", href: "/client/profile", icon: IdCard },
  ],
};

export function MobileNav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const tabs = roleTabs[user?.role ?? ""] ?? roleTabs.CLIENT;

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
