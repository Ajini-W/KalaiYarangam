"use client";

import * as React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/EmptyState";
import { AttendanceSummaryCards } from "./AttendanceSummaryCards";
import { AttendanceTable } from "./AttendanceTable";
import { useAttendanceList, useAttendanceSummary } from "@/hooks/useAttendance";

interface StudentAttendanceViewProps {
  studentId?: string;
}

export function StudentAttendanceView({ studentId }: StudentAttendanceViewProps) {
  const summaryParams = React.useMemo(
    () => (studentId ? { studentId } : {}),
    [studentId],
  );

  const { summary, loading: summaryLoading, error: summaryError, refetch: refetchSummary } =
    useAttendanceSummary(summaryParams);

  const { sessions, loading: listLoading, error: listError, refetch: refetchList } =
    useAttendanceList({ page: 1, pageSize: 10 });

  const error = summaryError ?? listError;

  if (error && !summaryLoading && !listLoading) {
    return (
      <PageContainer title="My Attendance" subtitle="Your attendance record.">
        <ErrorState
          code={500}
          title="Unable to load attendance"
          description={error}
          action={{
            label: "Retry",
            onClick: () => {
              refetchSummary();
              refetchList();
            },
          }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="My Attendance" subtitle="Your attendance record.">
      <div className="mb-6">
        <AttendanceSummaryCards
          summary={summary}
          loading={summaryLoading}
          error={null}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardBody className="pt-0">
          <AttendanceTable
            sessions={sessions}
            loading={listLoading}
            emptyTitle="No attendance records found"
            emptyDescription="Your attendance history will appear here."
          />
        </CardBody>
      </Card>
    </PageContainer>
  );
}
