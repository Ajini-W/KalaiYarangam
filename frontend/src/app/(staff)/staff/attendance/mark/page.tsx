"use client";

import { Suspense } from "react";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { AttendanceMarkView } from "@/components/attendance";

function MarkFallback() {
  return <SkeletonTable rows={6} />;
}

export default function StaffAttendanceMarkPage() {
  return (
    <Suspense fallback={<MarkFallback />}>
      <AttendanceMarkView basePath="/staff/attendance" />
    </Suspense>
  );
}
