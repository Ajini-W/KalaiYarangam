"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Upload, File, Download, Archive, FileText, Image, Film, Music, Search, Grid3X3, List } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Badge, Pagination, SearchBar, Card, CardHeader, CardBody, Modal, Skeleton } from "@/components/ui";
import { UploadZone } from "../components/UploadZone";
import { getFiles, uploadFile, archiveFile, restoreFile, getFileDownloadUrl, type TrainingFile } from "@/services/training";
import { cn } from "@/lib/cn";
import { toast } from "sonner";

const categoryIcons: Record<string, React.ReactNode> = {
  image: <Image size={18} />,
  video: <Film size={18} />,
  audio: <Music size={18} />,
  document: <FileText size={18} />,
};

const categoryLabels: Record<string, string> = {
  image: "Images",
  video: "Videos",
  audio: "Audio",
  document: "Documents",
  other: "Other",
};

export function FilesPage() {
  const [files, setFiles] = useState<TrainingFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeCategory, setActiveCategory] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<TrainingFile | null>(null);
  const pageSize = 20;

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFiles({ page, pageSize, search, category: activeCategory });
      setFiles(res.data ?? []);
      setTotal(res.data?.length ?? 0);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeCategory]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const handleUpload = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const category = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext) ? "image"
      : ["mp4", "webm", "mov"].includes(ext) ? "video"
      : ["mp3", "wav", "ogg"].includes(ext) ? "audio"
      : ["pdf", "doc", "docx", "xls", "xlsx", "txt"].includes(ext) ? "document"
      : "other";
    try {
      await uploadFile(file, category);
      toast.success("File uploaded successfully");
      fetchFiles();
    } catch {
      throw new Error("Upload failed");
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveFile(id);
      toast.success("File archived");
      fetchFiles();
    } catch {
      toast.error("Failed to archive file");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const categories = [...new Set(files.map((f) => f.category))];

  return (
    <PageContainer
      title="Files"
      subtitle="Manage uploaded files and media"
      actions={
        <Button size="sm" onClick={() => setUploadOpen(true)}>
          <Upload size={16} /> Upload Files
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search files…" className="max-w-xs" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveCategory("")}
              className={cn("rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium transition-colors", !activeCategory ? "bg-primary text-primary-foreground" : "text-text-secondary hover:text-text-primary")}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? "" : cat)}
                className={cn("rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium transition-colors", cat === activeCategory ? "bg-primary text-primary-foreground" : "text-text-secondary hover:text-text-primary")}
              >
                {categoryLabels[cat] ?? cat}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-[var(--radius-sm)] border border-border p-0.5">
          <button onClick={() => setViewMode("grid")} className={cn("rounded-[var(--radius-xs)] p-1.5", viewMode === "grid" ? "bg-surface-overlay" : "text-text-secondary")} aria-label="Grid view">
            <Grid3X3 size={14} />
          </button>
          <button onClick={() => setViewMode("list")} className={cn("rounded-[var(--radius-xs)] p-1.5", viewMode === "list" ? "bg-surface-overlay" : "text-text-secondary")} aria-label="List view">
            <List size={14} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" : "space-y-2"}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className={viewMode === "grid" ? "h-[120px]" : "h-[52px]"} />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
          <File size={40} className="mb-3 text-text-disabled" />
          <p className="text-sm font-medium">No files found</p>
          <p className="text-xs mt-1">Upload files to get started</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative rounded-[var(--radius-md)] border border-border bg-surface p-4 transition-colors hover:border-primary/30"
            >
              <div className="flex items-center justify-center h-16 mb-3 rounded-[var(--radius-sm)] bg-surface-raised">
                {categoryIcons[file.category] ?? <File size={24} className="text-text-secondary" />}
              </div>
              <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
              <p className="text-xs text-text-secondary">{formatSize(file.size)}</p>
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-surface/90 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="xs" variant="ghost" onClick={() => setPreviewFile(file)} title="Preview">
                  <FileText size={14} />
                </Button>
                <Button size="xs" variant="ghost" title="Download" onClick={() => window.open(getFileDownloadUrl(file.id), "_blank")}>
                  <Download size={14} />
                </Button>
                {!file.isArchived && (
                  <Button size="xs" variant="ghost" onClick={() => handleArchive(file.id)} title="Archive">
                    <Archive size={14} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-border px-4 py-2.5 transition-colors hover:bg-surface-overlay">
              {categoryIcons[file.category] ?? <File size={16} className="text-text-secondary shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">{file.name}</p>
                <p className="text-xs text-text-secondary">{formatSize(file.size)} • {file.category}</p>
              </div>
              <Badge size="sm" variant={file.isArchived ? "outline" : "success"}>{file.isArchived ? "Archived" : "Active"}</Badge>
              <div className="flex items-center gap-1">
                <Button size="xs" variant="ghost" onClick={() => window.open(getFileDownloadUrl(file.id), "_blank")}><Download size={14} /></Button>
                {!file.isArchived && <Button size="xs" variant="ghost" onClick={() => handleArchive(file.id)}><Archive size={14} /></Button>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
      </div>

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Files" size="md">
        <UploadZone onUpload={handleUpload} />
      </Modal>

      <Modal open={!!previewFile} onClose={() => setPreviewFile(null)} title={previewFile?.name ?? "File"} size="lg">
        {previewFile && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {categoryIcons[previewFile.category] ?? <File size={24} className="text-primary" />}
              <div>
                <p className="font-medium text-text-primary">{previewFile.name}</p>
                <p className="text-sm text-text-secondary">{formatSize(previewFile.size)} • {previewFile.category}</p>
              </div>
            </div>
            <div className="rounded-[var(--radius-md)] border border-border bg-surface-raised p-12 text-center">
              {previewFile.category === "image" ? (
                <img src={getFileDownloadUrl(previewFile.id)} alt={previewFile.name} className="max-h-[300px] mx-auto object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <File size={48} className="text-text-disabled" />
                  <p className="text-sm text-text-secondary">Preview not available</p>
                  <Button size="sm" onClick={() => window.open(getFileDownloadUrl(previewFile.id), "_blank")}>
                    <Download size={16} /> Download
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
