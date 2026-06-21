"use client";

import { useRouter } from "next/navigation";
import { Calendar, Users, Clock, BookOpen } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { useAuthStore } from "@/store/auth.store";

export default function TrainerDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <PageContainer>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
            {initials}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Welcome, {user.name.split(" ")[0]}!</h1>
            <p className="text-sm text-text-secondary mt-0.5">Trainer &middot; Here&apos;s your schedule and classes.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button onClick={() => router.push("/trainer/dashboard")} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border p-4 text-left hover:bg-surface-raised hover:border-brand-300 transition-colors">
          <Calendar size={20} className="text-brand-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-text-primary">Today&apos;s Schedule</p>
            <p className="text-xs text-text-secondary">View your classes</p>
          </div>
        </button>
        <button onClick={() => router.push("/trainer/batches")} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border p-4 text-left hover:bg-surface-raised hover:border-brand-300 transition-colors">
          <BookOpen size={20} className="text-brand-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-text-primary">My Batches</p>
            <p className="text-xs text-text-secondary">Manage batches</p>
          </div>
        </button>
        <button onClick={() => router.push("/trainer/students")} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border p-4 text-left hover:bg-surface-raised hover:border-brand-300 transition-colors">
          <Users size={20} className="text-brand-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-text-primary">Students</p>
            <p className="text-xs text-text-secondary">View progress</p>
          </div>
        </button>
        <button onClick={() => router.push("/trainer/timetable")} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border p-4 text-left hover:bg-surface-raised hover:border-brand-300 transition-colors">
          <Clock size={20} className="text-brand-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-text-primary">Timetable</p>
            <p className="text-xs text-text-secondary">Weekly schedule</p>
          </div>
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button onClick={() => router.push("/trainer/attendance")} className="rounded-[var(--radius-md)] border border-border p-3 text-sm font-medium text-text-primary hover:bg-surface-raised hover:border-brand-300 transition-colors text-left">
              Mark Attendance
            </button>
            <button onClick={() => router.push("/trainer/feedback")} className="rounded-[var(--radius-md)] border border-border p-3 text-sm font-medium text-text-primary hover:bg-surface-raised hover:border-brand-300 transition-colors text-left">
              Student Feedback
            </button>
            <button onClick={() => router.push("/trainer/dashboard")} className="rounded-[var(--radius-md)] border border-border p-3 text-sm font-medium text-text-primary hover:bg-surface-raised hover:border-brand-300 transition-colors text-left">
              Reports
            </button>
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
