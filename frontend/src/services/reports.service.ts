import { apiClient } from "./api-client";
import type { ExportFormat, ReportData, ReportQueryParams, ReportType } from "@/types/reports";

interface ApiEnvelope<T> {
  httpStatusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data;
}

const REPORT_PATHS: Record<ReportType, string> = {
  revenue: "/reports/revenue",
  enrollment: "/reports/enrollment",
  attendance: "/reports/attendance",
  "payment-due": "/reports/payment-due",
  conversion: "/reports/conversion",
  "trainer-performance": "/reports/trainer-performance",
  "student-progress": "/reports/student-progress",
  "batch-utilization": "/reports/batch-utilization",
};

const EXPORT_PATHS: Partial<Record<ReportType, string>> = {
  revenue: "/reports/revenue/export",
  enrollment: "/reports/enrollment/export",
  attendance: "/reports/attendance/export",
  "student-progress": "/reports/progress/export",
};

export const reportsService = {
  async getReport(type: ReportType, params: ReportQueryParams) {
    const response = await apiClient.get<ApiEnvelope<ReportData>>(REPORT_PATHS[type], { params });
    return unwrap(response);
  },

  async exportReport(
    type: ReportType,
    params: ReportQueryParams & { format: ExportFormat },
    onProgress?: (percent: number) => void,
  ): Promise<Blob> {
    const exportPath = EXPORT_PATHS[type];
    if (!exportPath) {
      throw new Error("Export is not available for this report type");
    }

    onProgress?.(10);
    const response = await apiClient.get(exportPath, {
      params,
      responseType: "blob",
      onDownloadProgress: (event) => {
        if (event.total) {
          onProgress?.(Math.min(95, Math.round((event.loaded / event.total) * 100)));
        }
      },
    });
    onProgress?.(100);
    return response.data as Blob;
  },
};
