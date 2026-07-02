"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, UserPlus, X, Search, Filter, Plus } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Badge, Pagination, SearchBar, FilterBar, Modal, Card, StatCard, Skeleton, Input, Select } from "@/components/ui";
import { WaitlistItem } from "../components/WaitlistItem";
import { getWaitlist, getWaitlistEntry, createWaitlistEntry, updateWaitlistEntry, promoteWaitlistEntry, withdrawWaitlistEntry, getBatches, type WaitlistEntry, type Batch } from "@/services/training";
import { toast } from "sonner";

export function WaitlistsPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailEntry, setDetailEntry] = useState<WaitlistEntry | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    batchId: "",
    studentName: "",
    studentPhone: "",
    studentEmail: "",
    priority: "MEDIUM" as string,
    notes: "",
  });
  const pageSize = 10;

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const [entriesRes, batchesRes] = await Promise.all([
        getWaitlist({ page, pageSize, search, status: activeFilters.status, batchId: activeFilters.batchId }),
        getBatches({ pageSize: 100 }),
      ]);
      setEntries(entriesRes.data ?? []);
      setTotal(entriesRes.data?.length ?? 0);
      setBatches(batchesRes.data ?? []);
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

  const handleAddEntry = async () => {
    if (!formData.studentName || !formData.studentPhone) {
      toast.error("Name and phone are required");
      return;
    }
    setSubmitting(true);
    try {
      await createWaitlistEntry({
        batchId: formData.batchId,
        studentName: formData.studentName,
        studentPhone: formData.studentPhone,
        studentEmail: formData.studentEmail || undefined,
        priority: formData.priority,
        notes: formData.notes || undefined,
      } as unknown as Partial<WaitlistEntry>);
      toast.success("Added to waitlist");
      setAddModalOpen(false);
      setFormData({ batchId: "", studentName: "", studentPhone: "", studentEmail: "", priority: "MEDIUM", notes: "" });
      fetchEntries();
    } catch {
      toast.error("Failed to add to waitlist");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetail = async (id: string) => {
    try {
      const res = await getWaitlistEntry(id);
      setDetailEntry(res.data);
    } catch {
      toast.error("Failed to load entry details");
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
      actions={
        <Button size="sm" onClick={() => setAddModalOpen(true)}>
          <Plus size={16} /> Add to Waitlist
        </Button>
      }
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
          <p className="text-xs mt-1">Add students to waitlist to get started</p>
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
              onViewStudent={handleViewDetail}
              loading={actionLoading === entry.id}
            />
          ))}
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} className="mt-4" />
        </div>
      )}

      <Modal
        open={addModalOpen}
        onClose={() => { setAddModalOpen(false); setFormData({ batchId: "", studentName: "", studentPhone: "", studentEmail: "", priority: "MEDIUM", notes: "" }); }}
        title="Add to Waitlist"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Student Name"
            required
            value={formData.studentName}
            onChange={(e) => setFormData((p) => ({ ...p, studentName: e.target.value }))}
          />
          <Input
            label="Phone"
            required
            value={formData.studentPhone}
            onChange={(e) => setFormData((p) => ({ ...p, studentPhone: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={formData.studentEmail}
            onChange={(e) => setFormData((p) => ({ ...p, studentEmail: e.target.value }))}
          />
          <Select
            label="Batch"
            placeholder="Select batch"
            options={batches
              .filter((b) => b.status === "ACTIVE" || b.status === "UPCOMING")
              .map((b) => ({ value: b.id, label: b.name }))}
            value={formData.batchId}
            onChange={(e) => setFormData((p) => ({ ...p, batchId: e.target.value }))}
          />
          <Select
            label="Priority"
            options={[
              { value: "LOW", label: "Low" },
              { value: "MEDIUM", label: "Medium" },
              { value: "HIGH", label: "High" },
            ]}
            value={formData.priority}
            onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value }))}
          />
          <Input
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => { setAddModalOpen(false); setFormData({ batchId: "", studentName: "", studentPhone: "", studentEmail: "", priority: "MEDIUM", notes: "" }); }}>
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
                <p className="text-sm text-text-primary">{detailEntry.studentName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Phone</p>
                <p className="text-sm text-text-primary">{detailEntry.studentPhone}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Email</p>
                <p className="text-sm text-text-primary">{detailEntry.studentEmail || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Batch</p>
                <p className="text-sm text-text-primary">{detailEntry.batch?.name || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Priority</p>
                <Badge variant={detailEntry.priority === "HIGH" ? "danger" : detailEntry.priority === "MEDIUM" ? "warning" : "info"} size="sm">
                  {detailEntry.priority}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Status</p>
                <Badge variant={detailEntry.status === "WAITING" ? "warning" : detailEntry.status === "PROMOTED" ? "success" : "danger"} size="sm">
                  {detailEntry.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Requested</p>
                <p className="text-sm text-text-primary">{new Date(detailEntry.requestedAt).toLocaleString()}</p>
              </div>
            </div>
            {detailEntry.notes && (
              <div>
                <p className="text-xs font-medium text-text-secondary">Notes</p>
                <p className="text-sm text-text-primary mt-1">{detailEntry.notes}</p>
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