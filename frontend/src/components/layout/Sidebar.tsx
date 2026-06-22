"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Package,
  CalendarCheck,
  CreditCard,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
  X,
  GraduationCap,
  ShoppingBag,
  Sparkles,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: Omit<NavItem, "children">[];
}

const nav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads / CRM", href: "/dashboard/leads", icon: Users },
  {
    label: "Training",
    icon: GraduationCap,
    children: [
      { label: "Batches", href: "/dashboard/training/batches", icon: BookOpen },
      { label: "Students", href: "/dashboard/training/students", icon: Users },
      { label: "Attendance", href: "/dashboard/training/attendance", icon: CalendarCheck },
      { label: "Fees", href: "/dashboard/training/fees", icon: CreditCard },
      { label: "Certificates", href: "/dashboard/training/certificates", icon: Sparkles },
    ],
  },
  {
    label: "Rental",
    icon: ShoppingBag,
    children: [
      { label: "Inventory", href: "/dashboard/rental/inventory", icon: Package },
      { label: "Bookings", href: "/dashboard/rental/bookings", icon: BookOpen },
      { label: "Quotes", href: "/dashboard/rental/quotes", icon: CreditCard },
    ],
  },
  {
    label: "Events",
    icon: CalendarCheck,
    children: [{ label: "All Events", href: "/dashboard/events", icon: CalendarCheck }],
  },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Reports", href: "/dashboard/reports/revenue", icon: BarChart2 },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Users", href: "/dashboard/users", icon: Users },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Organisation", href: "/dashboard/settings/organisation", icon: Settings },
      { label: "Branches", href: "/dashboard/settings/branches", icon: Settings },
      { label: "Branding", href: "/dashboard/settings/branding", icon: Settings },
      { label: "Modules", href: "/dashboard/settings/modules", icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onClose?: () => void; // mobile drawer close
}

function NavItemRow({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(
    () => item.children?.some((c) => c.href && pathname.startsWith(c.href)) ?? false
  );

  const isActive = item.href
    ? pathname === item.href || pathname.startsWith(item.href + "/")
    : false;
  const Icon = item.icon;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "text-text-secondary hover:bg-surface-overlay hover:text-text-primary flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-2.5 py-2 text-sm font-medium transition-colors",
            open && "text-text-primary"
          )}
          aria-expanded={open}
        >
          <Icon size={18} className="shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
            </>
          )}
        </button>
        {open && !collapsed && (
          <div className="border-border mt-0.5 ml-4 space-y-0.5 border-l pl-3">
            {item.children.map((child) => (
              <NavItemRow key={child.href} item={child} collapsed={false} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-sm)] px-2.5 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-brand-100 text-brand-700"
          : "text-text-secondary hover:bg-surface-overlay hover:text-text-primary",
        collapsed && "justify-center"
      )}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export function Sidebar({ collapsed, onClose }: SidebarProps) {
  return (
    <aside
      className={cn(
        "border-border bg-surface flex h-full flex-col border-r transition-[width] duration-[var(--duration-drawer)]",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "border-border flex h-[60px] shrink-0 items-center border-b px-3",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <span className="text-brand-600 truncate text-base font-bold">KalaiArangam</span>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="hover:bg-surface-overlay text-text-secondary rounded p-1"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
        {collapsed && <span className="text-brand-600 text-base font-bold">KY</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3" aria-label="Main navigation">
        {nav.map((item) => (
          <NavItemRow key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className={cn("border-border space-y-0.5 border-t px-2 py-3")}>
        <button
          className={cn(
            "text-danger hover:bg-danger-light flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-2.5 py-2 text-sm font-medium transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
