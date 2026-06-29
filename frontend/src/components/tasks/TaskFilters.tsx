"use client";

import * as React from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { EntitySearch } from "@/components/shared/EntitySearch";
import type { TaskStatus, TaskType } from "@/types/tasks";

export interface TaskFiltersValue {
  batchId: string;
  batchLabel: string;
  status: TaskStatus | "";
  type: TaskType | "";
}

interface TaskFiltersProps {
  value: TaskFiltersValue;
  onChange: (value: TaskFiltersValue) => void;
}

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "SUBMISSION_CLOSED", label: "Closed" },
  { value: "GRADED", label: "Graded" },
];

const TYPE_OPTIONS = [
  { value: "", label: "All types" },
  { value: "HOMEWORK", label: "Homework" },
  { value: "ASSIGNMENT", label: "Assignment" },
  { value: "QUIZ", label: "Quiz" },
  { value: "PROJECT", label: "Project" },
  { value: "EXAM", label: "Exam" },
];

export function TaskFilters({ value, onChange }: TaskFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-text-primary">Batch</label>
        <EntitySearch
          searchType="batches"
          placeholder="Filter by batch…"
          onSelect={(item) =>
            onChange({ ...value, batchId: item.id, batchLabel: item.label })
          }
        />
        {value.batchLabel && (
          <p className="mt-1 text-xs text-text-secondary">Selected: {value.batchLabel}</p>
        )}
      </div>
      <Select
        label="Status"
        options={STATUS_OPTIONS}
        value={value.status}
        onChange={(e) => onChange({ ...value, status: e.target.value as TaskStatus | "" })}
      />
      <Select
        label="Type"
        options={TYPE_OPTIONS}
        value={value.type}
        onChange={(e) => onChange({ ...value, type: e.target.value as TaskType | "" })}
      />
    </div>
  );
}

export function TaskFiltersCard({
  value,
  onChange,
  onApply,
}: {
  value: TaskFiltersValue;
  onChange: (value: TaskFiltersValue) => void;
  onApply: () => void;
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardBody className="space-y-4 pt-0">
        <TaskFilters value={value} onChange={onChange} />
        <button
          type="button"
          onClick={onApply}
          className="inline-flex h-8 items-center rounded-[var(--radius-sm)] bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Apply Filters
        </button>
      </CardBody>
    </Card>
  );
}
