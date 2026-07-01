"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Calendar, Clock, MapPin, BookOpen, ListOrdered, ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Card, CardHeader, CardBody, Badge, Modal, Input, Select, Textarea, Skeleton, StatCard } from "@/components/ui";
import { ScheduleCalendar } from "../components/ScheduleCalendar";
import { getSchedules, getTodaySchedule, getUpcomingSchedule, getCalendar, createSchedule, updateSchedule, cancelSchedule, rescheduleEvent, getBatches, getTrainers, type ScheduleEvent, type Batch, type Trainer } from "@/services/training";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

export function SchedulesPage() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [todayEvents, setTodayEvents] = useState<ScheduleEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<ScheduleEvent[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<ScheduleEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "today" | "upcoming">("all");
  const [formData, setFormData] = useState({
    batchId: "",
    date: "",
    startTime: "",
    endTime: "",
    topic: "",
    notes: "",
  });
  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [eventsRes, todayRes, upcomingRes, batchesRes, trainersRes] = await Promise.all([
        getSchedules(),
        getTodaySchedule(),
        getUpcomingSchedule(),
        getBatches({ pageSize: 100 }),
        getTrainers({ pageSize: 100 }),
      ]);
      setEvents(eventsRes.data ?? []);
      setTodayEvents(todayRes.data ?? []);
      setUpcomingEvents(upcomingRes.data ?? []);
      setBatches(batchesRes.data ?? []);
      setTrainers(trainersRes.data ?? []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const resetForm = () => {
    setFormData({ batchId: "", date: "", startTime: "", endTime: "", topic: "", notes: "" });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (editingEvent) {
        await updateSchedule(editingEvent.id, formData as unknown as Partial<ScheduleEvent>);
        toast.success("Schedule updated");
      } else {
        await createSchedule(formData as unknown as Partial<ScheduleEvent>);
        toast.success("Session scheduled");
      }
      setModalOpen(false);
      setEditingEvent(null);
      resetForm();
      fetchAllData();
    } catch {
      toast.error("Failed to save schedule");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (event: ScheduleEvent) => {
    try {
      await cancelSchedule(event.id);
      toast.success("Session cancelled");
      fetchAllData();
    } catch {
      toast.error("Failed to cancel session");
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleTarget) return;
    setSubmitting(true);
    try {
      await rescheduleEvent(rescheduleTarget.id, rescheduleData);
      toast.success("Session rescheduled");
      setRescheduleOpen(false);
      setRescheduleTarget(null);
      fetchAllData();
    } catch {
      toast.error("Failed to reschedule session");
    } finally {
      setSubmitting(false);
    }
  };

  const openReschedule = (event: ScheduleEvent) => {
    setRescheduleTarget(event);
    setRescheduleData({
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
    });
    setRescheduleOpen(true);
  };

  const handleEventClick = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setFormData({
      batchId: event.batchId,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      topic: event.topic ?? "",
      notes: event.notes ?? "",
    });
    setModalOpen(true);
  };

  const currentEvents = activeTab === "today" ? todayEvents : activeTab === "upcoming" ? upcomingEvents : events;

  return (
    <PageContainer
      title="Schedule"
      subtitle="Manage class schedules and sessions"
      actions={
        <Button size="sm" onClick={() => { setEditingEvent(null); resetForm(); setModalOpen(true); }}>
          <Plus size={16} /> New Session
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <StatCard title="Today's Sessions" value={todayEvents.length} icon={<Calendar size={18} />} />
        <StatCard title="Upcoming" value={upcomingEvents.length} icon={<Clock size={18} />} />
        <StatCard title="Total Scheduled" value={events.length} icon={<ListOrdered size={18} />} />
      </div>

      <div className="flex gap-1 rounded-[var(--radius-sm)] border border-border p-0.5 mb-4">
        {(["all", "today", "upcoming"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1 rounded-[var(--radius-xs)] px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab === "all" ? "All Sessions" : tab}
          </button>
        ))}
      </div>

      {activeTab === "all" ? (
        <ScheduleCalendar
          events={events}
          loading={loading}
          onEventClick={handleEventClick}
        />
      ) : (
        <Card>
          <CardBody>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-[60px] rounded-[var(--radius-sm)]" />
                ))}
              </div>
            ) : currentEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
                <Calendar size={40} className="mb-3 text-text-disabled" />
                <p className="text-sm font-medium">No sessions {activeTab === "today" ? "today" : "upcoming"}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentEvents.slice(0, 20).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 rounded-[var(--radius-sm)] border border-border px-4 py-3 transition-colors hover:bg-surface-overlay cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex flex-col items-center min-w-[44px]">
                      <span className="text-base font-bold text-text-primary">{new Date(event.date).getDate()}</span>
                      <span className="text-xs text-text-secondary">{new Date(event.date).toLocaleDateString("en", { month: "short" })}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{event.title || event.batch?.name || "Session"}</p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-text-secondary">
                        <span className="flex items-center gap-1"><Clock size={10} />{event.startTime} - {event.endTime}</span>
                        {event.batch?.name && <span className="flex items-center gap-1"><BookOpen size={10} />{event.batch.name}</span>}
                        {event.topic && <span className="truncate">• {event.topic}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={event.status === "SCHEDULED" ? "info" : event.status === "IN_PROGRESS" ? "warning" : event.status === "COMPLETED" ? "success" : "danger"}
                        size="sm"
                      >
                        {event.status.replace("_", " ")}
                      </Badge>
                      {event.status === "SCHEDULED" && (
                        <Button size="xs" variant="ghost" onClick={(e) => { e.stopPropagation(); openReschedule(event); }} title="Reschedule">
                          <ArrowRight size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingEvent(null); resetForm(); }}
        title={editingEvent ? "Edit Session" : "Schedule Session"}
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Batch"
            placeholder="Select batch"
            options={batches.map((b) => ({ value: b.id, label: b.name }))}
            value={formData.batchId}
            onChange={(e) => setFormData((p) => ({ ...p, batchId: e.target.value }))}
          />
          <Input
            label="Date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              required
              value={formData.startTime}
              onChange={(e) => setFormData((p) => ({ ...p, startTime: e.target.value }))}
            />
            <Input
              label="End Time"
              type="time"
              required
              value={formData.endTime}
              onChange={(e) => setFormData((p) => ({ ...p, endTime: e.target.value }))}
            />
          </div>
          <Input
            label="Topic"
            value={formData.topic}
            onChange={(e) => setFormData((p) => ({ ...p, topic: e.target.value }))}
            placeholder="Session topic"
          />
          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => { setModalOpen(false); setEditingEvent(null); resetForm(); }}>
              Cancel
            </Button>
            {editingEvent && editingEvent.status !== "CANCELLED" && (
              <>
                <Button size="xs" variant="ghost" onClick={() => openReschedule(editingEvent)}>
                  <ArrowRight size={14} /> Reschedule
                </Button>
                <Button variant="danger" type="button" onClick={() => { handleCancel(editingEvent); setModalOpen(false); }}>
                  Cancel Session
                </Button>
              </>
            )}
            <Button onClick={handleSubmit} loading={submitting}>
              {editingEvent ? "Update" : "Schedule"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={rescheduleOpen}
        onClose={() => { setRescheduleOpen(false); setRescheduleTarget(null); }}
        title="Reschedule Session"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Reschedule &ldquo;{rescheduleTarget?.title || rescheduleTarget?.batch?.name || "Session"}&rdquo;
          </p>
          <Input
            label="New Date"
            type="date"
            required
            value={rescheduleData.date}
            onChange={(e) => setRescheduleData((p) => ({ ...p, date: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              required
              value={rescheduleData.startTime}
              onChange={(e) => setRescheduleData((p) => ({ ...p, startTime: e.target.value }))}
            />
            <Input
              label="End Time"
              type="time"
              required
              value={rescheduleData.endTime}
              onChange={(e) => setRescheduleData((p) => ({ ...p, endTime: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => { setRescheduleOpen(false); setRescheduleTarget(null); }}>Cancel</Button>
            <Button onClick={handleReschedule} loading={submitting}>Reschedule</Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}