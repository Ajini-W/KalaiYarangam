"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { certificatesService } from "@/services/certificates.service";
import { toast } from "sonner";
import type { CertificateSnapshot } from "@/types/certificates";

interface DownloadButtonProps {
  certificateId: string;
  certNumber?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md";
}

function openPrintWindow(snapshot: CertificateSnapshot, certNumber: string) {
  const studentName = snapshot.student?.name ?? "Student";
  const courseName = snapshot.courseName ?? "Course";
  const issuedDate = snapshot.issuedDate ?? new Date().toISOString().slice(0, 10);
  const html = `<!DOCTYPE html><html><head><title>Certificate ${certNumber}</title>
<style>
body{font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f5}
.cert{width:800px;max-width:95%;padding:48px;border:8px double #b8860b;background:#fffef8;text-align:center}
h1{font-size:2rem;color:#1a1a1a;margin:0 0 8px}
.sub{color:#666;margin-bottom:32px}
.name{font-size:1.75rem;font-weight:bold;color:#b8860b;margin:16px 0}
.meta{margin-top:32px;font-size:0.875rem;color:#444}
</style></head><body>
<div class="cert">
<h1>Certificate of Completion</h1>
<p class="sub">This is to certify that</p>
<p class="name">${studentName}</p>
<p>has successfully completed</p>
<p class="name" style="font-size:1.25rem">${courseName}</p>
<p class="meta">Certificate No: ${certNumber}<br>Issued: ${issuedDate}</p>
</div></body></html>`;
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }
}

export function DownloadButton({
  certificateId,
  certNumber,
  variant = "outline",
  size = "sm",
}: DownloadButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const data = await certificatesService.download(certificateId);
      openPrintWindow(data.snapshot, data.certificate.certNumber);
      toast.success("Certificate ready to download");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Download failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      loading={loading}
      leftIcon={<Download size={14} />}
      onClick={handleDownload}
    >
      Download
    </Button>
  );
}
