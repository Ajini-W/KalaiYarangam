"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import type { TaskStatus, TaskType } from "@/types/tasks";

const STATUS_VARIANT: Record<TaskStatus, "default" | "success" | "warning" | "danger" | "info"> = {
  PENDING: "warning",
  ACTIVE: "success",
  SUBMISSION_CLOSED: "info",
  GRADED: "info",
  CANCELLED: "danger",
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  PENDING: "Draft",
  ACTIVE: "Active",
  SUBMISSION_CLOSED: "Closed",
  GRADED: "Graded",
  CANCELLED: "Cancelled",
};

const TYPE_LABEL: Record<TaskType, string> = {
  HOMEWORK: "Homework",
  ASSIGNMENT: "Assignment",
  QUIZ: "Quiz",
  PROJECT: "Project",
  EXAM: "Exam",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}

export function TaskTypeBadge({ type }: { type: TaskType }) {
  return <Badge variant="outline">{TYPE_LABEL[type]}</Badge>;
}

export function formatTaskDueDate(dueDate?: string | null, taskStatus?: TaskStatus) {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  const isOverdue =
    taskStatus === "ACTIVE" && date.getTime() < Date.now();
  return { label: date.toLocaleDateString(), isOverdue };
}
