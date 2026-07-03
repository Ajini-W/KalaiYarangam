import type { ReportData, ReportType } from "@/types/reports";

const MOCK_REPORT_ROWS: Record<ReportType, ReportData> = {
  revenue: {
    title: "Revenue Report",
    columns: [
      { key: "month", label: "Month" },
      { key: "collected", label: "Collected (₹)" },
    ],
    rows: [
      { month: "June 2026", collected: 125000 },
      { month: "July 2026", collected: 98000 },
    ],
    chart: [
      { label: "June 2026", value: 125000 },
      { label: "July 2026", value: 98000 },
    ],
    summary: { total: 223000, average: 111500 },
  },
  enrollment: {
    title: "Enrollment Report",
    columns: [
      { key: "batch", label: "Batch" },
      { key: "enrolled", label: "Enrolled" },
    ],
    rows: [
      { batch: "Bharatanatyam Beginners", enrolled: 14 },
      { batch: "Carnatic Vocal Intermediate", enrolled: 10 },
    ],
    chart: [
      { label: "Bharatanatyam Beginners", value: 14 },
      { label: "Carnatic Vocal Intermediate", value: 10 },
    ],
    summary: { total: 24 },
  },
  attendance: {
    title: "Attendance Report",
    columns: [
      { key: "batch", label: "Batch" },
      { key: "rate", label: "Rate (%)" },
    ],
    rows: [
      { batch: "Bharatanatyam Beginners", rate: 92 },
      { batch: "Carnatic Vocal Intermediate", rate: 85 },
    ],
    chart: [
      { label: "Bharatanatyam Beginners", value: 92 },
      { label: "Carnatic Vocal Intermediate", value: 85 },
    ],
    summary: { averageRate: 88.5 },
  },
  "payment-due": {
    title: "Payment Due Report",
    columns: [
      { key: "student", label: "Student" },
      { key: "due", label: "Due (₹)" },
    ],
    rows: [
      { student: "Arjun Menon", due: 3500 },
      { student: "Vikram Iyer", due: 5000 },
    ],
    summary: { totalDue: 8500 },
  },
  conversion: {
    title: "Conversion Report",
    columns: [
      { key: "source", label: "Source" },
      { key: "rate", label: "Rate (%)" },
    ],
    rows: [
      { source: "Walk-in", rate: 42 },
      { source: "Referral", rate: 68 },
    ],
    summary: { averageRate: 55 },
  },
  "trainer-performance": {
    title: "Trainer Performance Report",
    columns: [
      { key: "trainer", label: "Trainer" },
      { key: "sessions", label: "Sessions" },
    ],
    rows: [
      { trainer: "Lakshmi Devi", sessions: 18 },
      { trainer: "Ravi Kumar", sessions: 14 },
    ],
    summary: { totalSessions: 32 },
  },
  "student-progress": {
    title: "Student Progress Report",
    columns: [
      { key: "student", label: "Student" },
      { key: "progress", label: "Progress (%)" },
    ],
    rows: [
      { student: "Priya Sharma", progress: 78 },
      { student: "Meera Krishnan", progress: 92 },
    ],
    chart: [
      { label: "Priya Sharma", value: 78 },
      { label: "Meera Krishnan", value: 92 },
    ],
    summary: { averageProgress: 85 },
  },
  "batch-utilization": {
    title: "Batch Utilization Report",
    columns: [
      { key: "batch", label: "Batch" },
      { key: "utilization", label: "Utilization (%)" },
    ],
    rows: [
      { batch: "Bharatanatyam Beginners", utilization: 88 },
      { batch: "Carnatic Vocal Intermediate", utilization: 71 },
    ],
    summary: { averageUtilization: 79.5 },
  },
};

export function getMockReport(type: ReportType): ReportData {
  return MOCK_REPORT_ROWS[type];
}
