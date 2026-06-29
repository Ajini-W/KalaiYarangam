"use client";

import * as React from "react";
import { toast } from "sonner";
import { progressService } from "@/services/progress.service";
import type {
  CreateProgressPayload,
  ProgressListParams,
  ProgressRecord,
  ProgressSummary,
  ProgressSummaryParams,
  RecalculateProgressPayload,
  UpdateProgressPayload,
} from "@/types/progress";

export function useProgressList(initialParams: ProgressListParams = {}) {
  const [records, setRecords] = React.useState<ProgressRecord[]>([]);
  const [meta, setMeta] = React.useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [params, setParams] = React.useState(initialParams);

  const fetch = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await progressService.list(params);
      setRecords(result.data);
      setMeta(result.meta);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load progress";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return { records, meta, loading, error, params, setParams, refetch: fetch };
}

export function useProgressSummary(initialParams: ProgressSummaryParams = {}) {
  const [summary, setSummary] = React.useState<ProgressSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [params, setParams] = React.useState(initialParams);

  const fetch = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await progressService.getSummary(params);
      setSummary(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load summary";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return { summary, loading, error, params, setParams, refetch: fetch };
}

export function useProgressRecord(id: string | null) {
  const [record, setRecord] = React.useState<ProgressRecord | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetch = React.useCallback(async () => {
    if (!id) {
      setRecord(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await progressService.getById(id);
      setRecord(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load progress record";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return { record, loading, error, refetch: fetch };
}

export function useProgressMutations() {
  const [saving, setSaving] = React.useState(false);

  const create = async (payload: CreateProgressPayload) => {
    setSaving(true);
    try {
      const result = await progressService.create(payload);
      toast.success("Progress saved");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save progress";
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: string, payload: UpdateProgressPayload) => {
    setSaving(true);
    try {
      const result = await progressService.update(id, payload);
      toast.success("Progress updated");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update progress";
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const recalculate = async (payload: RecalculateProgressPayload = {}) => {
    setSaving(true);
    try {
      const result = await progressService.recalculate(payload);
      toast.success("Progress recalculated");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to recalculate progress";
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { saving, create, update, recalculate };
}
