"use client";

import * as React from "react";
import { toast } from "sonner";
import { reportsService } from "@/services/reports.service";
import { withMockFallback } from "@/lib/mock-fallback";
import { getMockReport } from "@/mocks";
import type { ExportFormat, ReportData, ReportQueryParams, ReportType } from "@/types/reports";

export function useReport(type: ReportType, params: ReportQueryParams | null) {
  const [data, setData] = React.useState<ReportData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [usingMock, setUsingMock] = React.useState(false);

  const fetch = React.useCallback(async () => {
    if (!params) return;
    setLoading(true);
    setError(null);
    try {
      const { data: result, usingMock: isMock } = await withMockFallback(
        () => reportsService.getReport(type, params),
        () => getMockReport(type),
      );
      setData(result);
      setUsingMock(isMock);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load report";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [type, params]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, usingMock, refetch: fetch };
}

export function useReportExport() {
  const [exporting, setExporting] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const exportReport = async (
    type: ReportType,
    params: ReportQueryParams & { format: ExportFormat },
  ) => {
    setExporting(true);
    setProgress(0);
    try {
      const blob = await reportsService.exportReport(type, params, setProgress);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${type}-report.${params.format}`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Report exported");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Export failed";
      toast.error(message);
      throw err;
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  return { exporting, progress, exportReport };
}
