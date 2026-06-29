"use client";

import { Card, CardBody } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { DashboardSummary } from "@/types/dashboard";

interface QuickSummaryProps {
  summary: DashboardSummary | null;
  loading?: boolean;
}

export function QuickSummary({ summary, loading }: QuickSummaryProps) {
  if (loading) {
    return <Skeleton className="h-20 w-full rounded-[var(--radius-md)]" />;
  }

  if (!summary) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardBody className="py-4">
        <p className="text-lg font-semibold text-text-primary">{summary.headline}</p>
        {summary.subheadline && (
          <p className="mt-1 text-sm text-text-secondary">{summary.subheadline}</p>
        )}
        {summary.quickStats && Object.keys(summary.quickStats).length > 0 && (
          <dl className="mt-4 flex flex-wrap gap-4">
            {Object.entries(summary.quickStats).map(([key, value]) => (
              <div key={key}>
                <dt className="text-xs uppercase text-text-secondary">{key}</dt>
                <dd className="text-sm font-bold text-text-primary">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </CardBody>
    </Card>
  );
}
