"use client";

import { StatCard } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { TrendingUp, Users, BarChart3, Target } from "lucide-react";
import type { ProgressSummary } from "@/types/progress";

interface ProgressSummaryCardsProps {
  summary: ProgressSummary | null;
  loading?: boolean;
}

export function ProgressSummaryCards({ summary, loading }: ProgressSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Students tracked" value={summary.totalRecords} icon={<Users size={20} />} />
      <StatCard
        title="Average progress"
        value={`${Math.round(summary.averagePercentage)}%`}
        icon={<TrendingUp size={20} />}
      />
      <StatCard
        title="Highest"
        value={`${Math.round(summary.maxPercentage)}%`}
        icon={<Target size={20} />}
      />
      <StatCard
        title="Lowest"
        value={`${Math.round(summary.minPercentage)}%`}
        icon={<BarChart3 size={20} />}
      />
    </div>
  );
}
