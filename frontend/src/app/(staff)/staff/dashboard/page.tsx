"use client";

import { ClipboardList, Calendar, Users, Bell, HelpCircle, UserCheck } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/Card";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth.store";
import { AccessStatusBanner, RejectedAccessBanner } from "@/components/shared/AccessStatusBanner";
import { useRouter } from "next/navigation";

export default function StaffDashboard() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <PageContainer>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">{initials}</span>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Welcome, {user.name.split(" ")[0]}!</h1>
            <p className="text-sm text-text-secondary mt-0.5">Staff &middot; Here&apos;s your task overview.</p>
          </div>
        </div>
      </div>

      <AccessStatusBanner />
      <RejectedAccessBanner />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Pending Tasks" value="--" icon={<ClipboardList size={20} />} />
        <StatCard title="Today&apos;s Events" value="--" icon={<Calendar size={20} />} />
        <StatCard title="New Enquiries" value="--" icon={<Users size={20} />} />
        <StatCard title="Notifications" value="--" icon={<Bell size={20} />} />
      </div>

      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: "Student Requests", icon: <UserCheck size={18} />, href: "/staff/access-requests" },
              { label: "Tasks", icon: <ClipboardList size={18} />, href: "/staff/tasks" },
              { label: "Schedule", icon: <Calendar size={18} />, href: "/staff/schedules" },
              { label: "Help", icon: <HelpCircle size={18} />, href: "/staff/help" },
            ].map((a) => (
              <Button key={a.label} variant="outline" className="justify-start gap-2.5 h-auto py-3 px-3" onClick={() => router.push(a.href)}>
                <span className="shrink-0">{a.icon}</span>
                {a.label}
              </Button>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardBody className="pt-0">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {[
                { label: "Tasks", icon: <ClipboardList size={18} />, href: "/staff/tasks" },
                { label: "Schedule", icon: <Calendar size={18} />, href: "/staff/schedules" },
                { label: "Students", icon: <Users size={18} />, href: "/staff/students" },
                { label: "Settings", icon: <Settings size={18} />, href: "/staff/settings" },
              ].map((a) => (
                <Link key={a.label} href={a.href}>
                  <Button variant="outline" className="h-auto w-full justify-start gap-2.5 px-3 py-3">
                    <span className="shrink-0">{a.icon}</span>
                    {a.label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>
      }
    />
  );
}
