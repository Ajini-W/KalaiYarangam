"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/EmptyState";
import { EntitySearch } from "@/components/shared/EntitySearch";
import { AttendanceNav } from "./AttendanceNav";
import {
  AttendanceMarkGrid,
  gridRowsToRecords,
  recordsToGridRows,
  type MarkGridRow,
} from "./AttendanceMarkGrid";
import { BulkMarkDialog } from "./BulkMarkDialog";
import {
  useAttendanceList,
  useAttendanceMutations,
  useAttendanceSession,
} from "@/hooks/useAttendance";
import { attendanceService } from "@/services/attendance.service";
import type { SearchResultItem } from "@/services/search.service";
import type { BulkMarkFormValues } from "@/validations/attendance";

interface AttendanceMarkViewProps {
  basePath: string;
}

export function AttendanceMarkView({ basePath }: AttendanceMarkViewProps) {
  const searchParams = useSearchParams();
  const sessionIdParam = searchParams.get("sessionId");

  const [batchId, setBatchId] = React.useState("");
  const [batchLabel, setBatchLabel] = React.useState("");
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [sessionId, setSessionId] = React.useState<string | null>(sessionIdParam);
  const [rows, setRows] = React.useState<MarkGridRow[]>([]);
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [loadingGrid, setLoadingGrid] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const { session, loading: sessionLoading, refetch: refetchSession } = useAttendanceSession(sessionId);
  const { setParams: setListParams } = useAttendanceList({ page: 1, pageSize: 1 });
  const { saving, create, update, bulkMark, lockSession, unlockSession } = useAttendanceMutations();

  const isLocked = !!session?.isLocked;
  const scheduleId = session?.classSessionId ?? session?.scheduleId;

  React.useEffect(() => {
    if (sessionIdParam) setSessionId(sessionIdParam);
  }, [sessionIdParam]);

  React.useEffect(() => {
    if (session?.records) {
      setRows(recordsToGridRows(session.records));
      setBatchId(session.batchId);
      setDate(new Date(session.date).toISOString().slice(0, 10));
    }
  }, [session]);

  const loadSessionForBatchDate = React.useCallback(async () => {
    if (!batchId || !date) return;
    setLoadingGrid(true);
    setLoadError(null);
    try {
      setListParams({ batchId, dateFrom: date, dateTo: date, page: 1, pageSize: 1 });
      const result = await attendanceService.list({
        batchId,
        dateFrom: date,
        dateTo: date,
        page: 1,
        pageSize: 1,
      });
      if (result.data[0]) {
        setSessionId(result.data[0].id);
        const detail = await attendanceService.getById(result.data[0].id);
        setRows(recordsToGridRows(detail.records ?? []));
      } else {
        setSessionId(null);
        setRows([]);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load session");
    } finally {
      setLoadingGrid(false);
    }
  }, [batchId, date, setListParams]);

  const handleBatchSelect = (item: SearchResultItem) => {
    setBatchId(item.id);
    setBatchLabel(item.label);
  };

  React.useEffect(() => {
    if (batchId && date && !sessionIdParam) {
      loadSessionForBatchDate();
    }
  }, [batchId, date, sessionIdParam, loadSessionForBatchDate]);

  const handleSave = async () => {
    if (rows.length === 0 || isLocked) return;
    const records = gridRowsToRecords(rows).map((r) => ({
      studentId: r.studentId,
      status: r.status,
      remarks: r.remarks ?? undefined,
    }));

    if (sessionId) {
      await update(sessionId, { records });
      await refetchSession();
    } else {
      const created = await create({ batchId, date, records });
      setSessionId(created.id);
    }
  };

  const handleBulkSubmit = async (values: BulkMarkFormValues) => {
    const result = await bulkMark({
      batchId: values.batchId,
      classSessionId: values.classSessionId || undefined,
      date: values.date,
      defaultStatus: values.defaultStatus,
    });
    setSessionId(result.id);
    setRows(recordsToGridRows(result.records ?? []));
  };

  const handleLockToggle = async () => {
    if (!scheduleId) return;
    if (isLocked) {
      await unlockSession(scheduleId);
    } else {
      await lockSession(scheduleId);
    }
    await refetchSession();
  };

  if (loadError && !sessionLoading) {
    return (
      <PageContainer title="Mark Attendance" subtitle="Record attendance for a batch session.">
        <AttendanceNav basePath={basePath} />
        <ErrorState
          code={500}
          title="Unable to load attendance session"
          description={loadError}
          action={{ label: "Retry", onClick: loadSessionForBatchDate }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Mark Attendance"
      subtitle="Record attendance for a batch session."
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setBulkOpen(true)} disabled={isLocked}>
            Bulk Mark
          </Button>
          {scheduleId && (
            <Button variant="outline" size="sm" onClick={handleLockToggle}>
              {isLocked ? "Unlock Session" : "Lock Session"}
            </Button>
          )}
          <Button size="sm" onClick={handleSave} loading={saving} disabled={isLocked || rows.length === 0}>
            Save Attendance
          </Button>
        </div>
      }
    >
      <AttendanceNav basePath={basePath} />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 pt-0 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">Batch</label>
            <EntitySearch
              searchType="batches"
              onSelect={handleBatchSelect}
              disabled={isLocked}
            />
            {batchLabel && (
              <p className="mt-1 text-xs text-text-secondary">Selected: {batchLabel}</p>
            )}
          </div>
          <Input
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isLocked}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Grid</CardTitle>
        </CardHeader>
        <CardBody className="pt-0">
          <AttendanceMarkGrid
            rows={rows}
            loading={loadingGrid || sessionLoading}
            isLocked={isLocked}
            onRowsChange={setRows}
            onAddStudent={() => undefined}
            batchId={batchId}
          />
        </CardBody>
      </Card>

      <BulkMarkDialog
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onSubmit={handleBulkSubmit}
        loading={saving}
      />
    </PageContainer>
  );
}
