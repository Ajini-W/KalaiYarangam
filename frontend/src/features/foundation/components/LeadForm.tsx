"use client";

import { useState } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import type { Lead, LeadSource, LeadStatus } from "@/services/leads";

export type LeadFormData = {
  name: string;
  email: string;
  phone: string;
  course: string;
  source: LeadSource;
  status: LeadStatus;
  notes: string;
  assignedTo: string;
  nextFollowUp: string;
};

interface LeadFormProps {
  initialData?: Lead | null;
  onSubmit: (data: LeadFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function LeadForm({ initialData, onSubmit, onCancel, loading }: LeadFormProps) {
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    course: initialData?.course ?? "",
    source: initialData?.source ?? ("WALK_IN" as LeadSource),
    status: initialData?.status ?? ("NEW" as LeadStatus),
    notes: initialData?.notes ?? "",
    assignedTo: initialData?.assignedTo ?? "",
    nextFollowUp: initialData?.nextFollowUp ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Enter full name" required />
        <Input label="Phone *" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Enter phone number" required />
        <Input label="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Enter email address" type="email" />
        <Input label="Course Interested" value={form.course} onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))} placeholder="e.g. Bharatanatyam" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Lead Source"
          value={form.source}
          onChange={(e) => setForm((p) => ({ ...p, source: e.target.value as LeadSource }))}
          options={[
            { value: "WALK_IN", label: "Walk In" },
            { value: "PHONE", label: "Phone" },
            { value: "WEBSITE", label: "Website" },
            { value: "SOCIAL_MEDIA", label: "Social Media" },
            { value: "REFERRAL", label: "Referral" },
            { value: "ADVERTISEMENT", label: "Advertisement" },
            { value: "OTHER", label: "Other" },
          ]}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as LeadStatus }))}
          options={[
            { value: "NEW", label: "New" },
            { value: "CONTACTED", label: "Contacted" },
            { value: "FOLLOWUP", label: "Follow Up" },
            { value: "INTERESTED", label: "Interested" },
            { value: "DEMO_SCHEDULED", label: "Demo Scheduled" },
            { value: "CONVERTED", label: "Converted" },
            { value: "LOST", label: "Lost" },
          ]}
        />
      </div>

      <Textarea
        label="Notes"
        value={form.notes}
        onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
        placeholder="Add any notes about this lead..."
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Next Follow-up Date"
          type="datetime-local"
          value={form.nextFollowUp}
          onChange={(e) => setForm((p) => ({ ...p, nextFollowUp: e.target.value }))}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>
          {initialData ? "Update Lead" : "Create Lead"}
        </Button>
      </div>
    </form>
  );
}
