"use client";

import { BatchProgressSummaryView } from "@/components/progress";

export default function Page() {
  return (
    <BatchProgressSummaryView
      basePath="/staff/student-progress"
      title="Student Progress"
      subtitle="Review individual student learning progress."
    />
  );
}
