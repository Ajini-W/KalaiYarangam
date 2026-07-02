"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Phone, Calendar, Clock, Activity, MessageSquare, Filter, CheckCircle2, XCircle } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Card, CardHeader, CardBody, Badge, SearchBar, Pagination, Skeleton } from "@/components/ui";
import { getLeads, type Lead } from "@/services/leads";
import { cn } from "@/lib/cn";

export function FollowupsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLeads({
        page,
        pageSize,
        search: search || undefined,
        sortBy: "nextFollowUp",
        sortDir: "asc",
      });
      const paginated = res.data;
      setLeads(paginated?.data?.filter((l: Lead) => l.nextFollowUp) ?? []);
      setTotal(paginated?.meta?.total ?? 0);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const isOverdue = (date: string) => new Date(date) < new Date();
  const isToday = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  return (
    <PageContainer
      title="Follow-ups"
      subtitle="Track and manage lead follow-ups"
      actions={
        <div className="flex gap-2">
          <Button size="xs" variant={viewMode === "list" ? "primary" : "outline"} onClick={() => setViewMode("list")}>
            <Activity size={14} /> List
          </Button>
          <Button size="xs" variant={viewMode === "calendar" ? "primary" : "outline"} onClick={() => setViewMode("calendar")}>
            <Calendar size={14} /> Calendar
          </Button>
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search leads..." className="max-w-xs" />
      </div>

      {viewMode === "list" ? (
        <Card>
          <CardBody className="pt-5">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[72px] rounded-[var(--radius-sm)]" />)}
              </div>
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
                <Phone size={32} className="mb-3 text-text-disabled" />
                <p className="text-sm font-medium">No follow-ups scheduled</p>
                <p className="text-xs mt-1">Leads with follow-up dates will appear here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leads.map((lead) => {
                  const overdue = lead.nextFollowUp ? isOverdue(lead.nextFollowUp) : false;
                  const today = lead.nextFollowUp ? isToday(lead.nextFollowUp) : false;

                  return (
                    <button
                      key={lead.id}
                      onClick={() => router.push(`/leads/${lead.id}`)}
                      className="flex w-full items-center gap-4 rounded-[var(--radius-sm)] border border-border p-4 hover:bg-surface-overlay transition-colors text-left"
                    >
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
                        overdue ? "bg-danger/10" : today ? "bg-warning/10" : "bg-primary/10"
                      )}>
                        <Phone size={16} className={cn(
                          overdue ? "text-danger" : today ? "text-warning" : "text-primary"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">{lead.name}</p>
                        <p className="text-xs text-text-secondary">{lead.phone}{lead.course ? ` · ${lead.course}` : ""}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {lead.nextFollowUp && (
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className={cn(overdue ? "text-danger" : today ? "text-warning" : "text-text-secondary")} />
                            <span className={cn(
                              "text-xs font-medium",
                              overdue ? "text-danger" : today ? "text-warning" : "text-text-secondary"
                            )}>
                              {new Date(lead.nextFollowUp).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <Badge size="sm" variant={
                          lead.status === "NEW" ? "info" :
                          lead.status === "FOLLOWUP" ? "warning" : "brand"
                        } className="mt-1">{lead.status.replace(/_/g, " ")}</Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            <div className="mt-4">
              <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="pt-5">
            <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
              <Calendar size={32} className="mb-3 text-text-disabled" />
              <p className="text-sm font-medium">Calendar view coming soon</p>
              <p className="text-xs mt-1">Switch to list view to see follow-ups</p>
            </div>
          </CardBody>
        </Card>
      )}
    </PageContainer>
  );
}
