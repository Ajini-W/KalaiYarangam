"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Grid3X3, BarChart3 } from "lucide-react";
import { cn } from "@/lib/cn";

interface AttendanceNavProps {
  basePath: string;
  showMark?: boolean;
}

export function AttendanceNav({ basePath, showMark = true }: AttendanceNavProps) {
  const pathname = usePathname();

  const items = [
    { href: basePath, label: "List", icon: ClipboardList, exact: true },
    ...(showMark
      ? [{ href: `${basePath}/mark`, label: "Mark Attendance", icon: Grid3X3, exact: false }]
      : []),
    { href: `${basePath}/summary`, label: "Summary", icon: BarChart3, exact: false },
  ];

  return (
    <nav
      aria-label="Attendance navigation"
      className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4"
    >
      {items.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-text-secondary hover:bg-surface-overlay hover:text-text-primary",
            )}
          >
            <Icon size={16} aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
