"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormatSelector } from "./FormatSelector";
import { ExportProgressIndicator } from "./ExportProgressIndicator";
import type { ExportFormat, ReportQueryParams, ReportType } from "@/types/reports";
import { useReportExport } from "@/hooks/useReports";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  reportType: ReportType;
  queryParams: ReportQueryParams;
}

export function ExportDialog({ open, onClose, reportType, queryParams }: ExportDialogProps) {
  const [format, setFormat] = React.useState<ExportFormat>("csv");
  const { exporting, progress, exportReport } = useReportExport();

  const handleExport = async () => {
    await exportReport(reportType, { ...queryParams, format });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export report"
      description="Choose a format and download the report file."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={exporting}>Cancel</Button>
          <Button loading={exporting} leftIcon={<Download size={14} />} onClick={handleExport}>
            Export
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormatSelector value={format} onChange={setFormat} />
        <ExportProgressIndicator progress={progress} exporting={exporting} />
      </div>
    </Modal>
  );
}
