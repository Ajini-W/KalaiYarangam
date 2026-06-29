"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, UserPlus, X, Search, Filter } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Badge, Pagination, SearchBar, FilterBar, Modal, Card, StatCard, Skeleton } from "@/components/ui";
import { WaitlistItem } from "../components/WaitlistItem";
import { getWaitlist, promoteWaitlistEntry, withdrawWaitlistEntry, type WaitlistEntry } from "@/services/training";
import { toast } from "sonner";

export function WaitlistsPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const pageSize = 10;

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWaitlist({ page, pageSize, search, status: activeFilters.status, batchId: activeFilters.batchId });
      setEntries(res.data ?? []);
      setTotal(res.data?.length ?? 0);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeFilters]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handlePromote = async (id: string) => {
    setActionLoading(id);
    try {
      await promoteWaitlistEntry(id);
      toast.success("Student promoted to enrollment");
      fetchEntries();
    } catch {
      toast.error("Failed to promote student");
    } finally {
      setActionLoading(null);
    }
  };

  const handleWithdraw = async (id: string) => {
    setActionLoading(id);
    try {
      await withdrawWaitlistEntry(id);
      toast.success("Student withdrawn from waitlist");
      fetchEntries();
    } catch {
      toast.error("Failed to withdraw student");
    } finally {
      setActionLoading(null);
    }
  };


  const waitingEntries = entries.filter((e) => e.status === "WAITING");

  const filterDefs = [
    { key: "status", label: "Status", options: [
      { value: "WAITING", label: "Waiting" },
      { value: "PROMOTED", label: "Promoted" },
      { value: "WITHDRAWN", label: "Withdrawn" },
    ]},
  ];

  return (
    <PageContainer
      title="Waitlist"
      subtitle="Manage student waitlists"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <StatCard title="Total Waiting" value={waitingEntries.length} icon={<Clock size={18} />} />
        <StatCard title="Promoted" value={entries.filter((e) => e.status === "PROMOTED").length} icon={<UserPlus size={18} />} />
        <StatCard title="Withdrawn" value={entries.filter((e) => e.status === "WITHDRAWN").length} icon={<X size={18} />} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search waitlist…" className="max-w-xs" />
        <FilterBar filters={filterDefs} active={activeFilters} onChange={(k, v) => setActiveFilters((p) => ({ ...p, [k]: v }))} onClear={() => setActiveFilters({})} />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[80px] rounded-[var(--radius-md)]" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
          <Clock size={40} className="mb-3 text-text-disabled" />
          <p className="text-sm font-medium">No waitlist entries</p>
          <p className="text-xs mt-1">Waitlist is empty</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <WaitlistItem
              key={entry.id}
              entry={entry}
              position={index + 1}
              onPromote={handlePromote}
              onWithdraw={handleWithdraw}
              loading={actionLoading === entry.id}
            />
          ))}
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} className="mt-4" />
        </div>
      )}
    </PageContainer>
  );
}
