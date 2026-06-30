"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Calendar, Clock, MapPin, BookOpen } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Card, CardHeader, CardBody, Badge, Modal, Input, Select, Textarea, Skeleton } from "@/components/ui";
import { ScheduleCalendar } from "../components/ScheduleCalendar";
import { getSchedules, createSchedule, updateSchedule, cancelSchedule, rescheduleEvent, getBatches, getTrainers, type ScheduleEvent, type Batch, type Trainer } from "@/services/training";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

export function SchedulesPage() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    batchId: "",
    trainerId: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    topic: "",
    status: "SCHEDULED" as string,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [eventsRes, batchesRes, trainersRes] = await Promise.all([
        getSchedules(),
        getBatches({ pageSize: 100 }),
        getTrainers({ pageSize: 100 }),
      ]);
      setEvents(eventsRes.data ?? []);
      setBatches(batchesRes.data ?? []);
      setTrainers(trainersRes.data ?? []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => {
    setFormData({ title: "", batchId: "", trainerId: "", date: "", startTime: "", endTime: "", room: "", topic: "", status: "SCHEDULED" });
  };

  const handleSubmit = async () => {
    const payload = { ...formData } as unknown as Partial<ScheduleEvent>;
    setSubmitting(true);
    try {
      if (editingEvent) {
        await updateSchedule(editingEvent.id, payload);
        toast.success("Schedule updated");
      } else {
        await createSchedule(payload);
        toast.success("Session scheduled");
      }
      setModalOpen(false);
      setEditingEvent(null);
      resetForm();
      fetchData();
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
      fetchData();
    } catch {
      toast.error("Failed to cancel session");
    }
  };

  const handleEventClick = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      batchId: event.batchId,
      trainerId: event.trainerId,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      room: event.room ?? "",
      topic: event.topic ?? "",
      status: event.status,
    });
    setModalOpen(true);
  };

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
      <ScheduleCalendar
        events={events}
        loading={loading}
        onEventClick={handleEventClick}
      />

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingEvent(null); resetForm(); }}
        title={editingEvent ? "Edit Session" : "Schedule Session"}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Session Title"
            required
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Batch"
              placeholder="Select batch"
              options={batches.map((b) => ({ value: b.id, label: b.name }))}
              value={formData.batchId}
              onChange={(e) => setFormData((p) => ({ ...p, batchId: e.target.value, title: e.target.value ? batches.find((b) => b.id === e.target.value)?.name ?? p.title : p.title }))}
            />
            <Select
              label="Trainer"
              placeholder="Select trainer"
              options={trainers.map((t) => ({ value: t.id, label: t.name }))}
              value={formData.trainerId}
              onChange={(e) => setFormData((p) => ({ ...p, trainerId: e.target.value }))}
            />
          </div>
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Room"
              value={formData.room}
              onChange={(e) => setFormData((p) => ({ ...p, room: e.target.value }))}
              placeholder="Room number"
            />
            <Select
              label="Status"
              options={[
                { value: "SCHEDULED", label: "Scheduled" },
                { value: "IN_PROGRESS", label: "In Progress" },
                { value: "COMPLETED", label: "Completed" },
                { value: "CANCELLED", label: "Cancelled" },
              ]}
              value={formData.status}
              onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
            />
          </div>
          <Textarea
            label="Topic / Notes"
            value={formData.topic}
            onChange={(e) => setFormData((p) => ({ ...p, topic: e.target.value }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => { setModalOpen(false); setEditingEvent(null); resetForm(); }}>
              Cancel
            </Button>
            {editingEvent && editingEvent.status !== "CANCELLED" && (
              <Button variant="danger" type="button" onClick={() => { handleCancel(editingEvent); setModalOpen(false); }}>
                Cancel Session
              </Button>
            )}
            <Button onClick={handleSubmit} loading={submitting}>
              {editingEvent ? "Update" : "Schedule"}
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
