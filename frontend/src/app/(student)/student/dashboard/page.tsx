"use client";

import { BookOpen, Calendar, Award, Clock, TrendingUp, UserCheck } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/Card";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth.store";
import { AccessStatusBanner, RejectedAccessBanner } from "@/components/shared/AccessStatusBanner";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
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
            <p className="text-sm text-text-secondary mt-0.5">Student &middot; Here&apos;s your learning overview.</p>
          </div>
        </div>
      </div>

      <AccessStatusBanner />
      <RejectedAccessBanner />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Enrolled Courses" value="--" icon={<BookOpen size={20} />} />
        <StatCard title="Upcoming Classes" value="--" icon={<Calendar size={20} />} />
        <StatCard title="Certificates" value="--" icon={<Award size={20} />} />
        <StatCard title="Hours This Week" value="--" icon={<Clock size={20} />} />
      </div>

      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: "My Request", icon: <UserCheck size={18} />, href: "/student/my-request" },
              { label: "Courses", icon: <BookOpen size={18} />, href: "/student/my-courses" },
              { label: "Schedule", icon: <Calendar size={18} />, href: "/student/attendance" },
              { label: "Progress", icon: <TrendingUp size={18} />, href: "/student/progress" },
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
          <CardHeader><CardTitle>Upcoming Classes</CardTitle></CardHeader>
          <CardBody>
            <p className="text-sm text-text-secondary">No upcoming classes.</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Achievements</CardTitle></CardHeader>
          <CardBody>
            <p className="text-sm text-text-secondary">No achievements yet.</p>
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}
