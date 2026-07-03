"use client";

import * as React from "react";
import { toast } from "sonner";
import { attendanceService } from "@/services/attendance.service";
import { withMockFallback } from "@/lib/mock-fallback";
import {
  getMockAttendanceList,
  getMockAttendanceSession,
  MOCK_ATTENDANCE_SUMMARY,
} from "@/mocks";
import type {
  AttendanceListParams,
  AttendanceSession,
  AttendanceSummary,
  AttendanceSummaryParams,
  BulkMarkAttendancePayload,
  CreateAttendancePayload,
  UpdateAttendancePayload,
} from "@/types/attendance";

export function useAttendanceList(initialParams: AttendanceListParams = {}) {
  const [sessions, setSessions] = React.useState<AttendanceSession[]>([]);
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
        () => attendanceService.list(params),
        getMockAttendanceList,
      );
      setSessions(data.data);
      setMeta(data.meta);
      setUsingMock(isMock);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load attendance";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    sessions,
    meta,
    loading,
    error,
    usingMock,
    params,
    setParams,
    refetch: fetch,
  };
}

export function useAttendanceSummary(initialParams: AttendanceSummaryParams = {}) {
  const [summary, setSummary] = React.useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [usingMock, setUsingMock] = React.useState(false);
  const [params, setParams] = React.useState(initialParams);

  const fetch = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, usingMock: isMock } = await withMockFallback(
        () => attendanceService.getSummary(params),
        () => MOCK_ATTENDANCE_SUMMARY,
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

export function useAttendanceSession(id: string | null) {
  const [session, setSession] = React.useState<AttendanceSession | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [usingMock, setUsingMock] = React.useState(false);

  const fetch = React.useCallback(async () => {
    if (!id) {
      setSession(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, usingMock: isMock } = await withMockFallback(
        () => attendanceService.getById(id),
        () => {
          const mock = getMockAttendanceSession(id);
          if (!mock) throw new Error("Session not found");
          return mock;
        },
      );
      setSession(data);
      setUsingMock(isMock);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load session";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return { session, loading, error, usingMock, refetch: fetch };
}

export function useAttendanceMutations() {
  const [saving, setSaving] = React.useState(false);

  const create = async (payload: CreateAttendancePayload) => {
    setSaving(true);
    try {
      const result = await attendanceService.create(payload);
      toast.success("Attendance saved");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save attendance";
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: string, payload: UpdateAttendancePayload) => {
    setSaving(true);
    try {
      const result = await attendanceService.update(id, payload);
      toast.success("Attendance updated");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update attendance";
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const bulkMark = async (payload: BulkMarkAttendancePayload) => {
    setSaving(true);
    try {
      const result = await attendanceService.bulkMark(payload);
      toast.success("Bulk attendance marked");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to bulk mark attendance";
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const lockSession = async (scheduleId: string) => {
    try {
      const result = await attendanceService.lockSession(scheduleId);
      toast.success("Session locked");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to lock session";
      toast.error(message);
      throw err;
    }
  };

  const unlockSession = async (scheduleId: string) => {
    try {
      const result = await attendanceService.unlockSession(scheduleId);
      toast.success("Session unlocked");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to unlock session";
      toast.error(message);
      throw err;
    }
  };

  return { saving, create, update, bulkMark, lockSession, unlockSession };
}
