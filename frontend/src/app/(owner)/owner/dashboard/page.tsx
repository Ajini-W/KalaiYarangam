"use client";

import { Users, Building2, CreditCard, BarChart2, Settings, Bell, CalendarCheck } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { useAuthStore } from "@/store/auth.store";

export default function OwnerDashboard() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <PageContainer>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">{initials}</span>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Welcome, {user.name.split(" ")[0]}!</h1>
            <p className="text-sm text-text-secondary mt-0.5">Owner &middot; Here&apos;s what&apos;s happening in your academy.</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: "Branches", icon: <Building2 size={18} />, href: "/owner/branches" },
              { label: "Revenue", icon: <CreditCard size={18} />, href: "/owner/revenue" },
              { label: "Leads", icon: <Users size={18} />, href: "/owner/leads" },
              { label: "Reports", icon: <BarChart2 size={18} />, href: "/owner/reports" },
              { label: "Events", icon: <CalendarCheck size={18} />, href: "/owner/events" },
              { label: "Settings", icon: <Settings size={18} />, href: "/owner/settings" },
              { label: "Notifications", icon: <Bell size={18} />, href: "/owner/notifications" },
              { label: "Collections", icon: <CreditCard size={18} />, href: "/owner/collections" },
            ].map((a) => (
              <button key={a.label} onClick={() => {}} className="flex items-center gap-2.5 rounded-[var(--radius-md)] border border-border p-3 text-sm font-medium text-text-primary hover:bg-surface-raised hover:border-brand-300 transition-colors text-left">
                <span className="text-brand-600 shrink-0">{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
