export type ReportType =
  | "revenue"
  | "enrollment"
  | "attendance"
  | "payment-due"
  | "conversion"
  | "trainer-performance"
  | "student-progress"
  | "batch-utilization";

export type ReportViewMode = "chart" | "table";
export type ExportFormat = "csv" | "xlsx" | "pdf";

export interface ReportDateRange {
  from: string;
  to: string;
}

export interface ReportQueryParams extends ReportDateRange {
  batchId?: string;
  branchId?: string;
}

export interface ReportColumn {
  key: string;
  label: string;
}

export interface ReportChartPoint {
  label: string;
  value: number;
}

export interface ReportData {
  title: string;
  columns: ReportColumn[];
  rows: Record<string, string | number>[];
  chart?: ReportChartPoint[];
  summary?: Record<string, string | number>;
}

export interface ReportExportParams extends ReportQueryParams {
  format: ExportFormat;
}

export interface ReportMeta {
  type: ReportType;
  label: string;
  description: string;
  category: string;
}

export const REPORT_CATALOG: ReportMeta[] = [
  { type: "revenue", label: "Revenue", description: "Fee collection and revenue trends", category: "Financial" },
  { type: "enrollment", label: "Enrollment", description: "New enrollments and batch fills", category: "Academic" },
  { type: "attendance", label: "Attendance", description: "Session attendance rates", category: "Academic" },
  { type: "payment-due", label: "Payment Due", description: "Outstanding fee balances", category: "Financial" },
  { type: "conversion", label: "Conversion", description: "Lead to enrollment conversion", category: "Sales" },
  { type: "trainer-performance", label: "Trainer Performance", description: "Trainer activity and outcomes", category: "Operations" },
  { type: "student-progress", label: "Student Progress", description: "Learning progress across batches", category: "Academic" },
  { type: "batch-utilization", label: "Batch Utilization", description: "Capacity and seat usage", category: "Operations" },
];
