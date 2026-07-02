"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, UserPlus, X, Plus } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Badge, Pagination, Modal, StatCard, Skeleton, Input, Select } from "@/components/ui";
import { WaitlistItem } from "../components/WaitlistItem";
import { getWaitlist, getWaitlistEntry, createWaitlistEntry, promoteWaitlistEntry, withdrawWaitlistEntry, getBatches, type WaitlistEntry, type Batch } from "@/services/training";
import { getStudents, type Student } from "@/services/students";
import { toast } from "sonner";

export function WaitlistsPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailEntry, setDetailEntry] = useState<WaitlistEntry | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    batchId: "",
    studentId: "",
    notes: "",
  });
  const pageSize = 10;

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const entriesRes = await getWaitlist({ page, pageSize });
      setEntries(entriesRes.data ?? []);
      setTotal(entriesRes.meta?.total ?? 0);
    } catch (err: unknown) {
      setEntries([]);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? (err as Error)?.message ?? "Failed to load waitlist";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const fetchFormData = useCallback(async () => {
    const [batchesRes, studentsRes] = await Promise.all([
      getBatches({ pageSize: 100 }).catch(() => ({ data: [] })),
      getStudents().catch(() => ({ data: { items: [] } })),
    ]);
    setBatches(batchesRes.data ?? []);
    setStudents(studentsRes.data?.items ?? []);
  }, []);

  const handlePromote = async (id: string) => {
    setActionLoading(id);
    try {
      await promoteWaitlistEntry(id);
      toast.success("Student promoted to enrollment");
      setDetailEntry(null);
      fetchEntries();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to promote student";
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleWithdraw = async (id: string) => {
    setActionLoading(id);
    try {
      await withdrawWaitlistEntry(id);
      toast.success("Student withdrawn from waitlist");
      setDetailEntry(null);
      fetchEntries();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to withdraw student";
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddEntry = async () => {
    if (!formData.batchId || !formData.studentId) {
      toast.error("Batch and student are required");
      return;
    }
    setSubmitting(true);
    try {
      await createWaitlistEntry({
        batchId: formData.batchId,
        studentId: formData.studentId,
        notes: formData.notes || undefined,
      });
      toast.success("Added to waitlist");
      setAddModalOpen(false);
      setFormData({ batchId: "", studentId: "", notes: "" });
      fetchEntries();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to add to waitlist";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetail = async (id: string) => {
    try {
      const res = await getWaitlistEntry(id);
      setDetailEntry(res.data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to load entry details";
      toast.error(msg);
    }
  };

  const studentOptions = students
    .filter((s) => !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.phone?.includes(studentSearch))
    .map((s) => ({ value: s.id, label: `${s.name} (${s.phone ?? s.email})` }));

  return (
    <PageContainer
      title="Waitlist"
      subtitle="Manage student waitlists"
      actions={
        <Button size="sm" onClick={() => { fetchFormData(); setAddModalOpen(true); }}>
          <Plus size={16} /> Add to Waitlist
        </Button>
      }
    >
      <div className="mb-6">
        <StatCard title="Total Waiting" value={entries.length} icon={<Clock size={18} />} />
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
          <p className="text-xs mt-1">Add students to the waitlist to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <WaitlistItem
              key={entry.id}
              entry={entry}
              position={entry.waitlistPosition ?? 0}
              onPromote={handlePromote}
              onWithdraw={handleWithdraw}
              onViewStudent={handleViewDetail}
              loading={actionLoading === entry.id}
            />
          ))}
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} className="mt-4" />
        </div>
      )}

      <Modal
        open={addModalOpen}
        onClose={() => { setAddModalOpen(false); setFormData({ batchId: "", studentId: "", notes: "" }); }}
        title="Add to Waitlist"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Search Student"
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            placeholder="Type to filter students…"
          />
          <Select
            label="Student"
            required
            placeholder="Select student"
            options={studentOptions}
            value={formData.studentId}
            onChange={(e) => setFormData((p) => ({ ...p, studentId: e.target.value }))}
          />
          <Select
            label="Batch"
            required
            placeholder="Select batch"
            options={batches
              .filter((b) => b.status === "ACTIVE" || b.status === "UPCOMING")
              .map((b) => ({ value: b.id, label: b.name }))}
            value={formData.batchId}
            onChange={(e) => setFormData((p) => ({ ...p, batchId: e.target.value }))}
          />
          <Input
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => { setAddModalOpen(false); setFormData({ batchId: "", studentId: "", notes: "" }); }}>
              Cancel
            </Button>
            <Button onClick={handleAddEntry} loading={submitting}>Add to Waitlist</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!detailEntry}
        onClose={() => setDetailEntry(null)}
        title="Waitlist Entry Details"
        size="md"
      >
        {detailEntry && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-text-secondary">Name</p>
                <p className="text-sm text-text-primary">{detailEntry.student.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Phone</p>
                <p className="text-sm text-text-primary">{detailEntry.student.phone ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Email</p>
                <p className="text-sm text-text-primary">{detailEntry.student.email ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Batch</p>
                <p className="text-sm text-text-primary">{detailEntry.batch?.name ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Position</p>
                <p className="text-sm text-text-primary">#{detailEntry.waitlistPosition ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Status</p>
                <Badge variant={detailEntry.status === "WAITING" ? "warning" : "success"} size="sm">{detailEntry.status}</Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Enrolled</p>
                <p className="text-sm text-text-primary">{new Date(detailEntry.enrolledAt).toLocaleString()}</p>
              </div>
            </div>
            {detailEntry.remarks && (
              <div>
                <p className="text-xs font-medium text-text-secondary">Notes</p>
                <p className="text-sm text-text-primary mt-1">{detailEntry.remarks}</p>
              </div>
            )}
            {detailEntry.status === "WAITING" && (
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => handleWithdraw(detailEntry.id)}>Withdraw</Button>
                <Button onClick={() => handlePromote(detailEntry.id)}>Promote to Enrollment</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}