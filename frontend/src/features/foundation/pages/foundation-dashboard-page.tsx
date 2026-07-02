"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Phone, Target, TrendingUp, UserPlus, Calendar, Clock, Activity } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Card, CardHeader, CardBody, StatCard, Badge, Skeleton } from "@/components/ui";
import { getLeadStats, getLeads, type LeadStats, type Lead } from "@/services/leads";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

export function FoundationDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, leadsRes] = await Promise.all([
        getLeadStats(),
        getLeads({ page: 1, pageSize: 5, sortBy: "createdAt", sortDir: "desc" }),
      ]);
      setStats(statsRes.data);
      setRecentLeads(leadsRes.data?.data ?? []);
    } catch {
      /* API fallback */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <PageContainer
      title="Foundation Dashboard"
      subtitle="Lead management and admissions overview"
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => router.push("/leads/import")}>
            Import Leads
          </Button>
          <Button size="sm" onClick={() => router.push("/leads/create")}>
            <UserPlus size={16} /> Add Lead
          </Button>
        </div>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Leads" value={stats?.total ?? "--"} icon={<Target size={20} />} />
        <StatCard title="Today's Follow Ups" value={stats?.todayFollowups ?? "--"} icon={<Phone size={20} />} deltaType={stats?.todayFollowups ? "increase" : "neutral"} />
        <StatCard title="Conversion Rate" value={stats ? `${stats.conversionRate}%` : "--"} icon={<TrendingUp size={20} />} deltaType={stats && stats.conversionRate > 0 ? "increase" : "neutral"} />
        <StatCard title="New Leads" value={stats?.new ?? "--"} icon={<UserPlus size={20} />} deltaType="increase" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader><h3 className="text-sm font-semibold">Recent Leads</h3></CardHeader>
              <CardBody className="pt-0"><div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[60px] rounded-[var(--radius-sm)]" />)}</div></CardBody>
            </Card>
          </div>
          <Card>
            <CardHeader><h3 className="text-sm font-semibold">Quick Stats</h3></CardHeader>
            <CardBody className="pt-0"><div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[40px] rounded-[var(--radius-sm)]" />)}</div></CardBody>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Leads */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Activity size={16} className="text-primary" /> Recent Leads
                </h3>
                <Button variant="ghost" size="xs" onClick={() => router.push("/leads")}>View All</Button>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-2">
                  {recentLeads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
                      <Target size={28} className="mb-2 text-text-disabled" />
                      <p className="text-sm font-medium">No leads yet</p>
                      <p className="text-xs mt-1">Start by adding your first lead</p>
                    </div>
                  ) : (
                    recentLeads.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => router.push(`/leads/${lead.id}`)}
                        className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] border border-border p-3 hover:bg-surface-overlay transition-colors text-left"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-xs font-bold text-primary">{lead.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{lead.name}</p>
                          <p className="text-xs text-text-secondary">{lead.phone}{lead.course ? ` · ${lead.course}` : ""}</p>
                        </div>
                        <Badge size="sm" variant={
                          lead.status === "NEW" ? "info" :
                          lead.status === "CONTACTED" ? "brand" :
                          lead.status === "FOLLOWUP" ? "warning" :
                          lead.status === "INTERESTED" ? "success" :
                          lead.status === "DEMO_SCHEDULED" ? "info" :
                          lead.status === "CONVERTED" ? "success" :
                          "danger"
                        }>{lead.status.replace(/_/g, " ")}</Badge>
                      </button>
                    ))
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Calendar size={16} className="text-primary" /> Today&apos;s Follow Ups
                </h3>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="flex flex-col items-center justify-center py-6 text-text-secondary">
                  <Phone size={28} className="mb-2 text-text-disabled" />
                  <p className="text-sm font-medium">{stats?.todayFollowups ?? 0} follow ups today</p>
                  <Button size="xs" variant="ghost" className="mt-2" onClick={() => router.push("/followups")}>View all</Button>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Clock size={16} className="text-warning" /> Pending Follow Ups
                </h3>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="flex flex-col items-center justify-center py-6 text-text-secondary">
                  <Clock size={28} className="mb-2 text-text-disabled" />
                  <p className="text-sm font-medium">{stats?.pendingFollowups ?? 0} pending</p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Target size={16} className="text-primary" /> Lead Status
                </h3>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-2">
                  {[
                    { label: "New", value: stats?.new ?? 0, color: "bg-info" },
                    { label: "Contacted", value: stats?.contacted ?? 0, color: "bg-primary" },
                    { label: "Converted", value: stats?.converted ?? 0, color: "bg-success" },
                    { label: "Lost", value: stats?.lost ?? 0, color: "bg-danger" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", item.color)} />
                        <span className="text-xs text-text-secondary">{item.label}</span>
                      </div>
                      <span className="text-sm font-medium tabular-nums">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
