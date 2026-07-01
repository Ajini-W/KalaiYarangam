"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Layers, GraduationCap, Calendar, Clock } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Card, CardHeader, CardBody, Button, Badge, Skeleton } from "@/components/ui";
import { StatisticsCards } from "../components/StatisticsCards";
import { ScheduleCalendar } from "../components/ScheduleCalendar";
import { getTrainingStats, getTodaySchedule, getUpcomingSchedule, type TrainingStats, type ScheduleEvent } from "@/services/training";
import { cn } from "@/lib/cn";

export function TrainingDashboardPage() {
  const [stats, setStats] = useState<TrainingStats | null>(null);
  const [todayEvents, setTodayEvents] = useState<ScheduleEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, todayRes, upcomingRes] = await Promise.all([
        getTrainingStats(),
        getTodaySchedule(),
        getUpcomingSchedule(),
      ]);
      setStats(statsRes.data);
      setTodayEvents(todayRes.data ?? []);
      setUpcomingEvents(upcomingRes.data ?? []);
    } catch {
      /* API will be implemented - silent fail */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <PageContainer
      title="Training Dashboard"
      subtitle="Overview of your training management"
      actions={
        <Button size="sm" onClick={() => {}}>
          <Plus size={16} /> Quick Action
        </Button>
      }
    >
      <StatisticsCards stats={stats} loading={loading} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ScheduleCalendar events={todayEvents} loading={loading} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Calendar size={16} className="text-primary" /> Today&apos;s Schedule
              </h3>
            </CardHeader>
            <CardBody className="pt-0">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[60px] rounded-[var(--radius-sm)]" />
                  ))}
                </div>
              ) : todayEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
                  <Calendar size={28} className="mb-2 text-text-disabled" />
                  <p className="text-sm font-medium">No classes today</p>
                  <p className="text-xs mt-1">Enjoy your day!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {todayEvents.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-border p-3"
                    >
                      <div className={cn(
                        "h-2 w-2 shrink-0 rounded-full",
                        event.status === "SCHEDULED" ? "bg-primary" :
                        event.status === "IN_PROGRESS" ? "bg-warning" :
                        event.status === "COMPLETED" ? "bg-success" : "bg-danger",
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{event.title}</p>
                        <p className="text-xs text-text-secondary">{event.startTime} - {event.endTime}</p>
                      </div>
                      <Badge size="sm" variant="outline">{event.batch?.name || event.title}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Clock size={16} className="text-primary" /> Upcoming Sessions
              </h3>
            </CardHeader>
            <CardBody className="pt-0">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-[60px] rounded-[var(--radius-sm)]" />
                  ))}
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
                  <Clock size={28} className="mb-2 text-text-disabled" />
                  <p className="text-sm font-medium">No upcoming sessions</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingEvents.slice(0, 4).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-border p-3"
                    >
                      <div className="flex flex-col items-center min-w-[36px]">
                        <span className="text-sm font-bold text-text-primary">
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="text-[10px] text-text-secondary uppercase">
                          {new Date(event.date).toLocaleDateString("en", { month: "short" })}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{event.title}</p>
                        <p className="text-xs text-text-secondary">{event.startTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
