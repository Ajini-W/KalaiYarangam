"use client";

import { StatCard } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import type { DashboardMetric } from "@/types/dashboard";

interface MetricCardsProps {
  metrics: DashboardMetric[];
  loading?: boolean;
}

export function MetricCards({ metrics, loading }: MetricCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (metrics.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <StatCard
          key={metric.key}
          title={metric.label}
          value={metric.unit ? `${metric.value}${metric.unit}` : metric.value}
          delta={metric.delta != null ? String(metric.delta) : undefined}
          deltaType={metric.deltaType}
        />
      ))}
    </div>
  );
}
