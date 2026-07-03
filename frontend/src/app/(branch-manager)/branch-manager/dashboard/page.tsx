"use client";

import * as React from "react";
import { Users, Calendar, CreditCard, BarChart3, ClipboardList, UserCheck, Clock } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/Card";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/store/auth.store";
import { listAccessRequests, type AccessRequest } from "@/services/onboarding";
import { useRouter } from "next/navigation";

export default function BranchManagerDashboard() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [pendingRequests, setPendingRequests] = React.useState<AccessRequest[]>([]);
  const [pendingCount, setPendingCount] = React.useState(0);

  React.useEffect(() => {
    listAccessRequests("PENDING")
      .then((res) => {
        const data = res.data ?? [];
        setPendingRequests(data.slice(0, 5));
        setPendingCount(data.length);
      })
      .catch(() => {});
  }, []);

  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <PageContainer>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">{initials}</span>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Welcome, {user.name.split(" ")[0]}!</h1>
            <p className="text-sm text-text-secondary mt-0.5">Branch Manager &middot; Here&apos;s your branch overview.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Active Students" value="--" icon={<Users size={20} />} />
        <StatCard title="Today&apos;s Classes" value="--" icon={<Calendar size={20} />} />
        <StatCard title="Collections (MTD)" value="--" icon={<CreditCard size={20} />} />
        <StatCard
          title="Pending Approvals"
          value={pendingCount}
          icon={<UserCheck size={20} />}
          deltaType={pendingCount > 0 ? "decrease" : "neutral"}
        />
      </div>

      {pendingCount > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock size={16} className="text-warning" />
                Pending Access Requests ({pendingCount})
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/branch-manager/access-requests")}>View All</Button>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{req.user.name}</p>
                    <p className="text-xs text-text-secondary">{req.user.email} &middot; {req.role}</p>
                  </div>
                  <Badge variant="warning" size="sm">Pending</Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: "Access Requests", icon: <UserCheck size={18} />, href: "/branch-manager/access-requests" },
              { label: "Students", icon: <Users size={18} />, href: "/branch-manager/students" },
              { label: "Schedule", icon: <Calendar size={18} />, href: "/branch-manager/schedules" },
              { label: "Reports", icon: <BarChart3 size={18} />, href: "/branch-manager/reports" },
            ].map((a) => (
              <Button key={a.label} variant="outline" className="justify-start gap-2.5 h-auto py-3 px-3" onClick={() => router.push(a.href)}>
                <span className="shrink-0">{a.icon}</span>
                {a.label}
              </Button>
            ))}
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
