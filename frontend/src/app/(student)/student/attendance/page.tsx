"use client";

import { StudentAttendanceView } from "@/components/attendance";
import { useAuthStore } from "@/store/auth.store";

export default function StudentAttendancePage() {
  const user = useAuthStore((s) => s.user);
  return <StudentAttendanceView studentId={user?.id} />;
}
