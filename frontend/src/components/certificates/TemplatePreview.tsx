"use client";

import type { CertificateSnapshot } from "@/types/certificates";
import { cn } from "@/lib/cn";

interface TemplatePreviewProps {
  snapshot: CertificateSnapshot;
  className?: string;
}

export function TemplatePreview({ snapshot, className }: TemplatePreviewProps) {
  const studentName = snapshot.student?.name ?? "Student Name";
  const courseName = snapshot.courseName ?? "Course Name";
  const certNumber = snapshot.certNumber ?? "CERT-000000";
  const issuedDate = snapshot.issuedDate ?? new Date().toISOString().slice(0, 10);
  const templateName = snapshot.template?.name ?? "Certificate";

  return (
    <div
      className={cn(
        "mx-auto aspect-[1.414/1] w-full max-w-2xl rounded-[var(--radius-md)] border-4 border-double border-[#b8860b] bg-[#fffef8] p-6 text-center shadow-[var(--shadow-2)] dark:bg-[#1a1814] dark:border-[#c9a227]",
        className,
      )}
      aria-label="Certificate preview"
    >
      <div className="flex h-full flex-col items-center justify-center gap-2 px-4 py-6 sm:px-8 sm:py-10">
        <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">{templateName}</p>
        <h2 className="text-lg font-serif font-bold text-text-primary sm:text-2xl">
          Certificate of Completion
        </h2>
        <p className="text-sm text-text-secondary">This is to certify that</p>
        <p className="text-xl font-serif font-bold text-[#b8860b] sm:text-3xl">{studentName}</p>
        <p className="text-sm text-text-secondary">has successfully completed</p>
        <p className="text-lg font-semibold text-text-primary sm:text-xl">{courseName}</p>
        <div className="mt-4 space-y-1 text-xs text-text-secondary sm:text-sm">
          <p>Certificate No: {certNumber}</p>
          <p>Issued: {issuedDate}</p>
        </div>
      </div>
    </div>
  );
}
