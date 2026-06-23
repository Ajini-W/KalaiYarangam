"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
  X,
  GraduationCap,
  Sparkles,
  BarChart2,
  Shield,
  ShieldAlert,
  KeyRound,
  Building2,
  IdCard,
  Fingerprint,
  History,
  ScrollText,
  Activity,
  AlertTriangle,
  ClipboardCheck,
  ClipboardList,
  Calendar,
  TrendingUp,
  Award,
  HelpCircle,
  FileText,
  CalendarDays,
  ShoppingBag,

} from "lucide-react";
import { cn } from "@/lib/cn";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: Omit<NavItem, "children">[];
}

const superAdminNav: NavItem[] = [
  { label: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
  {
    label: "Administration",
    icon: Shield,
    children: [
      { label: "Users", href: "/super-admin/users", icon: Users },
      { label: "Roles", href: "/super-admin/roles", icon: KeyRound },
      { label: "Permissions", href: "/super-admin/permissions", icon: Shield },
    ],
  },
  { label: "Tenants", href: "/super-admin/tenants", icon: Building2 },
  {
    label: "Security",
    icon: ShieldAlert,
    children: [
      { label: "Sessions", href: "/super-admin/sessions", icon: Fingerprint },
      { label: "Login History", href: "/super-admin/login-history", icon: History },
      { label: "Audit Logs", href: "/super-admin/audit-logs", icon: ScrollText },
      { label: "Activity Logs", href: "/super-admin/activity-logs", icon: Activity },
      { label: "Security Events", href: "/super-admin/security-events", icon: AlertTriangle },
    ],
  },
  { label: "Notifications", href: "/super-admin/notifications", icon: Bell },
  { label: "Settings", href: "/super-admin/platform-config", icon: Settings },
];

const ownerNav: NavItem[] = [
  { label: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/owner/analytics", icon: BarChart2 },
  { label: "Users", href: "/owner/users", icon: Users },
  { label: "Reports", href: "/owner/reports", icon: BarChart2 },
  { label: "Organisation", href: "/owner/organisation", icon: Building2 },
  { label: "Integrations", href: "/owner/integrations", icon: Sparkles },
  { label: "Subscription", href: "/owner/subscription", icon: CreditCard },
  { label: "Audit Logs", href: "/owner/audit-logs", icon: ScrollText },
];

const branchManagerNav: NavItem[] = [
  { label: "Dashboard", href: "/branch-manager/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/branch-manager/leads", icon: Users },
  { label: "Operations", href: "/branch-manager/operations", icon: ClipboardCheck },
  { label: "Reports", href: "/branch-manager/reports", icon: BarChart2 },
  { label: "Users", href: "/branch-manager/users", icon: Users },
  { label: "Notifications", href: "/branch-manager/notifications", icon: Bell },
];

const staffNav: NavItem[] = [
  { label: "Dashboard", href: "/staff/dashboard", icon: LayoutDashboard },
  { label: "Assigned Classes", href: "/staff/assigned-classes", icon: BookOpen },
  { label: "Assigned Events", href: "/staff/assigned-events", icon: CalendarDays },
  { label: "Assigned Rentals", href: "/staff/assigned-rentals", icon: ShoppingBag },
  { label: "Attendance", href: "/staff/attendance", icon: ClipboardCheck },
  { label: "Calendar", href: "/staff/calendar", icon: Calendar },
  { label: "Tasks", href: "/staff/tasks", icon: ClipboardList },
  { label: "Student Progress", href: "/staff/student-progress", icon: TrendingUp },
  { label: "Notifications", href: "/staff/notifications", icon: Bell },
];

const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Courses", href: "/student/my-courses", icon: BookOpen },
  { label: "Attendance", href: "/student/attendance", icon: CalendarCheck },
  { label: "Fees", href: "/student/fees", icon: CreditCard },
  { label: "Progress", href: "/student/progress", icon: TrendingUp },
  { label: "Certificates", href: "/student/certificates", icon: Award },
  { label: "Notifications", href: "/student/notifications", icon: Bell },
  { label: "Profile", href: "/student/profile", icon: IdCard },
  { label: "Support", href: "/student/support", icon: HelpCircle },
];

const clientNav: NavItem[] = [
  { label: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
  { label: "Bookings", href: "/client/bookings", icon: Calendar },
  { label: "Contracts", href: "/client/contracts", icon: FileText },
  { label: "Documents", href: "/client/documents", icon: FileText },
  { label: "Events", href: "/client/events", icon: CalendarDays },
  { label: "Invoices", href: "/client/invoices", icon: FileText },
  { label: "Payments", href: "/client/payments", icon: CreditCard },
  { label: "Quotations", href: "/client/quotations", icon: FileText },
  { label: "Notifications", href: "/client/notifications", icon: Bell },
  { label: "Profile", href: "/client/profile", icon: IdCard },
];

function getNav(role: string): NavItem[] {
  switch (role) {
    case "OWNER": return ownerNav;
    case "BRANCH_MANAGER": return branchManagerNav;
    case "TRAINER":
    case "STAFF": return staffNav;
    case "STUDENT": return studentNav;
    case "CLIENT": return clientNav;
    default: return ownerNav;
  }
}

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
          ? "bg-primary text-primary-foreground"
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
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

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
          <span className="text-primary truncate text-base font-bold">KalaiArangam</span>
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
        {collapsed && <span className="text-primary text-base font-bold">KY</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3" aria-label="Main navigation">
        {(user?.role === "SUPER_ADMIN" ? superAdminNav : getNav(user?.role ?? "")).map((item) => (
          <NavItemRow key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-border space-y-0.5 border-t px-2 py-3">
        {!collapsed && user && (
          <div className="border-border mb-1 border-b px-2.5 py-2">
            <p className="text-text-primary truncate text-sm font-medium">{user.name}</p>
            <p className="text-text-secondary truncate text-xs">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleSignOut}
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
