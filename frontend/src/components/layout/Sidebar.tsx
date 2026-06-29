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
  Target,
  PhoneCall,
  BookMarked,
  Layers,
  Clock,
  Receipt,
  Wallet,
  UserCheck,
  ArrowLeftRight,
  RefreshCw,
  FileCheck,
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
      label: "Finance",
      icon: CreditCard,
      children: [
        { label: "Fee Plans", href: "/super-admin/fee-plans", icon: Receipt },
        { label: "Invoices", href: "/super-admin/invoices", icon: FileText },
        { label: "Payments", href: "/super-admin/payments", icon: Wallet },
        { label: "Payment History", href: "/super-admin/payment-history", icon: History },
        { label: "Due Tracking", href: "/super-admin/due-tracking", icon: AlertTriangle },
      ],
    },
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
  {
    label: "Leads",
    icon: Target,
    children: [
      { label: "Leads", href: "/owner/leads", icon: Target },
      { label: "Follow-ups", href: "/owner/followups", icon: PhoneCall },
    ],
  },
  {
    label: "Academics",
    icon: BookOpen,
    children: [
      { label: "Programs", href: "/owner/programs", icon: BookMarked },
      { label: "Batches", href: "/owner/batches", icon: Layers },
      { label: "Schedules", href: "/owner/schedules", icon: Calendar },
      { label: "Trainers", href: "/owner/trainers", icon: GraduationCap },
    ],
  },
  {
    label: "Students",
    icon: Users,
    children: [
      { label: "Students", href: "/owner/students", icon: Users },
      { label: "Enrollments", href: "/owner/enrollments", icon: UserCheck },
      { label: "Attendance", href: "/owner/attendance", icon: ClipboardCheck },
      { label: "Progress", href: "/owner/progress", icon: TrendingUp },
      { label: "Certificates", href: "/owner/certificates", icon: Award },
      { label: "Transfers", href: "/owner/transfers", icon: ArrowLeftRight },
      { label: "Waitlists", href: "/owner/waitlists", icon: Clock },
      { label: "Renewals", href: "/owner/renewals", icon: RefreshCw },
    ],
  },
    {
      label: "Finance",
      icon: CreditCard,
      children: [
        { label: "Fee Plans", href: "/owner/fee-plans", icon: Receipt },
        { label: "Invoices", href: "/owner/invoices", icon: FileText },
        { label: "Payments", href: "/owner/payments", icon: Wallet },
        { label: "Payment History", href: "/owner/payment-history", icon: History },
        { label: "Due Tracking", href: "/owner/due-tracking", icon: AlertTriangle },
      ],
    },
  {
    label: "Operations",
    icon: ClipboardCheck,
    children: [
      { label: "Tasks", href: "/owner/tasks", icon: ClipboardList },
      { label: "Documents", href: "/owner/documents", icon: FileCheck },
      { label: "Notifications", href: "/owner/notifications", icon: Bell },
    ],
  },
  { label: "Reports", href: "/owner/reports", icon: BarChart2 },
  { label: "Analytics", href: "/owner/analytics", icon: BarChart2 },
  { label: "Users", href: "/owner/users", icon: Users },
  { label: "Organisation", href: "/owner/organisation", icon: Building2 },
  { label: "Integrations", href: "/owner/integrations", icon: Sparkles },
  { label: "Subscription", href: "/owner/subscription", icon: CreditCard },
  { label: "Audit Logs", href: "/owner/audit-logs", icon: ScrollText },
];

