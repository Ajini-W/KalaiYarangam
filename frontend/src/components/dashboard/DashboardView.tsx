"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { RefreshCw, LayoutDashboard } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/EmptyState";
import { useAuthStore } from "@/store/auth.store";
import { useDashboard } from "@/hooks/useDashboard";
import { MetricCards } from "./MetricCards";
import { UpcomingWidget } from "./UpcomingWidget";
import { AlertList } from "./AlertList";
import { RecentActivity } from "./RecentActivity";
import { QuickSummary } from "./QuickSummary";
import { DevModeBadge } from "@/components/shared/DevModeBadge";
import type { DashboardActivity } from "@/types/dashboard";

interface DashboardViewProps {
  roleLabel: string;
  quickActions?: React.ReactNode;
}

export function DashboardView({ roleLabel, quickActions }: DashboardViewProps) {
  const user = useAuthStore((s) => s.user);
  const { summary, metrics, upcoming, alerts, loading, error, usingMock, refetch } = useDashboard();

  const displayMetrics = metrics.length > 0 ? metrics : (summary?.metrics ?? []);
  const activities: DashboardActivity[] = React.useMemo(() => {
    return alerts.slice(0, 5).map((a) => ({
      id: a.id,
      action: a.title,
      entity: a.message,
      timestamp: a.createdAt,
    }));
  }, [alerts]);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (error && !loading && !summary && displayMetrics.length === 0) {
    return (
      <PageContainer>
        <ErrorState
          code={500}
          title="Unable to load dashboard"
          description={error}
          action={{ label: "Retry", onClick: refetch }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      actions={
        <Button variant="ghost" size="sm" onClick={refetch} leftIcon={<RefreshCw size={14} />}>
          Refresh
        </Button>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <DevModeBadge visible={usingMock} />

        {/* Welcome Section */}
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-xl font-bold text-primary-foreground shadow-lg">
            {initials}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Welcome, {user.name.split(" ")[0]}!
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">{roleLabel}</p>
          </div>
        </div>

        {/* Quick Summary */}
        <QuickSummary summary={summary} loading={loading} />

        {/* Metric Cards */}
        <MetricCards metrics={displayMetrics} loading={loading} />

        {/* Quick Actions */}
        {quickActions}

        {/* Upcoming and Alerts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UpcomingWidget items={upcoming} loading={loading} />
          <AlertList alerts={alerts} loading={loading} />
        </div>

        {/* Recent Activity */}
        <RecentActivity activities={activities} loading={loading} />
      </motion.div>
    </PageContainer>
  );
}
