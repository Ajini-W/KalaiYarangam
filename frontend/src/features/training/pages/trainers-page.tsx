"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, GraduationCap, Edit3, Archive, RotateCcw, Search, UserPlus, UserMinus, Eye, Calendar, BarChart3 } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Table, Badge, Pagination, SearchBar, FilterBar, Modal, ConfirmModal, Card, CardHeader, CardBody, StatCard, Skeleton, Input } from "@/components/ui";
import { TrainerAssignmentPanel } from "../components/TrainerAssignmentPanel";
import { getTrainers, getBatches, getTrainerBatches, getTrainerSchedule, getTrainerWorkload, createTrainer, updateTrainer, updateTrainerStatus, archiveTrainer, restoreTrainer, assignTrainerToBatch, removeTrainerFromBatch, type Trainer, type Batch, type ScheduleEvent } from "@/services/training";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const trainerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  specialties: z.string().optional(),
  notes: z.string().optional(),
});

type TrainerFormData = z.infer<typeof trainerSchema>;

export function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [trainerBatches, setTrainerBatches] = useState<Record<string, Batch[]>>({});
  const [trainerSchedule, setTrainerSchedule] = useState<Record<string, ScheduleEvent[]>>({});
  const [trainerWorkload, setTrainerWorkload] = useState<Record<string, { batchCount: number; upcomingSessions: number; totalStudents: number }>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Trainer | null>(null);
  const [restoreConfirm, setRestoreConfirm] = useState<Trainer | null>(null);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);
  const [detailTrainer, setDetailTrainer] = useState<Trainer | null>(null);
  const [detailTab, setDetailTab] = useState<string>("batches");
  const [submitting, setSubmitting] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [workloadLoading, setWorkloadLoading] = useState<string | null>(null);
  const pageSize = 10;

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<TrainerFormData>({
    resolver: zodResolver(trainerSchema),
  });

  const fetchTrainers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTrainers({ page, pageSize, search, status: activeFilters.status, sortBy: sortKey, sortDir });
      setTrainers(res.data ?? []);
      setTotal(res.meta?.total ?? res.data?.length ?? 0);
    } catch {
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeFilters, sortKey, sortDir]);

  const fetchMeta = useCallback(async () => {
    try {
      const batchRes = await getBatches({ pageSize: 100 });
      setBatches(batchRes.data ?? []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchTrainers(); }, [fetchTrainers]);
  useEffect(() => { fetchMeta(); }, [fetchMeta]);

  const loadTrainerBatches = async (trainerId: string) => {
    if (trainerBatches[trainerId]) return;
    try {
      const res = await getTrainerBatches(trainerId);
      setTrainerBatches((prev) => ({ ...prev, [trainerId]: res.data ?? [] }));
    } catch { /* ignore */ }
  };

  const loadTrainerDetail = async (trainer: Trainer) => {
    setDetailTrainer(trainer);
    setDetailTab("batches");
    if (!trainerBatches[trainer.id]) {
      try {
        const [batchesRes, scheduleRes, workloadRes] = await Promise.all([
          getTrainerBatches(trainer.id),
          getTrainerSchedule(trainer.id),
          getTrainerWorkload(trainer.id),
        ]);
        setTrainerBatches((prev) => ({ ...prev, [trainer.id]: batchesRes.data ?? [] }));
        setTrainerSchedule((prev) => ({ ...prev, [trainer.id]: scheduleRes.data ?? [] }));
        setTrainerWorkload((prev) => ({ ...prev, [trainer.id]: workloadRes.data ?? { batchCount: 0, upcomingSessions: 0, totalStudents: 0 } }));
      } catch { /* ignore */ }
    } else {
      try {
        const [scheduleRes, workloadRes] = await Promise.all([
          getTrainerSchedule(trainer.id),
          getTrainerWorkload(trainer.id),
        ]);
        setTrainerSchedule((prev) => ({ ...prev, [trainer.id]: scheduleRes.data ?? [] }));
        setTrainerWorkload((prev) => ({ ...prev, [trainer.id]: workloadRes.data ?? { batchCount: 0, upcomingSessions: 0, totalStudents: 0 } }));
      } catch { /* ignore */ }
    }
  };

  const handleFormSubmit = async (formData: TrainerFormData) => {
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialties: formData.specialties || undefined,
        notes: formData.notes || undefined,
      };
      if (editingTrainer) {
        await updateTrainer(editingTrainer.id, payload);
        toast.success("Trainer updated successfully");
      } else {
        await createTrainer({ ...payload, password: formData.password } as Record<string, unknown>);
        toast.success("Trainer created successfully");
      }
      setModalOpen(false);
      setEditingTrainer(null);
      reset();
      fetchTrainers();
    } catch {
      toast.error("Failed to save trainer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = async (trainer: Trainer) => {
    try {
      await updateTrainerStatus(trainer.id, trainer.status !== "ACTIVE");
      toast.success(`Trainer ${trainer.status === "ACTIVE" ? "deactivated" : "activated"} successfully`);
      fetchTrainers();
    } catch {
      toast.error("Failed to update trainer status");
    }
  };

  const handleArchive = async (trainer: Trainer) => {
    try {
      await archiveTrainer(trainer.id);
      toast.success("Trainer archived");
      fetchTrainers();
    } catch {
      toast.error("Failed to archive trainer");
    }
  };

  const handleRestore = async (trainer: Trainer) => {
    try {
      await restoreTrainer(trainer.id);
      toast.success("Trainer restored");
      setRestoreConfirm(null);
      fetchTrainers();
    } catch {
      toast.error("Failed to restore trainer");
    }
  };

  const handleAssign = async (trainerId: string, batchId: string) => {
    try {
      await assignTrainerToBatch(trainerId, batchId);
      toast.success("Trainer assigned to batch");
      const res = await getTrainerBatches(trainerId);
      setTrainerBatches((prev) => ({ ...prev, [trainerId]: res.data ?? [] }));
    } catch {
      toast.error("Failed to assign trainer");
    }
  };

  const handleRemove = async (trainerId: string, batchId: string) => {
    try {
      await removeTrainerFromBatch(trainerId, batchId);
      toast.success("Trainer removed from batch");
      const res = await getTrainerBatches(trainerId);
      setTrainerBatches((prev) => ({ ...prev, [trainerId]: res.data ?? [] }));
    } catch {
      toast.error("Failed to remove trainer");
    }
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const openEditModal = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setValue("name", trainer.name);
    setValue("email", trainer.email);
    setValue("phone", trainer.phone);
    setValue("password", "");
    setValue("specialties", "");
    setValue("notes", "");
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTrainer(null);
    reset({ name: "", email: "", phone: "", password: "", specialties: "", notes: "" });
    setModalOpen(true);
  };

  const statusBadgeVariant: Record<string, "success" | "warning" | "outline" | "danger"> = {
    ACTIVE: "success", INACTIVE: "outline", SUSPENDED: "danger",
  };

  const columns = [
    { key: "name", header: "Trainer", sortable: true, render: (row: Trainer) => (
      <button onClick={() => loadTrainerDetail(row)} className="flex items-center gap-3 text-left">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {row.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-text-primary">{row.name}</p>
          <p className="text-xs text-text-secondary">{row.email}</p>
        </div>
      </button>
    )},
    { key: "phone", header: "Phone", render: (row: Trainer) => (
      <span className="text-sm text-text-secondary">{row.phone}</span>
    )},
    { key: "batches", header: "Batches", render: (row: Trainer) => (
      <span className="text-sm text-text-secondary tabular-nums">{row._count?.batchTrainers ?? 0}</span>
    )},
    { key: "status", header: "Status", sortable: true, render: (row: Trainer) => (
      <Badge variant={row.status === "ACTIVE" ? "success" : row.status === "SUSPENDED" ? "danger" : "outline"} size="sm">
        {row.status}
      </Badge>
    )},
    { key: "actions", header: "", className: "w-36", render: (row: Trainer) => (
      <div className="flex items-center gap-1">
        <Button size="xs" variant="ghost" onClick={() => loadTrainerDetail(row)} title="View details">
          <Eye size={14} />
        </Button>
        <Button size="xs" variant="ghost" onClick={() => {
          setSelectedTrainerId(row.id);
          loadTrainerBatches(row.id);
          setAssignmentOpen(true);
        }} title="Assign batches">
          <UserPlus size={14} />
        </Button>
        <Button size="xs" variant="ghost" onClick={() => openEditModal(row)} title="Edit">
          <Edit3 size={14} />
        </Button>
        <Button size="xs" variant="ghost" onClick={() => handleStatusToggle(row)} title={row.status === "ACTIVE" ? "Deactivate" : "Activate"}>
          {row.status === "ACTIVE" ? <UserMinus size={14} /> : <UserPlus size={14} />}
        </Button>
        {row.status === "SUSPENDED" ? (
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
      { value: "INACTIVE", label: "Inactive" },
      { value: "SUSPENDED", label: "Suspended" },
    ]},
  ];

  return (
    <PageContainer
      title="Trainers"
      subtitle="Manage trainers and assignments"
      actions={
        <Button size="sm" onClick={openCreateModal}>
          <Plus size={16} /> New Trainer
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <StatCard title="Active Trainers" value={trainers.filter((t) => t.status === "ACTIVE").length} icon={<GraduationCap size={18} />} />
        <StatCard title="Inactive" value={trainers.filter((t) => t.status === "INACTIVE" || t.status === "SUSPENDED").length} icon={<GraduationCap size={18} />} />
        <StatCard title="Total" value={trainers.length} icon={<GraduationCap size={18} />} />
        <StatCard title="Total Batches" value={trainers.reduce((acc, t) => acc + (t._count?.batchTrainers ?? 0), 0)} icon={<BarChart3 size={18} />} />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 pb-0">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search trainers…" className="max-w-xs" />
          <FilterBar filters={filterDefs} active={activeFilters} onChange={(k, v) => setActiveFilters((p) => ({ ...p, [k]: v }))} onClear={() => setActiveFilters({})} />
        </div>
        <Table
          columns={columns}
          data={trainers}
          loading={loading}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          emptyTitle="No trainers found"
          emptyDescription="Add your first trainer to get started"
        />
        <div className="px-4 py-3">
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTrainer(null); reset(); }}
        title={editingTrainer ? "Edit Trainer" : "Add Trainer"}
        size="md"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input label="Full Name" required error={errors.name?.message} {...register("name")} />
          <Input label="Email" type="email" required error={errors.email?.message} {...register("email")} />
          <Input label="Phone" required error={errors.phone?.message} {...register("phone")} />
          {!editingTrainer && (
            <Input label="Password" type="password" required error={errors.password?.message} {...register("password")} />
          )}
          <Input label="Specialties" error={errors.specialties?.message} {...register("specialties")} />
          <Input label="Notes" error={errors.notes?.message} {...register("notes")} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => { setModalOpen(false); setEditingTrainer(null); reset(); }} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting || submitting}>
              {editingTrainer ? "Update" : "Add Trainer"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={async () => {
          if (deleteConfirm) await handleArchive(deleteConfirm);
          setDeleteConfirm(null);
        }}
        title="Archive Trainer"
        description={`Are you sure you want to archive "${deleteConfirm?.name}"? This will suspend their access.`}
        confirmLabel="Archive"
        intent="warning"
      />

      <ConfirmModal
        open={!!restoreConfirm}
        onClose={() => setRestoreConfirm(null)}
        onConfirm={async () => {
          if (restoreConfirm) await handleRestore(restoreConfirm);
        }}
        title="Restore Trainer"
        description={`Restore "${restoreConfirm?.name}" to active status?`}
        confirmLabel="Restore"
        intent="info"
      />

      <Modal
        open={assignmentOpen}
        onClose={() => setAssignmentOpen(false)}
        title="Trainer Batch Assignment"
        size="xl"
      >
        <TrainerAssignmentPanel
          trainers={trainers}
          assignedBatches={batches}
          onAssign={handleAssign}
          onRemove={handleRemove}
          onSetPrimary={async (trainerId, batchId) => { await assignTrainerToBatch(trainerId, batchId, true); toast.success("Primary trainer updated"); }}
          trainerBatches={trainerBatches}
        />
      </Modal>

      <Modal
        open={!!detailTrainer}
        onClose={() => setDetailTrainer(null)}
        title={detailTrainer?.name ?? "Trainer Details"}
        size="xl"
      >
        {detailTrainer && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-[var(--radius-md)] bg-surface-raised">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                {detailTrainer.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-text-primary">{detailTrainer.name}</p>
                <p className="text-sm text-text-secondary">{detailTrainer.email} • {detailTrainer.phone}</p>
                <Badge variant={detailTrainer.status === "ACTIVE" ? "success" : "outline"} size="sm" className="mt-1">
                  {detailTrainer.status}
                </Badge>
              </div>
            </div>

            <div className="flex gap-1 rounded-[var(--radius-sm)] border border-border p-0.5">
              {["batches", "schedule", "workload"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`flex-1 rounded-[var(--radius-xs)] px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                    detailTab === tab ? "bg-primary text-primary-foreground" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {detailTab === "batches" && (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {(trainerBatches[detailTrainer.id]?.length ?? 0) === 0 ? (
                  <p className="py-8 text-center text-sm text-text-secondary">No batches assigned</p>
                ) : (
                  (trainerBatches[detailTrainer.id] ?? []).map((b: unknown) => {
                    const batch = b as { id: string; name: string; status?: string };
                    return (
                      <div key={batch.id} className="flex items-center justify-between rounded-[var(--radius-sm)] border border-border px-4 py-2.5">
                        <p className="text-sm font-medium text-text-primary">{batch.name}</p>
                        <Badge size="sm" variant={batch.status === "ACTIVE" ? "success" : "outline"}>{batch.status ?? "N/A"}</Badge>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {detailTab === "schedule" && (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {(trainerSchedule[detailTrainer.id]?.length ?? 0) === 0 ? (
                  <p className="py-8 text-center text-sm text-text-secondary">No upcoming sessions</p>
                ) : (
                  (trainerSchedule[detailTrainer.id] ?? []).slice(0, 20).map((s) => (
                    <div key={s.id} className="flex items-center gap-4 rounded-[var(--radius-sm)] border border-border px-4 py-2.5">
                      <div className="text-center min-w-[40px]">
                        <p className="text-xs font-bold text-text-primary">{new Date(s.date).getDate()}</p>
                        <p className="text-[10px] text-text-secondary">{new Date(s.date).toLocaleDateString("en", { month: "short" })}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary truncate">{s.title || s.batch?.name || "Session"}</p>
                        <p className="text-xs text-text-secondary">{s.startTime} - {s.endTime}</p>
                      </div>
                      <Badge size="sm" variant={s.status === "SCHEDULED" ? "info" : s.status === "COMPLETED" ? "success" : "outline"}>{s.status}</Badge>
                    </div>
                  ))
                )}
              </div>
            )}

            {detailTab === "workload" && (
              <div className="grid grid-cols-3 gap-4">
                <StatCard title="Assigned Batches" value={trainerWorkload[detailTrainer.id]?.batchCount ?? 0} icon={<GraduationCap size={18} />} />
                <StatCard title="Upcoming Sessions" value={trainerWorkload[detailTrainer.id]?.upcomingSessions ?? 0} icon={<Calendar size={18} />} />
                <StatCard title="Total Students" value={trainerWorkload[detailTrainer.id]?.totalStudents ?? 0} icon={<BarChart3 size={18} />} />
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}