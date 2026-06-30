"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, GraduationCap, Edit3, Archive, Search, Star, UserPlus, UserMinus } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Table, Badge, Pagination, SearchBar, FilterBar, Modal, ConfirmModal, Card, CardHeader, CardBody, StatCard, Skeleton } from "@/components/ui";
import { TrainerAssignmentPanel } from "../components/TrainerAssignmentPanel";
import { getTrainers, getBatches, getTrainerBatches, createTrainer, updateTrainer, archiveTrainer, assignTrainerToBatch, removeTrainerFromBatch, type Trainer, type Batch } from "@/services/training";
import { Input, Select } from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const trainerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  specialization: z.string().optional(),
  qualifications: z.string().optional(),
});

type TrainerFormData = z.infer<typeof trainerSchema>;

export function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [trainerBatches, setTrainerBatches] = useState<Record<string, Batch[]>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Trainer | null>(null);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const pageSize = 10;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TrainerFormData>({
    resolver: zodResolver(trainerSchema),
  });

  const fetchTrainers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTrainers({ page, pageSize, search, status: activeFilters.status, sortBy: sortKey, sortDir });
      setTrainers(res.data ?? []);
      setTotal(res.data?.length ?? 0);
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

  const handleFormSubmit = async (data: TrainerFormData) => {
    setSubmitting(true);
    try {
      if (editingTrainer) {
        await updateTrainer(editingTrainer.id, data);
        toast.success("Trainer updated successfully");
      } else {
        await createTrainer(data);
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

  const handleArchive = async (trainer: Trainer) => {
    try {
      await archiveTrainer(trainer.id);
      toast.success("Trainer archived");
      fetchTrainers();
    } catch {
      toast.error("Failed to archive trainer");
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

  const statusVariant: Record<string, "success" | "warning" | "outline"> = {
    ACTIVE: "success", ON_LEAVE: "warning", INACTIVE: "outline",
  };

  const columns = [
    { key: "name", header: "Trainer", sortable: true, render: (row: Trainer) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {row.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-text-primary">{row.name}</p>
          <p className="text-xs text-text-secondary">{row.email}</p>
        </div>
      </div>
    )},
    { key: "specialization", header: "Specialization", render: (row: Trainer) => (
      <span className="text-sm text-text-secondary">{row.specialization || "-"}</span>
    )},
    { key: "phone", header: "Phone", render: (row: Trainer) => (
      <span className="text-sm text-text-secondary">{row.phone}</span>
    )},
    { key: "status", header: "Status", sortable: true, render: (row: Trainer) => (
      <Badge variant={statusVariant[row.status] ?? "outline"} size="sm">{row.status.replace("_", " ")}</Badge>
    )},
    { key: "workload", header: "Workload", sortable: true, render: (row: Trainer) => (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 w-16 rounded-full bg-surface-overlay overflow-hidden">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${Math.min(row.workload, 100)}%` }}
          />
        </div>
        <span className="text-xs tabular-nums text-text-secondary">{row.workload}%</span>
      </div>
    )},
    { key: "actions", header: "", className: "w-28", render: (row: Trainer) => (
      <div className="flex items-center gap-1">
        <Button size="xs" variant="ghost" onClick={() => {
          setSelectedTrainerId(row.id);
          loadTrainerBatches(row.id);
          setAssignmentOpen(true);
        }} title="Assign batches">
          <UserPlus size={14} />
        </Button>
        <Button size="xs" variant="ghost" onClick={() => {
          setEditingTrainer(row);
          reset({
            name: row.name,
            email: row.email,
            phone: row.phone,
            specialization: row.specialization ?? "",
            qualifications: row.qualifications ?? "",
          });
          setModalOpen(true);
        }} title="Edit">
          <Edit3 size={14} />
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
      { value: "INACTIVE", label: "Inactive" },
      { value: "ON_LEAVE", label: "On Leave" },
    ]},
  ];

  return (
    <PageContainer
      title="Trainers"
      subtitle="Manage trainers and assignments"
      actions={
        <Button size="sm" onClick={() => { setEditingTrainer(null); reset({ name: "", email: "", phone: "", specialization: "", qualifications: "" }); setModalOpen(true); }}>
          <Plus size={16} /> New Trainer
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <StatCard title="Active Trainers" value={trainers.filter((t) => t.status === "ACTIVE").length} icon={<GraduationCap size={18} />} />
        <StatCard title="On Leave" value={trainers.filter((t) => t.status === "ON_LEAVE").length} icon={<GraduationCap size={18} />} />
        <StatCard title="Total" value={trainers.length} icon={<GraduationCap size={18} />} />
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
          <Input label="Specialization" error={errors.specialization?.message} {...register("specialization")} />
          <Input label="Qualifications" error={errors.qualifications?.message} {...register("qualifications")} />
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
        description={`Are you sure you want to archive "${deleteConfirm?.name}"?`}
        confirmLabel="Archive"
        intent="warning"
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
          onSetPrimary={async () => { toast.success("Primary trainer updated"); }}
          trainerBatches={trainerBatches}
        />
      </Modal>
    </PageContainer>
  );
}
