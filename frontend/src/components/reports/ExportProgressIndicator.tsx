"use client";

import { ProgressBar } from "@/components/progress/ProgressBar";

interface ExportProgressIndicatorProps {
  progress: number;
  exporting?: boolean;
}

export function ExportProgressIndicator({ progress, exporting }: ExportProgressIndicatorProps) {
  if (!exporting) return null;

  return (
    <div className="space-y-2" role="status" aria-live="polite">
      <p className="text-sm font-medium text-text-primary">Exporting report…</p>
      <ProgressBar value={progress} showValue label="Progress" />
    </div>
  );
}
