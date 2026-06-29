"use client";

import * as React from "react";
import { Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { Task, TaskSubmission } from "@/types/tasks";

function isOverdueSubmission(submission: TaskSubmission, task: Task) {
  if (!task.dueDate || !submission.submittedAt) return false;
  return new Date(submission.submittedAt) > new Date(task.dueDate);
}

interface SubmissionCardProps {
  submission: TaskSubmission;
  task: Task;
  selected?: boolean;
  onSelect?: () => void;
}

export function SubmissionCard({ submission, task, selected, onSelect }: SubmissionCardProps) {
  const overdue = submission.status === "LATE" || isOverdueSubmission(submission, task);

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:border-primary/40",
        selected && "border-primary ring-1 ring-primary/30",
        overdue && "border-warning/60 bg-warning-light/20",
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect?.()}
    >
      <CardBody className="space-y-2 py-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <User size={14} className="shrink-0 text-text-secondary" />
            <span className="truncate text-sm font-medium text-text-primary">
              {submission.student?.name ?? "Student"}
            </span>
          </div>
          <Badge
            variant={
              submission.status === "GRADED"
                ? "success"
                : overdue
                  ? "warning"
                  : submission.status === "RETURNED"
                    ? "danger"
                    : "info"
            }
          >
            {overdue && submission.status !== "GRADED" ? "Overdue" : submission.status.replace("_", " ")}
          </Badge>
        </div>

        {submission.submittedAt && (
          <p className="flex items-center gap-1 text-xs text-text-secondary">
            <Clock size={12} />
            Submitted {new Date(submission.submittedAt).toLocaleString()}
          </p>
        )}

        {submission.content && (
          <p className="line-clamp-2 text-sm text-text-secondary">{submission.content}</p>
        )}

        {submission.score != null && (
          <p className="text-xs font-medium text-text-primary">
            Score: {submission.score}
            {task.maxScore ? ` / ${task.maxScore}` : ""}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
