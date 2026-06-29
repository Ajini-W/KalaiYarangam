"use client";

import { Switch } from "@/components/ui/Switch";
import type { Task } from "@/types/tasks";

interface PublishToggleProps {
  task: Task;
  disabled?: boolean;
  onToggle: (publish: boolean) => void;
}

export function PublishToggle({ task, disabled, onToggle }: PublishToggleProps) {
  const isPublished = task.status === "ACTIVE" || task.status === "SUBMISSION_CLOSED" || task.status === "GRADED";
  const canPublish = task.status === "PENDING";

  if (!canPublish && !isPublished) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-border px-3 py-2">
      <div>
        <p className="text-sm font-medium text-text-primary">Published</p>
        <p className="text-xs text-text-secondary">
          {isPublished ? "Students can view this task" : "Publish to make visible to students"}
        </p>
      </div>
      <Switch
        checked={isPublished}
        disabled={disabled || !canPublish}
        onCheckedChange={(checked) => checked && onToggle(true)}
      />
    </div>
  );
}

interface CloseToggleProps {
  task: Task;
  disabled?: boolean;
  onToggle: (close: boolean) => void;
}

export function CloseToggle({ task, disabled, onToggle }: CloseToggleProps) {
  const isClosed = task.status === "SUBMISSION_CLOSED" || task.status === "GRADED";
  const canClose = task.status === "ACTIVE";

  if (!canClose && !isClosed) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-border px-3 py-2">
      <div>
        <p className="text-sm font-medium text-text-primary">Submissions closed</p>
        <p className="text-xs text-text-secondary">
          {isClosed ? "No new submissions accepted" : "Stop accepting new submissions"}
        </p>
      </div>
      <Switch
        checked={isClosed}
        disabled={disabled || !canClose}
        onCheckedChange={(checked) => checked && onToggle(true)}
      />
    </div>
  );
}
