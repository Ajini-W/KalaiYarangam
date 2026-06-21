"use client";

import { Users, Building2, CreditCard, BarChart3, TrendingUp, Calendar, Settings, Bell } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/Card";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth.store";

export default function OwnerDashboard() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <PageContainer>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">{initials}</span>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Welcome, {user.name.split(" ")[0]}!</h1>
            <p className="text-sm text-text-secondary mt-0.5">Owner &middot; Here&apos;s your business overview.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value="--" icon={<Users size={20} />} />
        <StatCard title="Active Branches" value="--" icon={<Building2 size={20} />} />
        <StatCard title="Revenue (MTD)" value="--" icon={<TrendingUp size={20} />} />
        <StatCard title="Pending Payments" value="--" icon={<CreditCard size={20} />} />
      </div>

      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: "Students", icon: <Users size={18} />, href: "/owner/students" },
              { label: "Branches", icon: <Building2 size={18} />, href: "/owner/branches" },
              { label: "Reports", icon: <BarChart3 size={18} />, href: "/owner/reports" },
              { label: "Settings", icon: <Settings size={18} />, href: "/owner/settings" },
            ].map((a) => (
              <Button key={a.label} variant="outline" className="justify-start gap-2.5 h-auto py-3 px-3" onClick={() => {}}>
                <span className="shrink-0">{a.icon}</span>
                {a.label}
              </Button>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Upcoming Events</CardTitle></CardHeader>
          <CardBody>
            <p className="text-sm text-text-secondary">No upcoming events.</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Enquiries</CardTitle></CardHeader>
          <CardBody>
            <p className="text-sm text-text-secondary">No recent enquiries.</p>
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}
