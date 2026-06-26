"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/auth.store";

const roleLabels: Record<string, string> = {
  OWNER: "Owner",
  BRANCH_MANAGER: "Branch Manager",
  TRAINER: "Staff",
  STAFF: "Staff",
  STUDENT: "Student",
  CLIENT: "Client",
  SUPER_ADMIN: "Super Admin",
};

const roleSegments: Record<string, string> = {
  owner: "OWNER",
  "branch-manager": "BRANCH_MANAGER",
  trainer: "STAFF",
  staff: "STAFF",
  student: "STUDENT",
  client: "CLIENT",
  "super-admin": "SUPER_ADMIN",
};

function toLabel(segment: string) {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface BreadcrumbProps { className?: string }

export function Breadcrumb({ className }: BreadcrumbProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => {
    const isRoleSegment = i === 0 && roleSegments[seg];
    const label = isRoleSegment
      ? (user ? roleLabels[user.role] : toLabel(seg)) + " Dashboard"
      : toLabel(seg);
    return {
      label,
      href: "/" + segments.slice(0, i + 1).join("/"),
      isLast: i === segments.length - 1,
    };
  });

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm", className)}>
      <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors" aria-label="Home">
        <Home size={14} />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight size={12} className="text-text-disabled" aria-hidden />
          {crumb.isLast ? (
            <span className="font-medium text-text-primary" aria-current="page">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-text-secondary hover:text-text-primary transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
