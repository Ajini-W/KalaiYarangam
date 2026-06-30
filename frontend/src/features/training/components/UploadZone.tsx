"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, File, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button, Spinner } from "@/components/ui";

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number;
  category?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

export function UploadZone({ onUpload, accept = "image/*,.pdf,.doc,.docx", maxSize = 10 * 1024 * 1024 }: UploadZoneProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    const newFiles: UploadingFile[] = Array.from(files).map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }));
    setUploading((prev) => [...prev, ...newFiles]);

    for (const uf of newFiles) {
      if (uf.file.size > maxSize) {
        setUploading((prev) =>
          prev.map((f) => f.file === uf.file ? { ...f, status: "error", error: "File too large (max 10MB)" } : f),
        );
        continue;
      }
      try {
        await onUpload(uf.file);
        setUploading((prev) =>
          prev.map((f) => f.file === uf.file ? { ...f, status: "done" } : f),
        );
      } catch {
        setUploading((prev) =>
          prev.map((f) => f.file === uf.file ? { ...f, status: "error", error: "Upload failed" } : f),
        );
      }
    }
  }, [onUpload, maxSize]);

  const removeFile = (index: number) => {
    setUploading((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-md)] border-2 border-dashed p-8 transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-surface-raised",
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Upload size={20} className="text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-text-primary">Drop files here or click to upload</p>
          <p className="mt-1 text-xs text-text-secondary">Supports PDF, DOC, DOCX, Images up to 10MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {uploading.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploading.map((uf, i) => (
            <div key={i} className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-border px-3 py-2">
              <File size={16} className="text-text-secondary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">{uf.file.name}</p>
                <p className="text-xs text-text-secondary">{(uf.file.size / 1024).toFixed(1)} KB</p>
              </div>
              {uf.status === "uploading" && <Spinner size="xs" />}
              {uf.status === "done" && <CheckCircle2 size={16} className="text-success" />}
              {uf.status === "error" && (
                <div className="flex items-center gap-1">
                  <AlertCircle size={16} className="text-danger" />
                  <span className="text-xs text-danger">{uf.error}</span>
                </div>
              )}
              <button onClick={() => removeFile(i)} className="text-text-secondary hover:text-text-primary">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
