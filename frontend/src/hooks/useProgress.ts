"use client";

import * as React from "react";
import { toast } from "sonner";
import { progressService } from "@/services/progress.service";
import { withMockFallback } from "@/lib/mock-fallback";
import {
  getMockProgressList,
  getMockProgressRecord,
  MOCK_PROGRESS_SUMMARY,
} from "@/mocks";
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
  const [usingMock, setUsingMock] = React.useState(false);
  const [params, setParams] = React.useState(initialParams);

  const fetch = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, usingMock: isMock } = await withMockFallback(
        () => progressService.list(params),
        getMockProgressList,
      );
      setRecords(data.data);
      setMeta(data.meta);
      setUsingMock(isMock);
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

  return { records, meta, loading, error, usingMock, params, setParams, refetch: fetch };
}

export function useProgressSummary(initialParams: ProgressSummaryParams = {}) {
  const [summary, setSummary] = React.useState<ProgressSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [usingMock, setUsingMock] = React.useState(false);
  const [params, setParams] = React.useState(initialParams);

  const fetch = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, usingMock: isMock } = await withMockFallback(
        () => progressService.getSummary(params),
        () => MOCK_PROGRESS_SUMMARY,
      );
      setSummary(data);
      setUsingMock(isMock);
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

  return { summary, loading, error, usingMock, params, setParams, refetch: fetch };
}

export function useProgressRecord(id: string | null) {
  const [record, setRecord] = React.useState<ProgressRecord | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [usingMock, setUsingMock] = React.useState(false);

  const fetch = React.useCallback(async () => {
    if (!id) {
      setRecord(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, usingMock: isMock } = await withMockFallback(
        () => progressService.getById(id),
        () => {
          const mock = getMockProgressRecord(id);
          if (!mock) throw new Error("Progress record not found");
          return mock;
        },
      );
      setRecord(data);
      setUsingMock(isMock);
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

  return { record, loading, error, usingMock, refetch: fetch };
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
