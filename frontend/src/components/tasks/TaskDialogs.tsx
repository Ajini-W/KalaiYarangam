"use client";

import { ConfirmModal } from "@/components/ui/Modal";
import type { Task } from "@/types/tasks";

interface ArchiveDialogProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function ArchiveDialog({ task, open, onClose, onConfirm, loading }: ArchiveDialogProps) {
  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Archive task"
      description={
        task
          ? `Archive "${task.title}"? It will be hidden from the active list but can be restored later.`
          : undefined
      }
      confirmLabel="Archive"
      intent="warning"
      loading={loading}
    />
  );
}

interface RestoreDialogProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function RestoreDialog({ task, open, onClose, onConfirm, loading }: RestoreDialogProps) {
  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Restore task"
      description={
        task ? `Restore "${task.title}" to the active task list?` : undefined
      }
      confirmLabel="Restore"
      intent="info"
      loading={loading}
    />
  );
}
