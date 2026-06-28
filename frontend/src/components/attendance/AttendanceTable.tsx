"use client";

import Link from "next/link";
import { Table, type Column } from "@/components/ui/Table";
import { SessionLockIndicator } from "./SessionLockIndicator";
import type { AttendanceSession } from "@/types/attendance";

interface AttendanceTableProps {
  sessions: AttendanceSession[];
  loading?: boolean;
  markPath?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function AttendanceTable({
  sessions,
  loading,
  markPath,
  emptyTitle = "No attendance sessions found",
  emptyDescription = "Attendance records will appear here once sessions are marked.",
}: AttendanceTableProps) {
  const columns: Column<AttendanceSession>[] = [
    {
      key: "date",
      header: "Date",
      render: (row) => (
        <span className="whitespace-nowrap font-medium">
          {new Date(row.date).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "batchId",
      header: "Batch",
      render: (row) => (
        <span className="whitespace-nowrap">{row.batch?.name ?? row.batchId.slice(0, 8)}</span>
      ),
    },
    {
      key: "records",
      header: "Records",
      render: (row) => row._count?.records ?? row.records?.length ?? 0,
    },
    {
      key: "isLocked",
      header: "Status",
      render: (row) => <SessionLockIndicator isLocked={!!row.isLocked} />,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleString() : "—",
    },
    ...(markPath
      ? [
          {
            key: "id" as const,
            header: "",
            className: "text-right",
            render: (row: AttendanceSession) => (
              <Link
                href={`${markPath}?sessionId=${row.id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {row.isLocked ? "View" : "Edit"}
              </Link>
            ),
          },
        ]
      : []),
  ];

  return (
    <Table
      columns={columns}
      data={sessions}
      loading={loading}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  );
}
