"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Grid3X3 } from "lucide-react";
import { Button, Badge, Card, CardHeader, CardBody, Skeleton } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { ScheduleEvent } from "@/services/training";

type ViewMode = "month" | "week" | "day" | "agenda";

interface ScheduleCalendarProps {
  events: ScheduleEvent[];
  loading?: boolean;
  onEventClick?: (event: ScheduleEvent) => void;
  onDateSelect?: (date: Date) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getStatusColor(status: string): string {
  switch (status) {
    case "SCHEDULED": return "bg-primary/10 text-primary border-primary/20";
    case "IN_PROGRESS": return "bg-warning/10 text-warning-700 border-warning/20";
    case "COMPLETED": return "bg-success/10 text-success-700 border-success/20";
    case "CANCELLED": return "bg-danger/10 text-danger-700 border-danger/20";
    default: return "bg-surface-overlay text-text-secondary border-border";
  }
}

export function ScheduleCalendar({ events, loading, onEventClick, onDateSelect }: ScheduleCalendarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const days: Array<{ date: Date; day: number; isCurrentMonth: boolean; isToday: boolean; events: ScheduleEvent[] }> = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      days.push({ date: d, day: d.getDate(), isCurrentMonth: false, isToday: d.getTime() === today.getTime(), events: [] });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const dayEvents = events.filter((e) => {
        const eDate = new Date(e.date);
        return eDate.getFullYear() === year && eDate.getMonth() === month && eDate.getDate() === i;
      });
      days.push({ date: d, day: i, isCurrentMonth: true, isToday: d.getTime() === today.getTime(), events: dayEvents });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, day: i, isCurrentMonth: false, isToday: false, events: [] });
    }

    return days;
  }, [year, month, firstDayOfMonth, daysInMonth, events]);

  const navigate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") newDate.setMonth(newDate.getMonth() + direction);
    else if (viewMode === "week") newDate.setDate(newDate.getDate() + 7 * direction);
    else newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const viewTitle = useMemo(() => {
    if (viewMode === "month") return `${MONTHS[month]} ${year}`;
    if (viewMode === "day") return `${currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`;
    return `${MONTHS[month]} ${year}`;
  }, [viewMode, month, year, currentDate]);

  if (loading) {
    return <Skeleton className="h-[500px] rounded-[var(--radius-md)]" />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button size="xs" variant="ghost" onClick={() => navigate(-1)} aria-label="Previous">
            <ChevronLeft size={16} />
          </Button>
          <h3 className="text-sm font-semibold min-w-[160px] text-center">{viewTitle}</h3>
          <Button size="xs" variant="ghost" onClick={() => navigate(1)} aria-label="Next">
            <ChevronRight size={16} />
          </Button>
          <Button size="xs" variant="outline" onClick={() => setCurrentDate(new Date())} className="ml-2">
            Today
          </Button>
        </div>
        <div className="flex items-center gap-1 rounded-[var(--radius-sm)] border border-border p-0.5">
          {(["month", "week", "day", "agenda"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "flex items-center gap-1 rounded-[var(--radius-xs)] px-2 py-1 text-xs font-medium transition-colors",
                viewMode === mode ? "bg-primary text-primary-foreground" : "text-text-secondary hover:text-text-primary",
              )}
            >
              {mode === "month" && <Grid3X3 size={12} />}
              {mode === "agenda" && <List size={12} />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        {viewMode === "month" && (
          <div>
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((day) => (
                <div key={day} className="py-2 text-center text-xs font-semibold text-text-secondary">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendarDays.map((day, i) => (
                <button
                  key={i}
                  onClick={() => onDateSelect?.(day.date)}
                  className={cn(
                    "min-h-[80px] border border-border-subtle p-1 text-left transition-colors hover:bg-surface-overlay",
                    !day.isCurrentMonth && "opacity-40",
                    day.isToday && "bg-primary/5 border-primary/20",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs",
                      day.isToday && "bg-primary text-primary-foreground font-semibold",
                    )}
                  >
                    {day.day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {day.events.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }}
                        className={cn(
                          "truncate rounded-[2px] px-1 py-0.5 text-[10px] font-medium border cursor-pointer",
                          getStatusColor(event.status),
                        )}
                      >
                        {event.startTime} {event.title}
                      </div>
                    ))}
                    {day.events.length > 3 && (
                      <span className="text-[10px] text-text-secondary pl-1">+{day.events.length - 3} more</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {viewMode === "agenda" && (
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-secondary">No scheduled events</p>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className="flex items-center gap-4 rounded-[var(--radius-sm)] border border-border p-3 transition-colors hover:bg-surface-overlay cursor-pointer"
                >
                  <div className="flex flex-col items-center min-w-[48px]">
                    <span className="text-lg font-bold text-text-primary">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {MONTHS[new Date(event.date).getMonth()].slice(0, 3)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{event.title}</p>
                    <p className="text-xs text-text-secondary">
                      {event.startTime} - {event.endTime} | {event.batch?.name ?? event.title}
                    </p>
                    {event.topic && <p className="text-xs text-text-secondary mt-0.5">{event.topic}</p>}
                  </div>
                  <Badge
                    variant={
                      event.status === "SCHEDULED" ? "info" :
                      event.status === "IN_PROGRESS" ? "warning" :
                      event.status === "COMPLETED" ? "success" : "danger"
                    }
                    size="sm"
                  >
                    {event.status.replace("_", " ")}
                  </Badge>
                </div>
              ))
            )}
          </div>
        )}

        {viewMode !== "month" && viewMode !== "agenda" && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-text-secondary">
              {viewMode === "week" ? "Week" : "Day"} view coming soon
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
