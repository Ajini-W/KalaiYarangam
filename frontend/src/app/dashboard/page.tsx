"use client";

import { useRouter } from "next/navigation";
import { Users, BookOpen, Package, CalendarCheck, CreditCard, BarChart2, Settings, UserPlus, Mail, Bell } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { useAuthStore } from "@/store/auth.store";

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  OWNER: "Owner",
  BRANCH_MANAGER: "Branch Manager",
  TRAINER: "Trainer",
  STAFF: "Staff",
  STUDENT: "Student",
  CLIENT: "Client",
};

const roleGreetings: Record<string, string> = {
  SUPER_ADMIN: "Here's your platform overview.",
  OWNER: "Here's what's happening in your academy.",
  BRANCH_MANAGER: "Here's your branch overview.",
  TRAINER: "Here's your schedule and classes.",
  STAFF: "Here's your daily overview.",
  STUDENT: "Here's your learning progress.",
  CLIENT: "Here's your account overview.",
};

interface QuickAction {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

const quickActions: QuickAction[] = [
  { label: "Add Lead", href: "/dashboard/leads", icon: <UserPlus size={18} />, roles: ["SUPER_ADMIN", "OWNER", "BRANCH_MANAGER", "STAFF"] },
  { label: "View Batches", href: "/dashboard/training/batches", icon: <BookOpen size={18} />, roles: ["SUPER_ADMIN", "OWNER", "BRANCH_MANAGER", "TRAINER", "STAFF"] },
  { label: "Students", href: "/dashboard/training/students", icon: <Users size={18} />, roles: ["SUPER_ADMIN", "OWNER", "BRANCH_MANAGER", "TRAINER", "STAFF"] },
  { label: "Rental Bookings", href: "/dashboard/rental/bookings", icon: <Package size={18} />, roles: ["SUPER_ADMIN", "OWNER", "BRANCH_MANAGER", "STAFF"] },
  { label: "Events", href: "/dashboard/events", icon: <CalendarCheck size={18} />, roles: ["SUPER_ADMIN", "OWNER", "BRANCH_MANAGER", "STAFF"] },
  { label: "Payments", href: "/dashboard/payments", icon: <CreditCard size={18} />, roles: ["SUPER_ADMIN", "OWNER", "BRANCH_MANAGER", "STAFF"] },
  { label: "Reports", href: "/dashboard/reports/revenue", icon: <BarChart2 size={18} />, roles: ["SUPER_ADMIN", "OWNER", "BRANCH_MANAGER"] },
  { label: "Users", href: "/dashboard/users", icon: <Users size={18} />, roles: ["SUPER_ADMIN", "OWNER"] },
  { label: "Settings", href: "/dashboard/settings/organisation", icon: <Settings size={18} />, roles: ["SUPER_ADMIN", "OWNER", "BRANCH_MANAGER"] },
  { label: "Notifications", href: "/dashboard/notifications", icon: <Bell size={18} />, roles: ["SUPER_ADMIN", "OWNER", "BRANCH_MANAGER", "TRAINER", "STAFF", "STUDENT", "CLIENT"] },
];

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const roleLabel = roleLabels[user.role] || user.role;
  const greeting = roleGreetings[user.role] || "Welcome back!";
  const actions = quickActions.filter((a) => a.roles.includes(user.role));

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <PageContainer>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
            {initials}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Welcome back, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              {roleLabel} &middot; {greeting}
            </p>
          </div>
        </div>
      </div>

      {actions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => router.push(action.href)}
                  className="flex items-center gap-2.5 rounded-[var(--radius-md)] border border-border p-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-raised hover:border-brand-300 text-left"
                >
                  <span className="text-brand-600 shrink-0">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {actions.length === 0 && (
        <Card>
          <CardBody>
            <p className="text-sm text-text-secondary text-center py-8">
              Welcome to KalaiArangam! Explore the sidebar to get started.
            </p>
          </CardBody>
        </Card>
      )}
    </PageContainer>
  );
}
