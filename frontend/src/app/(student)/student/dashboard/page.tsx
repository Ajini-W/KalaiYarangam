"use client";

import { BookOpen, CalendarCheck, Clock, Award, Bell } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { useAuthStore } from "@/store/auth.store";

export default function StudentDashboard() {
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
            <p className="text-sm text-text-secondary mt-0.5">Student &middot; Here&apos;s your learning progress.</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: "My Courses", icon: <BookOpen size={18} />, href: "/student/courses" },
              { label: "Schedule", icon: <CalendarCheck size={18} />, href: "/student/schedule" },
              { label: "Attendance", icon: <Clock size={18} />, href: "/student/attendance" },
              { label: "Achievements", icon: <Award size={18} />, href: "/student/achievements" },
              { label: "Notifications", icon: <Bell size={18} />, href: "/student/notifications" },
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
