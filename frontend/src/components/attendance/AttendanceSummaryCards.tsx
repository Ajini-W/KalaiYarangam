"use client";

import { StatCard } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/EmptyState";
import { CheckCircle2, XCircle, Clock, CalendarCheck, Users } from "lucide-react";
import type { AttendanceSummary } from "@/types/attendance";

interface AttendanceSummaryCardsProps {
  summary: AttendanceSummary | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

function SummarySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-[var(--radius-md)] border border-border p-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

export function AttendanceSummaryCards({
  summary,
  loading,
  error,
  onRetry,
}: AttendanceSummaryCardsProps) {
  if (loading) return <SummarySkeleton />;

  if (error) {
    return (
      <ErrorState
        code={500}
        title="Unable to load summary"
        description={error}
        action={onRetry ? { label: "Retry", onClick: onRetry } : undefined}
      />
    );
  }

  if (!summary) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard title="Total Sessions" value={summary.totalSessions} icon={<CalendarCheck size={20} />} />
      <StatCard title="Present" value={summary.present} icon={<CheckCircle2 size={20} />} />
      <StatCard title="Absent" value={summary.absent} icon={<XCircle size={20} />} />
      <StatCard title="Late" value={summary.late} icon={<Clock size={20} />} />
      <StatCard title="Total Records" value={summary.totalRecords} icon={<Users size={20} />} />
    </div>
  );
}
