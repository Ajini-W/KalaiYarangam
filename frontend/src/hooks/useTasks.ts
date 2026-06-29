"use client";

import * as React from "react";
import { toast } from "sonner";
import { tasksService } from "@/services/tasks.service";
import type {
  CreateTaskPayload,
  SubmitTaskPayload,
  Task,
  TaskListParams,
  TaskSubmission,
  UpdateSubmissionPayload,
  UpdateTaskPayload,
} from "@/types/tasks";

export function useTaskList(initialParams: TaskListParams = {}) {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [meta, setMeta] = React.useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [params, setParams] = React.useState(initialParams);

  const fetch = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await tasksService.list(params);
      setTasks(result.data);
      setMeta(result.meta);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load tasks";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return { tasks, meta, loading, error, params, setParams, refetch: fetch };
}

export function useTask(id: string | null) {
  const [task, setTask] = React.useState<Task | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetch = React.useCallback(async () => {
    if (!id) {
      setTask(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await tasksService.getById(id);
      setTask(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load task";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return { task, loading, error, refetch: fetch };
}

export function useTaskSubmissions(taskId: string | null) {
  const [submissions, setSubmissions] = React.useState<TaskSubmission[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetch = React.useCallback(async () => {
    if (!taskId) {
      setSubmissions([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await tasksService.getSubmissions(taskId);
      setSubmissions(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load submissions";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return { submissions, loading, error, refetch: fetch };
}

export function useTaskMutations() {
  const [saving, setSaving] = React.useState(false);

  const create = async (payload: CreateTaskPayload) => {
    setSaving(true);
    try {
      const result = await tasksService.create(payload);
      toast.success("Task created");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create task";
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: string, payload: UpdateTaskPayload) => {
    setSaving(true);
    try {
      const result = await tasksService.update(id, payload);
      toast.success("Task updated");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update task";
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const archive = async (id: string) => {
    try {
      const result = await tasksService.archive(id);
      toast.success("Task archived");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to archive task";
      toast.error(message);
      throw err;
    }
  };

  const restore = async (id: string) => {
    try {
      const result = await tasksService.restore(id);
      toast.success("Task restored");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to restore task";
      toast.error(message);
      throw err;
    }
  };

  const publish = async (id: string) => {
    try {
      const result = await tasksService.publish(id);
      toast.success("Task published");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to publish task";
      toast.error(message);
      throw err;
    }
  };

  const close = async (id: string) => {
    try {
      const result = await tasksService.close(id);
      toast.success("Task closed");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to close task";
      toast.error(message);
      throw err;
    }
  };

  const gradeSubmission = async (
    taskId: string,
    submissionId: string,
    payload: UpdateSubmissionPayload,
  ) => {
    setSaving(true);
    try {
      const result = await tasksService.updateSubmission(taskId, submissionId, payload);
      toast.success("Submission reviewed");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to review submission";
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const submit = async (taskId: string, payload: SubmitTaskPayload) => {
    setSaving(true);
    try {
      const result = await tasksService.submit(taskId, payload);
      toast.success("Submission saved");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit task";
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { saving, create, update, archive, restore, publish, close, gradeSubmission, submit };
}
