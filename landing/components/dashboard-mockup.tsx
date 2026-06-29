import {
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  CalendarHeart,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Truck,
  RotateCcw,
  Calendar,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface DashboardConfig {
  navItems: { icon: LucideIcon; label: string; active?: boolean }[];
  stats: {
    label: string;
    value: string;
    change: string;
    trend?: "up" | "down";
  }[];
  chartLabel: string;
  chartLegend: { color: string; label: string }[];
  bars: number[];
  secondaryBars?: number[];
  list?: { label: string; meta: string; badge: string; badgeColor: string }[];
}

export const dashboardConfigs: Record<string, DashboardConfig> = {
  owner: {
    navItems: [
      { icon: LayoutDashboard, label: "Overview", active: true },
      { icon: Users, label: "Leads" },
      { icon: GraduationCap, label: "Students" },
      { icon: Package, label: "Inventory" },
      { icon: CalendarDays, label: "Bookings" },
      { icon: CreditCard, label: "Payments" },
    ],
    stats: [
      { label: "Total Revenue", value: "₹8.6L", change: "+12.4%", trend: "up" },
      {
        label: "Active Students",
        value: "1,284",
        change: "+8.1%",
        trend: "up",
      },
      { label: "Utilization", value: "92%", change: "+3.7%", trend: "up" },
    ],
    chartLabel: "Revenue & Enrollments",
    chartLegend: [
      { color: "bg-primary", label: "Revenue" },
      { color: "bg-accent-blue", label: "Enrollments" },
    ],
    bars: [42, 58, 49, 70, 64, 82, 75, 96, 88, 72, 90, 100],
    secondaryBars: undefined,
  },
  branch: {
    navItems: [
      { icon: LayoutDashboard, label: "Branch", active: true },
      { icon: Users, label: "Staff" },
      { icon: GraduationCap, label: "Students" },
      { icon: CalendarDays, label: "Schedule" },
      { icon: CreditCard, label: "Collections" },
    ],
    stats: [
      { label: "Branch Revenue", value: "₹3.2L", change: "+9.3%", trend: "up" },
      { label: "Staff Active", value: "12", change: "0%", trend: "up" },
      { label: "Attendance", value: "87%", change: "-2.1%", trend: "down" },
    ],
    chartLabel: "Daily Collections",
    chartLegend: [
      { color: "bg-primary", label: "Collected" },
      { color: "bg-accent-blue", label: "Pending" },
    ],
    bars: [65, 78, 52, 88, 71, 94, 83, 60, 76, 90, 85, 92],
    list: [
      {
        label: "Bharatanatyam - Batch A",
        meta: "24 students · 9:00 AM",
        badge: "Active",
        badgeColor: "bg-accent-green/15 text-accent-green",
      },
      {
        label: "Vocal Music - Evening",
        meta: "18 students · 5:00 PM",
        badge: "Active",
        badgeColor: "bg-accent-green/15 text-accent-green",
      },
      {
        label: "Yoga - Weekend",
        meta: "31 students · 7:00 AM",
        badge: "Full",
        badgeColor: "bg-primary/15 text-primary",
      },
    ],
  },
  trainer: {
    navItems: [
      { icon: LayoutDashboard, label: "My Classes", active: true },
      { icon: ClipboardList, label: "Attendance" },
      { icon: GraduationCap, label: "Students" },
      { icon: BarChart3, label: "Progress" },
      { icon: Calendar, label: "Schedule" },
    ],
    stats: [
      {
        label: "Today's Classes",
        value: "4",
        change: "2 remaining",
        trend: "up",
      },
      { label: "Avg Attendance", value: "91%", change: "+3.2%", trend: "up" },
      {
        label: "Pending Marks",
        value: "12",
        change: "5 overdue",
        trend: "down",
      },
    ],
    chartLabel: "Weekly Attendance",
    chartLegend: [
      { color: "bg-primary", label: "Present" },
      { color: "bg-accent-blue", label: "Absent" },
    ],
    bars: [92, 88, 95, 85, 90, 78, 93, 87, 91, 96, 89, 94],
    secondaryBars: [8, 12, 5, 15, 10, 22, 7, 13, 9, 4, 11, 6],
    list: [
      {
        label: "Bharatanatyam - Batch A",
        meta: "24 students · 9:00 AM",
        badge: "Next",
        badgeColor: "bg-primary/15 text-primary",
      },
      {
        label: "Vocal Music - Evening",
        meta: "18 students · 5:00 PM",
        badge: "Upcoming",
        badgeColor: "bg-muted text-muted-foreground",
      },
      {
        label: "Yoga - Weekend",
        meta: "31 students · 7:00 AM",
        badge: "Done",
        badgeColor: "bg-accent-green/15 text-accent-green",
      },
    ],
  },
  event: {
    navItems: [
      { icon: LayoutDashboard, label: "Pipeline", active: true },
      { icon: Users, label: "Leads" },
      { icon: CalendarHeart, label: "Events" },
      { icon: CreditCard, label: "Budgets" },
      { icon: ClipboardList, label: "Tasks" },
    ],
    stats: [
      {
        label: "Active Events",
        value: "8",
        change: "3 this week",
        trend: "up",
      },
      { label: "Pipeline Value", value: "₹24L", change: "+18%", trend: "up" },
      {
        label: "Tasks Pending",
        value: "14",
        change: "5 urgent",
        trend: "down",
      },
    ],
    chartLabel: "Event Revenue by Month",
    chartLegend: [
      { color: "bg-primary", label: "Confirmed" },
      { color: "bg-accent-blue", label: "Pipeline" },
    ],
    bars: [30, 45, 60, 38, 72, 55, 80, 65, 90, 75, 85, 95],
    secondaryBars: [20, 35, 25, 42, 30, 45, 35, 50, 40, 55, 45, 60],
    list: [
      {
        label: "Sharma Wedding",
        meta: "₹4.2L budget · 12 tasks",
        badge: "Planning",
        badgeColor: "bg-amber-500/15 text-amber-600",
      },
      {
        label: "Corporate Gala",
        meta: "₹8.5L budget · 3 tasks left",
        badge: "On Track",
        badgeColor: "bg-accent-green/15 text-accent-green",
      },
      {
        label: "Annual Day Show",
        meta: "₹2.1L budget · Quote sent",
        badge: "Pending",
        badgeColor: "bg-muted text-muted-foreground",
      },
    ],
  },
  rental: {
    navItems: [
      { icon: LayoutDashboard, label: "Inventory", active: true },
      { icon: CalendarDays, label: "Bookings" },
      { icon: Truck, label: "Dispatch" },
      { icon: RotateCcw, label: "Returns" },
      { icon: CreditCard, label: "Payments" },
    ],
    stats: [
      {
        label: "Items Available",
        value: "156",
        change: "82% ready",
        trend: "up",
      },
      {
        label: "Active Rentals",
        value: "34",
        change: "+6 this week",
        trend: "up",
      },
      { label: "Revenue Today", value: "₹48K", change: "+15%", trend: "up" },
    ],
    chartLabel: "Booking Utilization",
    chartLegend: [
      { color: "bg-primary", label: "Booked" },
      { color: "bg-accent-blue", label: "Available" },
    ],
    bars: [70, 55, 80, 45, 75, 60, 85, 50, 72, 65, 78, 88],
    secondaryBars: [30, 45, 20, 55, 25, 40, 15, 50, 28, 35, 22, 12],
    list: [
      {
        label: "Stage Lighting Kit ×3",
        meta: "Out - returns Sat",
        badge: "Booked",
        badgeColor: "bg-primary/15 text-primary",
      },
      {
        label: "Costume Set - Royal ×6",
        meta: "In stock · Ready",
        badge: "Ready",
        badgeColor: "bg-accent-green/15 text-accent-green",
      },
      {
        label: "Sound System Pro ×2",
        meta: "Under maintenance",
        badge: "Service",
        badgeColor: "bg-amber-500/15 text-amber-600",
      },
    ],
  },
};

export function DashboardMockup({
  className,
  config,
}: {
  className?: string;
  config?: DashboardConfig;
}) {
  const c = config ?? dashboardConfigs.owner;

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/5",
        className,
      )}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-surface-alt px-4 py-3">
        <span className="size-3 rounded-full bg-accent-red/70" />
        <span className="size-3 rounded-full bg-amber-400/80" />
        <span className="size-3 rounded-full bg-accent-green/70" />
        <div className="ml-3 hidden flex-1 items-center rounded-xl bg-background/80 px-3 py-1 text-xs text-muted-foreground sm:flex">
          app.kalaiArangam.com/dashboard
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
        {/* Sidebar */}
        <aside className="hidden flex-col gap-1 border-r border-border bg-surface-alt p-3 sm:flex">
          {c.navItems.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all",
                item.active
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </div>
          ))}
        </aside>

        {/* Main */}
        <div className="p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Dashboard</p>
              <p className="font-heading text-base font-bold">{c.chartLabel}</p>
            </div>
            <div className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
              This Month
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2.5">
            {c.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-surface-alt p-3"
              >
                <p className="truncate text-[10px] text-muted-foreground sm:text-xs">
                  {s.label}
                </p>
                <p className="mt-1 font-heading text-sm font-bold sm:text-lg">
                  {s.value}
                </p>
                <p
                  className={cn(
                    "mt-0.5 flex items-center gap-0.5 text-[10px] font-semibold",
                    s.trend === "down"
                      ? "text-accent-red"
                      : "text-accent-green",
                  )}
                >
                  {s.trend === "down" ? (
                    <ArrowDownRight className="size-3" />
                  ) : (
                    <ArrowUpRight className="size-3" />
                  )}
                  {s.change}
                </p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="mt-3 rounded-xl border border-border bg-surface-alt p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold">{c.chartLabel}</p>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                {c.chartLegend.map((l) => (
                  <span key={l.label} className="flex items-center gap-1">
                    <span className={cn("size-2 rounded-full", l.color)} />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex h-28 items-end gap-1.5">
              {c.bars.map((h, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col justify-end gap-0.5"
                >
                  <div
                    className="w-full rounded-sm bg-primary"
                    style={{ height: `${h}%` }}
                  />
                  {c.secondaryBars ? (
                    <div
                      className="w-full rounded-sm bg-accent-blue/60"
                      style={{ height: `${c.secondaryBars[i]}%` }}
                    />
                  ) : (
                    <div
                      className="w-full rounded-sm bg-accent-blue/60"
                      style={{ height: `${Math.max(15, h - 35)}%` }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* List (optional) */}
          {c.list && (
            <div className="mt-3 space-y-2">
              {c.list.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface-alt px-3.5 py-2.5 transition-all hover:shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.meta}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "ml-3 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      item.badgeColor,
                    )}
                  >
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
