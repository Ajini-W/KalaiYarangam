"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useProfileModal } from "@/store/profile.store";
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
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  onClick?: () => void;
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
  { label: "Access Requests", href: "/owner/access-requests", icon: UserCheck },
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
  { label: "Profile", icon: IdCard, onClick: () => useProfileModal.getState().setOpen(true) },
];

const branchManagerNav: NavItem[] = [
  { label: "Dashboard", href: "/branch-manager/dashboard", icon: LayoutDashboard },
  { label: "Access Requests", href: "/branch-manager/access-requests", icon: UserCheck },
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
  { label: "Profile", icon: IdCard, onClick: () => useProfileModal.getState().setOpen(true) },
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
  { label: "Access Requests", href: "/staff/access-requests", icon: UserCheck },
  { label: "Reports", href: "/staff/reports", icon: BarChart2 },
  { label: "Profile", icon: IdCard, onClick: () => useProfileModal.getState().setOpen(true) },
];

const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Request", href: "/student/my-request", icon: Clock },
  { label: "My Courses", href: "/student/my-courses", icon: BookOpen },
  { label: "Attendance", href: "/student/attendance", icon: CalendarCheck },
  { label: "Fees", href: "/student/fees", icon: CreditCard },
  { label: "Progress", href: "/student/progress", icon: TrendingUp },
  { label: "Certificates", href: "/student/certificates", icon: Award },
  { label: "Notifications", href: "/student/notifications", icon: Bell },
  { label: "Profile", icon: IdCard, onClick: () => useProfileModal.getState().setOpen(true) },
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
  { label: "Profile", icon: IdCard, onClick: () => useProfileModal.getState().setOpen(true) },
];

function getNav(role: string): NavItem[] {
  switch (role) {
    case "OWNER": return ownerNav;
    case "BRANCH_MANAGER": return branchManagerNav;
    case "TRAINER": return staffNav;
    case "STAFF": return staffNav;
    case "STUDENT": return studentNav;
    case "CLIENT": return clientNav;
    default: return ownerNav;
  }
}

interface SidebarContentProps {
  isCollapsed?: boolean;
  onItemClick?: () => void;
}

function SidebarContent({ isCollapsed = false, onItemClick }: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

  const toggleExpanded = (key: string) => {
    setExpandedItems((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleLogout = async () => {
    await logout();
    setShowLogoutDialog(false);
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href.endsWith("/dashboard")) return pathname === href;
    return pathname.startsWith(href);
  };

  const navItems = user?.role === "SUPER_ADMIN" ? superAdminNav : getNav(user?.role ?? "");

  const renderNavItem = (item: NavItem, level = 0) => {
    const active = item.href ? isActive(item.href) : false;
    const expandKey = item.label;
    const expanded = expandedItems.includes(expandKey);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;
    const isParentActive = hasChildren && item.children?.some((child) => child.href && isActive(child.href));

    if (item.onClick) {
      return (
        <button
          key={item.label}
          type="button"
          onClick={item.onClick}
          title={isCollapsed ? item.label : undefined}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
            level > 0 && "pl-12",
            "text-text-secondary hover:bg-muted/60 hover:text-text-primary",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Icon className={cn("h-5 w-5 shrink-0")} />
          {!isCollapsed && <span>{item.label}</span>}
        </button>
      );
    }

    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleExpanded(expandKey)}
            className={cn(
              "w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              level > 0 && "pl-6",
              isParentActive
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-text-secondary hover:bg-muted/60 hover:text-text-primary",
              isCollapsed && "justify-center px-2"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className={cn("h-5 w-5 shrink-0", isParentActive && "text-primary")} />
              {!isCollapsed && <span>{item.label}</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  expanded && "rotate-180",
                  isParentActive && "text-primary"
                )}
              />
            )}
          </button>
          {expanded && !isCollapsed && (
            <div className="mt-0.5 ml-4 space-y-0.5 border-l-2 border-primary/20 pl-3">
              {item.children?.map((child) => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href!}
        onClick={onItemClick}
        title={isCollapsed ? item.label : undefined}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
          level > 0 && "pl-6",
          active
            ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-primary border border-primary/20 shadow-sm"
            : "text-text-secondary hover:bg-muted/60 hover:text-text-primary",
          isCollapsed && "justify-center px-2"
        )}
      >
        <Icon className={cn("h-5 w-5 shrink-0", active && "text-primary")} />
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  const logoSrc = user?.tenantLogoUrl || "/icons/logo.png";

  return (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className={cn("px-4 py-5 border-b border-border/50", isCollapsed && "px-3")}>
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onItemClick}>
          <img
            src={logoSrc}
            alt="Logo"
            className="h-9 w-9 rounded-xl shadow-md shrink-0 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = "/icons/logo.png"; }}
          />
          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="text-base font-bold text-text-primary truncate">
                {user?.tenantName || "KalaiArangam"}
              </h2>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider">
                {user?.role === "SUPER_ADMIN" ? "Platform Admin" : "ERP Portal"}
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        aria-label="Main navigation"
      >
        {navItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Bottom Section - Logout Only */}
      <div className={cn("border-t border-border/50 px-3 py-3", isCollapsed && "px-2")}>
        <button
          onClick={() => setShowLogoutDialog(true)}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
            "text-danger hover:bg-danger/10 hover:text-danger border border-transparent hover:border-danger/20",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        open={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        title="Confirm Logout"
        size="sm"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogoutDialog(false)}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-xl border border-border hover:bg-muted/60 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-xl bg-danger text-white hover:bg-danger/90 transition-colors"
            >
              Logout
            </button>
          </div>
        }
      >
        <div className="flex items-center gap-4 py-2">
          <div className="h-12 w-12 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6 text-danger" />
          </div>
          <p className="text-sm text-text-secondary">
            Are you sure you want to logout? You will need to sign in again to access your account.
          </p>
        </div>
      </Modal>
    </div>
  );
}

interface SidebarProps {
  collapsed: boolean;
  onClose?: () => void;
}

export function Sidebar({ collapsed, onClose }: SidebarProps) {
  return (
    <aside
      className={cn(
        "border-r border-border/50 bg-surface flex h-full flex-col transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      <SidebarContent isCollapsed={collapsed} onItemClick={onClose} />
    </aside>
  );
}
