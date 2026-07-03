"use client";

import { useState, useEffect, useCallback } from "react";
import { Upload, FileText, Archive, RotateCcw, CheckCircle2, XCircle, Search, Eye } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Badge, Pagination, SearchBar, FilterBar, Modal, ConfirmModal, Card, StatCard } from "@/components/ui";
import { DocumentGrid } from "../components/DocumentGrid";
import { UploadZone } from "../components/UploadZone";
import { getDocuments, uploadDocument, verifyDocument, rejectDocument, archiveDocument, restoreDocument, type TrainingDocument } from "@/services/training";
import { toast } from "sonner";

export function DocumentsPage() {
  const [documents, setDocuments] = useState<TrainingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<TrainingDocument | null>(null);
  const [rejectDoc, setRejectDoc] = useState<TrainingDocument | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [archiveConfirm, setArchiveConfirm] = useState<TrainingDocument | null>(null);
  const [restoreConfirm, setRestoreConfirm] = useState<TrainingDocument | null>(null);
  const pageSize = 12;

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDocuments({ page, pageSize, search, status: activeFilters.status, type: activeFilters.type });
      setDocuments(res.data ?? []);
      setTotal(res.data?.length ?? 0);
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeFilters]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    try {
      await uploadDocument(formData);
      toast.success("Document uploaded successfully");
      fetchDocuments();
    } catch {
      throw new Error("Upload failed");
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await verifyDocument(id);
      toast.success("Document verified");
      fetchDocuments();
    } catch {
      toast.error("Failed to verify document");
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      await rejectDocument(id, rejectReason);
      toast.success("Document rejected");
      setRejectDoc(null);
      setRejectReason("");
      fetchDocuments();
    } catch {
      toast.error("Failed to reject document");
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveDocument(id);
      toast.success("Document archived");
      setArchiveConfirm(null);
      fetchDocuments();
    } catch {
      toast.error("Failed to archive document");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreDocument(id);
      toast.success("Document restored");
      setRestoreConfirm(null);
      fetchDocuments();
    } catch {
      toast.error("Failed to restore document");
    }
  };

  const filterDefs = [
    { key: "status", label: "Status", options: [
      { value: "PENDING", label: "Pending" },
      { value: "VERIFIED", label: "Verified" },
      { value: "REJECTED", label: "Rejected" },
      { value: "ARCHIVED", label: "Archived" },
    ]},
    { key: "type", label: "Type", options: [
      { value: "ID_PROOF", label: "ID Proof" },
      { value: "PHOTO", label: "Photo" },
      { value: "QUALIFICATION", label: "Qualification" },
      { value: "ADDRESS", label: "Address Proof" },
      { value: "OTHER", label: "Other" },
    ]},
  ];

  const pendingCount = documents.filter((d) => d.status === "PENDING").length;

  return (
    <PageContainer
      title="Documents"
      subtitle="Manage student documents and verification"
      actions={
        <Button size="sm" onClick={() => setUploadOpen(true)}>
          <Upload size={16} /> Upload Document
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <StatCard title="Total" value={documents.length} icon={<FileText size={18} />} />
        <StatCard title="Pending" value={pendingCount} icon={<FileText size={18} />} />
        <StatCard title="Verified" value={documents.filter((d) => d.status === "VERIFIED").length} icon={<CheckCircle2 size={18} />} />
        <StatCard title="Rejected" value={documents.filter((d) => d.status === "REJECTED").length} icon={<XCircle size={18} />} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search documents…" className="max-w-xs" />
        <FilterBar filters={filterDefs} active={activeFilters} onChange={(k, v) => setActiveFilters((p) => ({ ...p, [k]: v }))} onClear={() => setActiveFilters({})} />
      </div>

      <DocumentGrid
        documents={documents}
        loading={loading}
        onVerify={handleVerify}
        onReject={(id) => setRejectDoc(documents.find((d) => d.id === id) ?? null)}
        onArchive={(id) => setArchiveConfirm(documents.find((d) => d.id === id) ?? null)}
        onPreview={(doc) => setPreviewDoc(doc)}
      />

      <div className="mt-4">
        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
      </div>

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Document" size="md">
        <UploadZone onUpload={handleUpload} />
      </Modal>

      <Modal open={!!previewDoc} onClose={() => setPreviewDoc(null)} title={previewDoc?.name ?? "Document"} size="lg">
        {previewDoc && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-primary" />
              <div>
                <p className="font-medium text-text-primary">{previewDoc.name}</p>
                <p className="text-sm text-text-secondary">Type: {previewDoc.type}</p>
              </div>
              <Badge
                variant={previewDoc.status === "VERIFIED" ? "success" : previewDoc.status === "REJECTED" ? "danger" : previewDoc.status === "ARCHIVED" ? "outline" : "warning"}
                size="sm"
              >
                {previewDoc.status}
              </Badge>
            </div>
            <div className="rounded-[var(--radius-md)] border border-border bg-surface-raised p-8 text-center">
              <FileText size={48} className="mx-auto text-text-disabled" />
              <p className="mt-2 text-sm text-text-secondary">Document preview</p>
            </div>
            {previewDoc.remarks && (
              <div className="rounded-[var(--radius-sm)] border border-border bg-surface-raised p-3">
                <p className="text-xs font-medium text-text-secondary">Remarks</p>
                <p className="text-sm text-text-primary mt-1">{previewDoc.remarks}</p>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              {previewDoc.status === "ARCHIVED" ? (
                <Button size="sm" variant="outline" onClick={() => { handleRestore(previewDoc.id); setPreviewDoc(null); }}>
                  <RotateCcw size={14} /> Restore
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => { setArchiveConfirm(previewDoc); setPreviewDoc(null); }}>
                  <Archive size={14} /> Archive
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!rejectDoc} onClose={() => { setRejectDoc(null); setRejectReason(""); }} title="Reject Document" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Reject &ldquo;{rejectDoc?.name}&rdquo;? Provide a reason.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection…"
            className="w-full min-h-[80px] rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setRejectDoc(null); setRejectReason(""); }}>Cancel</Button>
            <Button variant="danger" onClick={() => rejectDoc && handleReject(rejectDoc.id)}>Reject</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!archiveConfirm}
        onClose={() => setArchiveConfirm(null)}
        onConfirm={async () => { if (archiveConfirm) await handleArchive(archiveConfirm.id); }}
        title="Archive Document"
        description={`Archive "${archiveConfirm?.name}"?`}
        confirmLabel="Archive"
        intent="warning"
      />

      <ConfirmModal
        open={!!restoreConfirm}
        onClose={() => setRestoreConfirm(null)}
        onConfirm={async () => { if (restoreConfirm) await handleRestore(restoreConfirm.id); }}
        title="Restore Document"
        description={`Restore "${restoreConfirm?.name}"?`}
        confirmLabel="Restore"
        intent="info"
      />
    </PageContainer>
  );
}