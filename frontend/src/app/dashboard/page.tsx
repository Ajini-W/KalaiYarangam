import {
  Users, BookOpen, Package, CalendarCheck,
  CreditCard, TrendingUp,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/Card";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const stats = [
  { title: "Total Students",    value: "1,284", delta: "+12% this month", deltaType: "increase" as const, icon: <Users size={20} /> },
  { title: "Active Batches",    value: "38",    delta: "+3 new",          deltaType: "increase" as const, icon: <BookOpen size={20} /> },
  { title: "Rental Bookings",   value: "96",    delta: "+8% this week",   deltaType: "increase" as const, icon: <Package size={20} /> },
  { title: "Events This Month", value: "14",    delta: "2 upcoming",      deltaType: "neutral"  as const, icon: <CalendarCheck size={20} /> },
  { title: "Revenue (Month)",   value: "₹2.4L", delta: "+18% vs last",   deltaType: "increase" as const, icon: <CreditCard size={20} /> },
  { title: "Pending Dues",      value: "₹42K",  delta: "23 students",     deltaType: "decrease" as const, icon: <TrendingUp size={20} /> },
];

const recentLeads = [
  { name: "Priya Sharma",   course: "Bharatanatyam", status: "new",        time: "2m ago" },
  { name: "Ravi Kumar",     course: "Karate",        status: "followup",   time: "1h ago" },
  { name: "Meena Devi",     course: "Yoga",          status: "enrolled",   time: "3h ago" },
  { name: "Arjun Raj",      course: "Robotics",      status: "new",        time: "5h ago" },
  { name: "Sneha Pillai",   course: "Dance",         status: "converted",  time: "1d ago" },
];

const statusVariant: Record<string, "info" | "warning" | "success" | "brand"> = {
  new: "info", followup: "warning", enrolled: "brand", converted: "success",
};

export default function DashboardPage() {
  return (
    <PageContainer
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening today."
    >
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Recent activity */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <Badge variant="brand" size="sm">{recentLeads.length} total</Badge>
          </CardHeader>
          <CardBody className="pt-0">
            <ul className="divide-y divide-border-subtle">
              {recentLeads.map((lead) => (
                <li key={lead.name} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                      {lead.name[0]}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">{lead.name}</p>
                      <p className="text-xs text-text-secondary">{lead.course}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={statusVariant[lead.status]}>{lead.status}</Badge>
                    <span className="text-xs text-text-disabled">{lead.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Add Lead",       href: "/dashboard/leads",                    icon: "👤" },
                { label: "New Batch",      href: "/dashboard/training/batches",         icon: "📚" },
                { label: "New Booking",    href: "/dashboard/rental/bookings",          icon: "📦" },
                { label: "Create Event",   href: "/dashboard/events",                   icon: "🎪" },
                { label: "Collect Fee",    href: "/dashboard/payments",                 icon: "💳" },
                { label: "View Reports",   href: "/dashboard/reports/revenue",          icon: "📊" },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-2.5 rounded-[var(--radius-md)] border border-border p-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-raised hover:border-brand-300"
                >
                  <span className="text-lg">{action.icon}</span>
                  {action.label}
                </a>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}
