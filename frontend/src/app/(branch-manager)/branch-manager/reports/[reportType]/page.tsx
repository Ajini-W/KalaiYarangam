"use client";

import { use } from "react";
import { ReportView } from "@/components/reports";
import type { ReportType } from "@/types/reports";

export default function Page({ params }: { params: Promise<{ reportType: string }> }) {
  const { reportType } = use(params);
  return <ReportView basePath="/branch-manager/reports" reportType={reportType as ReportType} />;
}
