"use client";

import { useState } from "react";
import { FileText, Download, CheckCircle2, XCircle, Archive, Eye, Search, Grid3X3, List } from "lucide-react";
import { Card, CardHeader, CardBody, Badge, Button, Skeleton } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { TrainingDocument } from "@/services/training";

interface DocumentGridProps {
  documents: TrainingDocument[];
  loading?: boolean;
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
  onArchive: (id: string) => void;
  onPreview: (doc: TrainingDocument) => void;
}

export function DocumentGrid({ documents, loading, onVerify, onReject, onArchive, onPreview }: DocumentGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const statusVariant: Record<string, "success" | "danger" | "warning" | "outline"> = {
    VERIFIED: "success",
    REJECTED: "danger",
    PENDING: "warning",
    ARCHIVED: "outline",
  };

  if (loading) {
    return (
      <div className={viewMode === "grid"
        ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        : "space-y-2"
      }>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className={viewMode === "grid" ? "h-[180px]" : "h-[60px]"} />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
        <FileText size={40} className="mb-3 text-text-disabled" />
        <p className="text-sm font-medium">No documents found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-text-secondary">{documents.length} document{documents.length !== 1 ? "s" : ""}</p>
        <div className="flex items-center gap-1 rounded-[var(--radius-sm)] border border-border p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={cn("rounded-[var(--radius-xs)] p-1.5", viewMode === "grid" ? "bg-surface-overlay" : "text-text-secondary")}
            aria-label="Grid view"
          >
            <Grid3X3 size={14} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn("rounded-[var(--radius-xs)] p-1.5", viewMode === "list" ? "bg-surface-overlay" : "text-text-secondary")}
            aria-label="List view"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.id} className="group">
              <CardBody>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-primary/10">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{doc.name}</p>
                    <p className="text-xs text-text-secondary">{doc.type}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{doc.studentName}</p>
                  </div>
                  <Badge variant={statusVariant[doc.status] ?? "outline"} size="sm">
                    {doc.status}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="xs" variant="ghost" onClick={() => onPreview(doc)} title="Preview">
                    <Eye size={14} />
                  </Button>
                  <Button size="xs" variant="ghost" title="Download">
                    <Download size={14} />
                  </Button>
                  {doc.status === "PENDING" && (
                    <>
                      <Button size="xs" variant="ghost" onClick={() => onVerify(doc.id)} title="Verify">
                        <CheckCircle2 size={14} className="text-success" />
                      </Button>
                      <Button size="xs" variant="ghost" onClick={() => onReject(doc.id)} title="Reject">
                        <XCircle size={14} className="text-danger" />
                      </Button>
                    </>
                  )}
                  {doc.status !== "ARCHIVED" && (
                    <Button size="xs" variant="ghost" onClick={() => onArchive(doc.id)} title="Archive">
                      <Archive size={14} />
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-border px-4 py-3 transition-colors hover:bg-surface-overlay"
            >
              <FileText size={16} className="text-text-secondary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{doc.name}</p>
                <p className="text-xs text-text-secondary">{doc.type} • {doc.studentName}</p>
              </div>
              <Badge variant={statusVariant[doc.status] ?? "outline"} size="sm">{doc.status}</Badge>
              <div className="flex items-center gap-1">
                <Button size="xs" variant="ghost" onClick={() => onPreview(doc)}><Eye size={14} /></Button>
                {doc.status === "PENDING" && (
                  <>
                    <Button size="xs" variant="ghost" onClick={() => onVerify(doc.id)}><CheckCircle2 size={14} className="text-success" /></Button>
                    <Button size="xs" variant="ghost" onClick={() => onReject(doc.id)}><XCircle size={14} className="text-danger" /></Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
