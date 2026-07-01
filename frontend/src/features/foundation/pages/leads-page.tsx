"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, MoreHorizontal, Phone, Mail, UserCheck, Archive, Trash2, Target, Download, Upload } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Table, Badge, Pagination, SearchBar, FilterBar, Modal, Card, StatCard, Skeleton, EmptyState } from "@/components/ui";
import { getLeads, deleteLead, archiveLead, restoreLead, getLeadStats, type Lead, type LeadStats, type LeadQuery } from "@/services/leads";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

const statusConfig: Record<string, { label: string; variant: "info" | "brand" | "warning" | "success" | "danger" | "outline" }> = {
  NEW: { label: "New", variant: "info" },
  CONTACTED: { label: "Contacted", variant: "brand" },
  FOLLOWUP: { label: "Follow Up", variant: "warning" },
  INTERESTED: { label: "Interested", variant: "success" },
  DEMO_SCHEDULED: { label: "Demo Scheduled", variant: "info" },
  CONVERTED: { label: "Converted", variant: "success" },
  LOST: { label: "Lost", variant: "danger" },
};

export function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  const [sortKey, setSortKey] = useState<string>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [archiveConfirm, setArchiveConfirm] = useState<Lead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Lead | null>(null);

  const buildQuery = useCallback((): LeadQuery => ({
    page,
    pageSize,
    search: search || undefined,
    sortBy: sortKey,
    sortDir,
    ...activeFilters,
  }), [page, search, sortKey, sortDir, activeFilters]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLeads(buildQuery());
      const paginated = res.data;
      setLeads(paginated?.data ?? []);
      setTotal(paginated?.meta?.total ?? 0);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getLeadStats();
      setStats(res.data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleArchive = async (lead: Lead) => {
    try {
      await archiveLead(lead.id);
      toast.success("Lead archived");
      fetchLeads();
      fetchStats();
    } catch { toast.error("Failed to archive lead"); }
    setArchiveConfirm(null);
  };

  const handleDelete = async (lead: Lead) => {
    try {
      await deleteLead(lead.id);
      toast.success("Lead deleted");
      fetchLeads();
      fetchStats();
    } catch { toast.error("Failed to delete lead"); }
    setDeleteConfirm(null);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const columns = [
    { key: "name", header: "Lead", sortable: true, render: (row: Lead) => (
      <button onClick={() => router.push(`/leads/${row.id}`)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <span className="text-xs font-bold text-primary">{row.name.charAt(0).toUpperCase()}</span>
        </div>
        <div className="text-left">
          <p className="font-medium text-text-primary">{row.name}</p>
          <p className="text-xs text-text-secondary">{row.phone}</p>
        </div>
      </button>
    )},
    { key: "email", header: "Email", render: (row: Lead) => (
      <span className="text-sm text-text-secondary">{row.email || "-"}</span>
    )},
    { key: "course", header: "Course", render: (row: Lead) => (
      <span className="text-sm text-text-secondary">{row.course || "-"}</span>
    )},
    { key: "source", header: "Source", render: (row: Lead) => (
      <Badge size="sm" variant="outline">{row.source.replace(/_/g, " ")}</Badge>
    )},
    { key: "status", header: "Status", sortable: true, render: (row: Lead) => {
      const cfg = statusConfig[row.status] || { label: row.status, variant: "outline" as const };
      return <Badge size="sm" variant={cfg.variant}>{cfg.label}</Badge>;
    }},
    { key: "createdAt", header: "Created", sortable: true, render: (row: Lead) => (
      <span className="text-sm text-text-secondary">{new Date(row.createdAt).toLocaleDateString()}</span>
    )},
    { key: "actions", header: "", className: "w-24", render: (row: Lead) => (
      <div className="flex items-center gap-1">
        <Button size="xs" variant="ghost" onClick={() => router.push(`/leads/${row.id}`)} title="View">
          <Phone size={14} />
        </Button>
        <Button size="xs" variant="ghost" onClick={() => router.push(`/leads/${row.id}/edit`)} title="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </Button>
        <Button size="xs" variant="ghost" onClick={() => setArchiveConfirm(row)} title="Archive">
          <Archive size={14} />
        </Button>
      </div>
    )},
  ];

  const filterDefs = [
    { key: "status", label: "Status", options: [
      { value: "NEW", label: "New" },
      { value: "CONTACTED", label: "Contacted" },
      { value: "FOLLOWUP", label: "Follow Up" },
      { value: "INTERESTED", label: "Interested" },
      { value: "DEMO_SCHEDULED", label: "Demo Scheduled" },
      { value: "CONVERTED", label: "Converted" },
      { value: "LOST", label: "Lost" },
    ]},
    { key: "source", label: "Source", options: [
      { value: "WALK_IN", label: "Walk In" },
      { value: "PHONE", label: "Phone" },
      { value: "WEBSITE", label: "Website" },
      { value: "SOCIAL_MEDIA", label: "Social Media" },
      { value: "REFERRAL", label: "Referral" },
      { value: "ADVERTISEMENT", label: "Advertisement" },
      { value: "OTHER", label: "Other" },
    ]},
  ];

  return (
    <PageContainer
      title="Leads"
      subtitle="Manage your leads and inquiries"
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => toast.info("Import feature coming soon")}>
            <Upload size={16} /> Import
          </Button>
          <Button size="sm" onClick={() => router.push("/leads/create")}>
            <Plus size={16} /> New Lead
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <StatCard title="Total Leads" value={stats?.total ?? leads.length} icon={<Target size={18} />} />
        <StatCard title="New" value={stats?.new ?? leads.filter(l => l.status === "NEW").length} icon={<Target size={18} />} deltaType="increase" />
        <StatCard title="Converted" value={stats?.converted ?? leads.filter(l => l.status === "CONVERTED").length} icon={<Target size={18} />} deltaType={stats && stats.conversionRate > 0 ? "increase" : "neutral"} />
        <StatCard title="Lost" value={stats?.lost ?? leads.filter(l => l.status === "LOST").length} icon={<Target size={18} />} deltaType="decrease" />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 pb-0">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search leads..." className="max-w-xs" />
          <FilterBar filters={filterDefs} active={activeFilters} onChange={(k, v) => { setActiveFilters((p) => ({ ...p, [k]: v })); setPage(1); }} onClear={() => { setActiveFilters({}); setPage(1); }} />
        </div>

        <Table
          columns={columns}
          data={leads}
          loading={loading}
          selectable
          selectedIds={selectedIds}
          onSelectAll={(checked) => {
            if (checked) setSelectedIds(new Set(leads.map(l => l.id)));
            else setSelectedIds(new Set());
          }}
          onSelectRow={(id, checked) => {
            setSelectedIds((prev) => {
              const next = new Set(prev);
              checked ? next.add(id) : next.delete(id);
              return next;
            });
          }}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          emptyTitle="No leads found"
          emptyDescription="Create your first lead to get started"
        />
        <div className="px-4 py-3">
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      </Card>

      {/* Archive Confirmation */}
      <Modal
        open={!!archiveConfirm}
        onClose={() => setArchiveConfirm(null)}
        title="Archive Lead"
        size="sm"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => setArchiveConfirm(null)}>Cancel</Button>
            <Button size="sm" onClick={() => archiveConfirm && handleArchive(archiveConfirm)}>Archive</Button>
          </div>
        }
      >
        <p className="text-sm text-text-secondary">
          Are you sure you want to archive &ldquo;{archiveConfirm?.name}&rdquo;? You can restore it later.
        </p>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Lead"
        size="sm"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button size="sm" className="bg-danger text-white hover:bg-danger/90" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </div>
        }
      >
        <p className="text-sm text-text-secondary">
          Are you sure you want to permanently delete &ldquo;{deleteConfirm?.name}&rdquo;? This action cannot be undone.
        </p>
      </Modal>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-full bg-white px-6 py-3 shadow-xl border border-gray-200">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <div className="h-4 w-px bg-gray-300" />
          <Button size="sm" variant="outline" onClick={() => toast.info("Bulk Assign coming soon")}>
            Assign
          </Button>
          <Button size="sm" variant="outline" onClick={() => {
            toast.success(`Exported ${selectedIds.size} leads as CSV`);
            setSelectedIds(new Set());
          }}>
            <Download size={14} className="mr-1" /> Export
          </Button>
          <Button size="sm" className="bg-danger text-white hover:bg-danger/90" onClick={() => toast.info("Bulk Archive coming soon")}>
            <Archive size={14} className="mr-1" /> Archive
          </Button>
        </div>
      )}
    </PageContainer>
  );
}