const branchManagerNav: NavItem[] = [
  { label: "Dashboard", href: "/branch-manager/dashboard", icon: LayoutDashboard },
  {
    label: "Leads",
    icon: Target,
    children: [
      { label: "Leads", href: "/branch-manager/leads", icon: Target },
      { label: "Follow-ups", href: "/branch-manager/followups", icon: PhoneCall },
    ],
  },
  {
    label: "Academics",
    icon: BookOpen,
    children: [
      { label: "Programs", href: "/branch-manager/programs", icon: BookMarked },
      { label: "Batches", href: "/branch-manager/batches", icon: Layers },
      { label: "Schedules", href: "/branch-manager/schedules", icon: Calendar },
      { label: "Trainers", href: "/branch-manager/trainers", icon: GraduationCap },
    ],
  },
  {
    label: "Students",
    icon: Users,
    children: [
      { label: "Students", href: "/branch-manager/students", icon: Users },
      { label: "Enrollments", href: "/branch-manager/enrollments", icon: UserCheck },
      { label: "Attendance", href: "/branch-manager/attendance", icon: ClipboardCheck },
      { label: "Progress", href: "/branch-manager/progress", icon: TrendingUp },
      { label: "Certificates", href: "/branch-manager/certificates", icon: Award },
      { label: "Transfers", href: "/branch-manager/transfers", icon: ArrowLeftRight },
      { label: "Waitlists", href: "/branch-manager/waitlists", icon: Clock },
      { label: "Renewals", href: "/branch-manager/renewals", icon: RefreshCw },
    ],
  },
    {
      label: "Finance",
      icon: CreditCard,
      children: [
        { label: "Fee Plans", href: "/branch-manager/fee-plans", icon: Receipt },
        { label: "Invoices", href: "/branch-manager/invoices", icon: FileText },
        { label: "Payments", href: "/branch-manager/payments", icon: Wallet },
        { label: "Payment History", href: "/branch-manager/payment-history", icon: History },
        { label: "Due Tracking", href: "/branch-manager/due-tracking", icon: AlertTriangle },
      ],
    },
  {
    label: "Operations",
    icon: ClipboardCheck,
    children: [
      { label: "Tasks", href: "/branch-manager/tasks", icon: ClipboardList },
      { label: "Documents", href: "/branch-manager/documents", icon: FileCheck },
      { label: "Notifications", href: "/branch-manager/notifications", icon: Bell },
    ],
  },
  { label: "Reports", href: "/branch-manager/reports", icon: BarChart2 },
  { label: "Users", href: "/branch-manager/users", icon: Users },
];

const staffNav: NavItem[] = [
  { label: "Dashboard", href: "/staff/dashboard", icon: LayoutDashboard },
  {
    label: "Leads",
    icon: Target,
    children: [
      { label: "Leads", href: "/staff/leads", icon: Target },
      { label: "Follow-ups", href: "/staff/followups", icon: PhoneCall },
    ],
  },
  {
    label: "Academics",
    icon: BookOpen,
    children: [
      { label: "Programs", href: "/staff/programs", icon: BookMarked },
      { label: "Batches", href: "/staff/batches", icon: Layers },
      { label: "Schedules", href: "/staff/schedules", icon: Calendar },
      { label: "Trainers", href: "/staff/trainers", icon: GraduationCap },
    ],
  },
  {
    label: "Students",
    icon: Users,
    children: [
      { label: "Students", href: "/staff/students", icon: Users },
      { label: "Enrollments", href: "/staff/enrollments", icon: UserCheck },
      { label: "Attendance", href: "/staff/attendance", icon: ClipboardCheck },
      { label: "Progress", href: "/staff/progress", icon: TrendingUp },
      { label: "Certificates", href: "/staff/certificates", icon: Award },
      { label: "Transfers", href: "/staff/transfers", icon: ArrowLeftRight },
      { label: "Waitlists", href: "/staff/waitlists", icon: Clock },
      { label: "Renewals", href: "/staff/renewals", icon: RefreshCw },
    ],
  },
    {
      label: "Finance",
      icon: CreditCard,
      children: [
        { label: "Fee Plans", href: "/staff/fee-plans", icon: Receipt },
        { label: "Invoices", href: "/staff/invoices", icon: FileText },
        { label: "Payments", href: "/staff/payments", icon: Wallet },
        { label: "Payment History", href: "/staff/payment-history", icon: History },
        { label: "Due Tracking", href: "/staff/due-tracking", icon: AlertTriangle },
      ],
    },
  {
    label: "Operations",
    icon: ClipboardCheck,
    children: [
      { label: "Tasks", href: "/staff/tasks", icon: ClipboardList },
      { label: "Documents", href: "/staff/documents", icon: FileCheck },
      { label: "Notifications", href: "/staff/notifications", icon: Bell },
    ],
  },
  { label: "Reports", href: "/staff/reports", icon: BarChart2 },
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
  { label: "Payment History", href: "/client/payment-history", icon: History },
  { label: "Due Tracking", href: "/client/due-tracking", icon: AlertTriangle },
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
  onClose?: () => void;
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

  return (
    <aside
      className={cn(
        "border-border bg-surface flex h-full flex-col border-r transition-[width] duration-[var(--duration-drawer)]",
        collapsed ? "w-16" : "w-60"
      )}
    >
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

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3" aria-label="Main navigation">
        {(user?.role === "SUPER_ADMIN" ? superAdminNav : getNav(user?.role ?? "")).map((item) => (
          <NavItemRow key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>

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
