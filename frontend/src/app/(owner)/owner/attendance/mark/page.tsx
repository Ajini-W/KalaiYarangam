"use client";

import { Suspense } from "react";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { AttendanceMarkView } from "@/components/attendance";

export default function OwnerAttendanceMarkPage() {
  return (
    <Suspense fallback={<SkeletonTable rows={6} />}>
      <AttendanceMarkView basePath="/owner/attendance" />
    </Suspense>
  );
}
