"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Layers, Edit3, Archive, Copy, Users, Calendar, BarChart3, Eye } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Table, Badge, Pagination, SearchBar, FilterBar, Modal, ConfirmModal, Card, StatCard, Skeleton } from "@/components/ui";
import { BatchForm } from "../components/BatchForm";
import { getBatches, createBatch, updateBatch, archiveBatch, restoreBatch, duplicateBatch, getBatchStats, getCourses, type Batch, type BatchStats, type Course } from "@/services/training";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

export function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [stats, setStats] = useState<BatchStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Batch | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const pageSize = 10;

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBatches({ page, pageSize, search, status: activeFilters.status, sortBy: sortKey, sortDir });
      setBatches(res.data ?? []);
      setTotal(res.data?.length ?? 0);
    } catch {
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeFilters, sortKey, sortDir]);

  const fetchMeta = useCallback(async () => {
    try {
      const [statsRes, coursesRes] = await Promise.all([getBatchStats(), getCourses()]);
      setStats(statsRes.data);
      setCourses(coursesRes.data ?? []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchBatches(); }, [fetchBatches]);
  useEffect(() => { fetchMeta(); }, [fetchMeta]);

  const handleSubmit = async (formData: { name: string; code?: string; courseId?: string; capacity: string; startDate?: string; endDate?: string; status?: string }) => {
    const payload = { ...formData, capacity: Number(formData.capacity) } as unknown as Partial<Batch>;
    setSubmitting(true);
    try {
      if (editingBatch) {
        await updateBatch(editingBatch.id, payload);
        toast.success("Batch updated successfully");
      } else {
        await createBatch(payload);
        toast.success("Batch created successfully");
      }
      setModalOpen(false);
      setEditingBatch(null);
      fetchBatches();
      fetchMeta();
    } catch {
      toast.error("Failed to save batch");
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (batch: Batch) => {
    try {
      await archiveBatch(batch.id);
      toast.success("Batch archived");
      fetchBatches();
      fetchMeta();
    } catch {
      toast.error("Failed to archive batch");
    }
  };

  const handleDuplicate = async (batch: Batch) => {
    try {
      await duplicateBatch(batch.id);
      toast.success("Batch duplicated");
      fetchBatches();
    } catch {
      toast.error("Failed to duplicate batch");
    }
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const statusVariant: Record<string, "success" | "warning" | "info" | "danger"> = {
    ACTIVE: "success", UPCOMING: "info", COMPLETED: "warning", CANCELLED: "danger",
  };

  const occupancyColor = (enrolled: number, capacity: number) => {
    const rate = capacity > 0 ? enrolled / capacity : 0;
    if (rate >= 1) return "bg-danger";
    if (rate >= 0.75) return "bg-warning";
    return "bg-success";
  };

  const columns = [
    { key: "name", header: "Batch", sortable: true, render: (row: Batch) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-primary/10">
          <Layers size={14} className="text-primary" />
        </div>
        <div>
          <p className="font-medium text-text-primary">{row.name}</p>
          {row.code && <p className="text-xs text-text-secondary">{row.code}</p>}
        </div>
      </div>
    )},
    { key: "course", header: "Program", render: (row: Batch) => (
      <span className="text-sm text-text-secondary">{row.course?.name || "-"}</span>
    )},
    { key: "capacity", header: "Capacity", sortable: true, render: (row: Batch) => {
      const enrolled = row._count?.enrollments ?? row.enrolled ?? 0;
      const occupancy = row.capacity > 0 ? Math.round((enrolled / row.capacity) * 100) : 0;
      return (
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className="flex-1 h-2 rounded-full bg-surface-overlay overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", occupancyColor(enrolled, row.capacity))} style={{ width: `${Math.min(occupancy, 100)}%` }} />
          </div>
          <span className="text-xs font-medium tabular-nums text-text-secondary">{enrolled}/{row.capacity}</span>
        </div>
      );
    }},
    { key: "status", header: "Status", sortable: true, render: (row: Batch) => (
      <Badge variant={statusVariant[row.status] ?? "outline"} size="sm">{row.status}</Badge>
    )},
    { key: "startDate", header: "Duration", render: (row: Batch) => (
      <span className="text-xs text-text-secondary">
        {row.startDate ? new Date(row.startDate).toLocaleDateString() : "-"}
        {row.endDate ? ` - ${new Date(row.endDate).toLocaleDateString()}` : ""}
      </span>
    )},
    { key: "actions", header: "", className: "w-24", render: (row: Batch) => (
      <div className="flex items-center gap-1">
        <Button size="xs" variant="ghost" onClick={() => { setEditingBatch(row); setModalOpen(true); }} title="Edit">
          <Edit3 size={14} />
        </Button>
        <Button size="xs" variant="ghost" onClick={() => handleDuplicate(row)} title="Duplicate">
          <Copy size={14} />
        </Button>
        <Button size="xs" variant="ghost" onClick={() => setDeleteConfirm(row)} title="Archive">
          <Archive size={14} />
        </Button>
      </div>
    )},
  ];

  const filterDefs = [
    { key: "status", label: "Status", options: [
      { value: "ACTIVE", label: "Active" },
      { value: "UPCOMING", label: "Upcoming" },
      { value: "COMPLETED", label: "Completed" },
      { value: "CANCELLED", label: "Cancelled" },
    ]},
  ];

  return (
    <PageContainer
      title="Batches"
      subtitle="Manage training batches"
      actions={
        <Button size="sm" onClick={() => { setEditingBatch(null); setModalOpen(true); }}>
          <Plus size={16} /> New Batch
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <StatCard title="Active Batches" value={batches.filter((b) => b.status === "ACTIVE").length} icon={<Layers size={18} />} />
        <StatCard title="Total Capacity" value={batches.reduce((acc, b) => acc + b.capacity, 0)} icon={<Users size={18} />} />
        <StatCard title="Total Enrolled" value={batches.reduce((acc, b) => acc + (b._count?.enrollments ?? b.enrolled ?? 0), 0)} icon={<BarChart3 size={18} />} />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 pb-0">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search batches…" className="max-w-xs" />
          <FilterBar filters={filterDefs} active={activeFilters} onChange={(k, v) => setActiveFilters((p) => ({ ...p, [k]: v }))} onClear={() => setActiveFilters({})} />
        </div>
        <Table
          columns={columns}
          data={batches}
          loading={loading}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          emptyTitle="No batches found"
          emptyDescription="Create your first batch to get started"
        />
        <div className="px-4 py-3">
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingBatch(null); }}
        title={editingBatch ? "Edit Batch" : "Create Batch"}
        size="md"
      >
        <BatchForm
          initialData={editingBatch}
          courses={courses}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditingBatch(null); }}
          loading={submitting}
        />
      </Modal>

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={async () => {
          if (deleteConfirm) await handleArchive(deleteConfirm);
          setDeleteConfirm(null);
        }}
        title="Archive Batch"
        description={`Are you sure you want to archive "${deleteConfirm?.name}"?`}
        confirmLabel="Archive"
        intent="warning"
      />
    </PageContainer>
  );
}
