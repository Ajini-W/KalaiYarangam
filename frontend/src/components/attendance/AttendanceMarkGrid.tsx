"use client";

import * as React from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { EntitySearch } from "@/components/shared/EntitySearch";
import { AttendanceStatusToggle } from "./AttendanceStatusToggle";
import { SessionLockIndicator } from "./SessionLockIndicator";
import type { AttendanceRecord, AttendanceStatus } from "@/types/attendance";
import type { SearchResultItem } from "@/services/search.service";

export interface MarkGridRow {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  remarks?: string;
}

interface AttendanceMarkGridProps {
  rows: MarkGridRow[];
  loading?: boolean;
  readOnly?: boolean;
  isLocked?: boolean;
  onRowsChange: (rows: MarkGridRow[]) => void;
  onAddStudent?: (item: SearchResultItem) => void;
  batchId?: string;
}

export function AttendanceMarkGrid({
  rows,
  loading,
  readOnly,
  isLocked,
  onRowsChange,
  onAddStudent,
  batchId,
}: AttendanceMarkGridProps) {
  const disabled = readOnly || isLocked;

  const updateStatus = (studentId: string, status: AttendanceStatus) => {
    onRowsChange(
      rows.map((row) => (row.studentId === studentId ? { ...row, status } : row)),
    );
  };

  const handleAddStudent = (item: SearchResultItem) => {
    if (rows.some((r) => r.studentId === item.id)) return;
    onAddStudent?.(item);
    onRowsChange([
      ...rows,
      { studentId: item.id, studentName: item.label, status: "PRESENT" },
    ]);
  };

  if (loading) return <SkeletonTable rows={6} />;

  if (rows.length === 0) {
    return (
      <div className="space-y-4">
        {!disabled && onAddStudent && (
          <div className="max-w-md">
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Add students
            </label>
            <EntitySearch
              searchType="students"
              onSelect={handleAddStudent}
              extraParams={batchId ? { batchId } : undefined}
            />
          </div>
        )}
        <EmptyState
          variant="no-data"
          icon={<Users size={48} className="text-text-disabled" />}
          title="No students in grid"
          description={
            disabled
              ? "This session has no attendance records."
              : "Select a batch and date, or search to add students."
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SessionLockIndicator isLocked={!!isLocked} />
        {isLocked && (
          <p
            className="text-xs text-text-secondary"
            title="Locked sessions are read-only. Contact an administrator to unlock."
          >
            This session is locked and cannot be edited.
          </p>
        )}
      </div>

      {!disabled && onAddStudent && (
        <div className="max-w-md">
          <EntitySearch
            searchType="students"
            onSelect={handleAddStudent}
            extraParams={batchId ? { batchId } : undefined}
            placeholder="Add student to grid…"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-[var(--radius-md)] border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-raised">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Student
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.studentId}
                className="border-b border-border-subtle last:border-0 hover:bg-surface-raised"
              >
                <td className="px-4 py-3 font-medium text-text-primary">{row.studentName}</td>
                <td className="px-4 py-3">
                  <AttendanceStatusToggle
                    value={row.status}
                    onChange={(status) => updateStatus(row.studentId, status)}
                    disabled={disabled}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function recordsToGridRows(records: AttendanceRecord[]): MarkGridRow[] {
  return records.map((record) => ({
    studentId: record.studentId,
    studentName: record.student?.name ?? record.studentId.slice(0, 8),
    status: record.status,
    remarks: record.remarks ?? undefined,
  }));
}

export function gridRowsToRecords(rows: MarkGridRow[]): AttendanceRecord[] {
  return rows.map((row) => ({
    studentId: row.studentId,
    status: row.status,
    remarks: row.remarks,
  }));
}
