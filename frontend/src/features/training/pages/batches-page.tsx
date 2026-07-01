"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Layers, Edit3, Archive, RotateCcw, Copy, Users, Calendar, BarChart3, Eye, UserPlus, GraduationCap, Clock, ListOrdered } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Table, Badge, Pagination, SearchBar, FilterBar, Modal, ConfirmModal, Card, StatCard, Skeleton, Input, Select as UiSelect } from "@/components/ui";
import { BatchForm } from "../components/BatchForm";
import { getBatches, createBatch, updateBatch, updateBatchStatus, archiveBatch, restoreBatch, duplicateBatch, getBatchStats, getBatchStudents, getBatchSchedules, getBatchAttendance, getBatchProgress, getBatchWaitlist, getBatchCapacity, getCourses, assignTrainerToBatch, getTrainers, type Batch, type BatchStats, type Course, type ScheduleEvent, type WaitlistEntry, type Trainer } from "@/services/training";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

export function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [stats, setStats] = useState<BatchStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Batch | null>(null);
  const [restoreConfirm, setRestoreConfirm] = useState<Batch | null>(null);
  const [duplicateName, setDuplicateName] = useState("");
  const [duplicateTarget, setDuplicateTarget] = useState<Batch | null>(null);
  const [detailBatch, setDetailBatch] = useState<Batch | null>(null);
  const [detailTab, setDetailTab] = useState("students");
  const [detailData, setDetailData] = useState<Record<string, unknown>>({});
  const [detailLoading, setDetailLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [assignTrainerOpen, setAssignTrainerOpen] = useState(false);
  const [assignBatchId, setAssignBatchId] = useState<string | null>(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState("");
  const pageSize = 10;

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBatches({ page, pageSize, search, status: activeFilters.status, sortBy: sortKey, sortDir });
      setBatches(res.data ?? []);
      setTotal(res.meta?.total ?? res.data?.length ?? 0);
    } catch {
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeFilters, sortKey, sortDir]);

  const fetchMeta = useCallback(async () => {
    try {
      const [statsRes, coursesRes, trainersRes] = await Promise.all([getBatchStats(), getCourses(), getTrainers({ pageSize: 100 })]);
      setStats(statsRes.data);
      setCourses(coursesRes.data ?? []);
      setTrainers(trainersRes.data ?? []);
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

  const handleStatusChange = async (batch: Batch, newStatus: string) => {
    try {
      await updateBatchStatus(batch.id, newStatus);
      toast.success(`Batch status changed to ${newStatus}`);
      fetchBatches();
    } catch {
      toast.error("Failed to update batch status");
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

  const handleRestore = async (batch: Batch) => {
    try {
      await restoreBatch(batch.id);
      toast.success("Batch restored");
      setRestoreConfirm(null);
      fetchBatches();
      fetchMeta();
    } catch {
      toast.error("Failed to restore batch");
    }
  };

  const handleDuplicate = async () => {
    if (!duplicateTarget || !duplicateName.trim()) return;
    try {
      await duplicateBatch(duplicateTarget.id, duplicateName.trim());
      toast.success("Batch duplicated");
      setDuplicateTarget(null);
      setDuplicateName("");
      fetchBatches();
    } catch {
      toast.error("Failed to duplicate batch");
    }
  };

  const handleAssignTrainer = async () => {
    if (!assignBatchId || !selectedTrainerId) return;
    try {
      await assignTrainerToBatch(selectedTrainerId, assignBatchId);
      toast.success("Trainer assigned to batch");
      setAssignTrainerOpen(false);
      setSelectedTrainerId("");
    } catch {
      toast.error("Failed to assign trainer");
    }
  };

  const openDetail = async (batch: Batch) => {
    setDetailBatch(batch);
    setDetailTab("students");
    setDetailLoading(true);
    setDetailData({});
    try {
      const [students, schedules, capacity] = await Promise.all([
        getBatchStudents(batch.id).catch(() => ({ data: [] })),
        getBatchSchedules(batch.id).catch(() => ({ data: [] })),
        getBatchCapacity(batch.id).catch(() => ({ data: null })),
      ]);
      setDetailData({ students: students.data ?? [], schedules: schedules.data ?? [], capacity: capacity.data });
    } catch { /* ignore */ }
    setDetailLoading(false);
  };

  const loadDetailTab = async (tab: string, batchId: string) => {
    setDetailTab(tab);
    setDetailLoading(true);
    try {
      if (tab === "students") {
        const res = await getBatchStudents(batchId).catch(() => ({ data: [] }));
        setDetailData((prev) => ({ ...prev, students: res.data ?? [] }));
      } else if (tab === "schedules") {
        const res = await getBatchSchedules(batchId).catch(() => ({ data: [] }));
        setDetailData((prev) => ({ ...prev, schedules: res.data ?? [] }));
      } else if (tab === "attendance") {
        const res = await getBatchAttendance(batchId).catch(() => ({ data: null }));
        setDetailData((prev) => ({ ...prev, attendance: res.data }));
      } else if (tab === "progress") {
        const res = await getBatchProgress(batchId).catch(() => ({ data: [] }));
        setDetailData((prev) => ({ ...prev, progress: res.data ?? [] }));
      } else if (tab === "waitlist") {
        const res = await getBatchWaitlist(batchId).catch(() => ({ data: [] }));
        setDetailData((prev) => ({ ...prev, waitlist: res.data ?? [] }));
      } else if (tab === "capacity") {
        const res = await getBatchCapacity(batchId).catch(() => ({ data: null }));
        setDetailData((prev) => ({ ...prev, capacity: res.data }));
      }
    } catch { /* ignore */ }
    setDetailLoading(false);
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
      <button onClick={() => openDetail(row)} className="flex items-center gap-3 text-left">
        <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-primary/10">
          <Layers size={14} className="text-primary" />
        </div>
        <div>
          <p className="font-medium text-text-primary">{row.name}</p>
          {row.code && <p className="text-xs text-text-secondary">{row.code}</p>}
        </div>
      </button>
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
      <UiSelect
        value={row.status}
        onChange={(e) => !e.target.value.startsWith("__") && handleStatusChange(row, e.target.value)}
        options={[
          { value: "__current", label: row.status, disabled: true },
          { value: "UPCOMING", label: "Upcoming" },
          { value: "ACTIVE", label: "Active" },
          { value: "COMPLETED", label: "Completed" },
          { value: "CANCELLED", label: "Cancelled" },
        ]}
        className="w-32 h-7 text-xs"
      />
    )},
    { key: "startDate", header: "Duration", render: (row: Batch) => (
      <span className="text-xs text-text-secondary">
        {row.startDate ? new Date(row.startDate).toLocaleDateString() : "-"}
        {row.endDate ? ` - ${new Date(row.endDate).toLocaleDateString()}` : ""}
      </span>
    )},
    { key: "actions", header: "", className: "w-32", render: (row: Batch) => (
      <div className="flex items-center gap-1">
        <Button size="xs" variant="ghost" onClick={() => openDetail(row)} title="View details">
          <Eye size={14} />
        </Button>
        <Button size="xs" variant="ghost" onClick={() => {
          setAssignBatchId(row.id);
          setSelectedTrainerId("");
          setAssignTrainerOpen(true);
        }} title="Assign trainer">
          <UserPlus size={14} />
        </Button>
        <Button size="xs" variant="ghost" onClick={() => { setEditingBatch(row); setModalOpen(true); }} title="Edit">
          <Edit3 size={14} />
        </Button>
        <Button size="xs" variant="ghost" onClick={() => { setDuplicateTarget(row); setDuplicateName(`${row.name} (Copy)`); }} title="Duplicate">
          <Copy size={14} />
        </Button>
        {row.isActive === false ? (
          <Button size="xs" variant="ghost" onClick={() => setRestoreConfirm(row)} title="Restore">
            <RotateCcw size={14} />
          </Button>
        ) : (
          <Button size="xs" variant="ghost" onClick={() => setDeleteConfirm(row)} title="Archive">
            <Archive size={14} />
          </Button>
        )}
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <StatCard title="Batches" value={batches.length} icon={<Layers size={18} />} />
        <StatCard title="Active" value={batches.filter((b) => b.status === "ACTIVE").length} icon={<Layers size={18} />} />
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

      <ConfirmModal
        open={!!restoreConfirm}
        onClose={() => setRestoreConfirm(null)}
        onConfirm={async () => {
          if (restoreConfirm) await handleRestore(restoreConfirm);
        }}
        title="Restore Batch"
        description={`Restore "${restoreConfirm?.name}"?`}
        confirmLabel="Restore"
        intent="info"
      />

      <Modal
        open={!!duplicateTarget}
        onClose={() => { setDuplicateTarget(null); setDuplicateName(""); }}
        title="Duplicate Batch"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Create a copy of &ldquo;{duplicateTarget?.name}&rdquo;</p>
          <Input
            label="New Batch Name"
            required
            value={duplicateName}
            onChange={(e) => setDuplicateName(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => { setDuplicateTarget(null); setDuplicateName(""); }}>Cancel</Button>
            <Button onClick={handleDuplicate} disabled={!duplicateName.trim()}>Duplicate</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={assignTrainerOpen}
        onClose={() => setAssignTrainerOpen(false)}
        title="Assign Trainer to Batch"
        size="sm"
      >
        <div className="space-y-4">
          <UiSelect
            label="Select Trainer"
            placeholder="Choose a trainer"
            value={selectedTrainerId}
            onChange={(e) => setSelectedTrainerId(e.target.value)}
            options={trainers
              .filter((t) => t.status === "ACTIVE")
              .map((t) => ({ value: t.id, label: t.name }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setAssignTrainerOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignTrainer} disabled={!selectedTrainerId}>Assign</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!detailBatch}
        onClose={() => setDetailBatch(null)}
        title={detailBatch?.name ?? "Batch Details"}
        size="xl"
      >
        {detailBatch && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-[var(--radius-md)] bg-surface-raised">
              <Layers size={24} className="text-primary shrink-0" />
              <div className="flex-1">
                <p className="text-lg font-semibold text-text-primary">{detailBatch.name}</p>
                <p className="text-sm text-text-secondary">
                  {detailBatch.code} • Capacity: {detailBatch.capacity} • Status: {detailBatch.status}
                </p>
              </div>
              <Badge variant={statusVariant[detailBatch.status] ?? "outline"}>{detailBatch.status}</Badge>
            </div>

            <div className="flex gap-1 rounded-[var(--radius-sm)] border border-border p-0.5 flex-wrap">
              {["students", "schedules", "attendance", "progress", "waitlist", "capacity"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => loadDetailTab(tab, detailBatch.id)}
                  className={`flex items-center gap-1 rounded-[var(--radius-xs)] px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                    detailTab === tab ? "bg-primary text-primary-foreground" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {detailLoading ? (
              <Skeleton className="h-[200px] rounded-[var(--radius-md)]" />
            ) : detailTab === "students" ? (
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {((detailData.students as Array<Record<string, unknown>>) ?? []).length === 0 ? (
                  <p className="py-8 text-center text-sm text-text-secondary">No students enrolled</p>
                ) : (
                  (detailData.students as Array<Record<string, unknown>>)?.map((s: Record<string, unknown>, i: number) => (
                    <div key={i} className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-border px-4 py-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {String((s.student as Record<string, unknown>)?.name || s.name || "?")?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">{(s.student as Record<string, unknown>)?.name as string || s.name as string}</p>
                        <p className="text-xs text-text-secondary">{(s.student as Record<string, unknown>)?.email as string || s.email as string}</p>
                      </div>
                      <Badge size="sm" variant={(s.status as string) === "ACTIVE" ? "success" : "outline"}>{s.status as string}</Badge>
                    </div>
                  ))
                )}
              </div>
            ) : detailTab === "schedules" ? (
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {((detailData.schedules as Array<Record<string, unknown>>) ?? []).length === 0 ? (
                  <p className="py-8 text-center text-sm text-text-secondary">No schedules defined</p>
                ) : (
                  (detailData.schedules as Array<Record<string, unknown>>)?.map((s: Record<string, unknown>, i: number) => (
                    <div key={i} className="flex items-center gap-4 rounded-[var(--radius-sm)] border border-border px-4 py-2.5">
                      <Calendar size={16} className="text-text-secondary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary">Day {s.dayOfWeek as string}</p>
                        <p className="text-xs text-text-secondary">{s.startTime as string} - {s.endTime as string}{(s.room as string) ? ` • ${s.room}` : ""}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : detailTab === "attendance" ? (
              <p className="py-8 text-center text-sm text-text-secondary">Attendance records loaded. View in attendance section for detailed reporting.</p>
            ) : detailTab === "progress" ? (
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {((detailData.progress as Array<Record<string, unknown>>) ?? []).length === 0 ? (
                  <p className="py-8 text-center text-sm text-text-secondary">No progress records</p>
                ) : (
                  (detailData.progress as Array<Record<string, unknown>>)?.map((p: Record<string, unknown>, i: number) => (
                    <div key={i} className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-border px-4 py-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">{(p.student as Record<string, unknown>)?.name as string || "Student"}</p>
                        <p className="text-xs text-text-secondary">Score: {String(p.score ?? "N/A")} • {p.assessedAt as string ? new Date(p.assessedAt as string).toLocaleDateString() : ""}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : detailTab === "waitlist" ? (
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {((detailData.waitlist as Array<Record<string, unknown>>) ?? []).length === 0 ? (
                  <p className="py-8 text-center text-sm text-text-secondary">No students on waitlist</p>
                ) : (
                  (detailData.waitlist as Array<Record<string, unknown>>)?.map((w: Record<string, unknown>, i: number) => (
                    <div key={i} className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-border px-4 py-2.5">
                      <Clock size={16} className="text-text-secondary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">{(w.student as Record<string, unknown>)?.name as string || w.studentName as string}</p>
                        <p className="text-xs text-text-secondary">Position: {i + 1}{(w as Record<string, unknown>).priority ? ` • Priority: ${w.priority as string}` : ""}</p>
                      </div>
                      <Badge size="sm" variant="warning">WAITING</Badge>
                    </div>
                  ))
                )}
              </div>
            ) : detailTab === "capacity" ? (
              <div className="grid grid-cols-3 gap-4">
                <StatCard title="Capacity" value={detailData.capacity ? (detailData.capacity as Record<string, unknown>).capacity as number : detailBatch.capacity} icon={<Users size={18} />} />
                <StatCard title="Enrolled" value={detailData.capacity ? (detailData.capacity as Record<string, unknown>).enrolled as number : 0} icon={<Users size={18} />} />
                <StatCard title="Available" value={detailData.capacity ? (detailData.capacity as Record<string, unknown>).available as number : 0} icon={<Users size={18} />} />
                <StatCard title="Waitlist" value={detailData.capacity ? (detailData.capacity as Record<string, unknown>).waitlistCount as number : 0} icon={<ListOrdered size={18} />} />
              </div>
            ) : null}
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}