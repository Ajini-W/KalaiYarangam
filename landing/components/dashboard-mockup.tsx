import {
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Package,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users, label: 'Leads' },
  { icon: GraduationCap, label: 'Students' },
  { icon: Package, label: 'Inventory' },
  { icon: CalendarDays, label: 'Bookings' },
  { icon: CreditCard, label: 'Payments' },
]

const stats = [
  { label: 'Active Students', value: '1,284', change: '+12.4%' },
  { label: 'Monthly Revenue', value: '₹8.6L', change: '+8.1%' },
  { label: 'Utilization', value: '92%', change: '+3.7%' },
]

const bars = [42, 58, 49, 70, 64, 82, 75, 96, 88, 72, 90, 100]

export function DashboardMockup({
  className,
  role = 'Owner Dashboard',
  title = 'Performance Overview',
}: {
  className?: string
  role?: string
  title?: string
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-brand/10',
        className,
      )}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
        <span className="size-3 rounded-full bg-destructive/70" />
        <span className="size-3 rounded-full bg-amber-400/80" />
        <span className="size-3 rounded-full bg-success/70" />
        <div className="ml-3 hidden flex-1 items-center rounded-md bg-background/80 px-3 py-1 text-xs text-muted-foreground sm:flex">
          app.kalaiyarangam.com/dashboard
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
        {/* Sidebar */}
        <aside className="hidden flex-col gap-1 border-r border-border bg-muted/30 p-3 sm:flex">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm',
                item.active
                  ? 'bg-brand/10 font-medium text-brand'
                  : 'text-muted-foreground',
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
              <p className="text-xs text-muted-foreground">{role}</p>
              <p className="font-heading text-base font-semibold">{title}</p>
            </div>
            <div className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground">
              This Month
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-background/60 p-3"
              >
                <p className="truncate text-[10px] text-muted-foreground sm:text-xs">
                  {s.label}
                </p>
                <p className="mt-1 font-heading text-sm font-bold sm:text-lg">
                  {s.value}
                </p>
                <p className="mt-0.5 flex items-center gap-0.5 text-[10px] font-medium text-success">
                  <ArrowUpRight className="size-3" />
                  {s.change}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-border bg-background/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium">Revenue & Enrollments</p>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-brand" />
                  Revenue
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-accent-cyan" />
                  Enrollments
                </span>
              </div>
            </div>
            <div className="flex h-28 items-end gap-1.5">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col justify-end gap-0.5"
                >
                  <div
                    className="w-full rounded-sm bg-brand"
                    style={{ height: `${h}%` }}
                  />
                  <div
                    className="w-full rounded-sm bg-accent-cyan/60"
                    style={{ height: `${Math.max(15, h - 35)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
