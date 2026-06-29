"use client";

import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { DashboardActivity } from "@/types/dashboard";

interface RecentActivityProps {
  activities: DashboardActivity[];
  loading?: boolean;
}

export function RecentActivity({ activities, loading }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
      <CardBody className="pt-0">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <EmptyState variant="no-data" title="No recent activity" />
        ) : (
          <ul className="divide-y divide-border">
            {activities.map((activity) => (
              <li key={activity.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-sm">
                <div>
                  <span className="font-medium text-text-primary">{activity.action}</span>
                  <span className="text-text-secondary"> · {activity.entity}</span>
                  {activity.actor && (
                    <span className="text-text-secondary"> by {activity.actor}</span>
                  )}
                </div>
                <time className="text-xs text-text-disabled">
                  {new Date(activity.timestamp).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
