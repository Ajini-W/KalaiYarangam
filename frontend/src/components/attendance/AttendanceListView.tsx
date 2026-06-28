"use client";

import * as React from "react";
import Link from "next/link";
import { RefreshCw, Users } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState } from "@/components/ui/EmptyState";
import { AttendanceNav } from "./AttendanceNav";
import { AttendanceTable } from "./AttendanceTable";
import { AttendanceFilters, type AttendanceFiltersValue } from "./AttendanceFilters";
import { useAttendanceList } from "@/hooks/useAttendance";

interface AttendanceListViewProps {
  basePath: string;
  title?: string;
  subtitle?: string;
  showMark?: boolean;
}

export function AttendanceListView({
  basePath,
  title = "Attendance",
  subtitle = "View and manage attendance sessions.",
  showMark = true,
}: AttendanceListViewProps) {
  const [filters, setFilters] = React.useState<AttendanceFiltersValue>({
    batchId: "",
    batchLabel: "",
    dateFrom: "",
    dateTo: "",
  });
  const [page, setPage] = React.useState(1);

  const { sessions, meta, loading, error, setParams, refetch } = useAttendanceList({
    page: 1,
    pageSize: 10,
  });

  React.useEffect(() => {
    setParams({
      page,
      pageSize: 10,
      batchId: filters.batchId || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
    });
  }, [page, filters, setParams]);

  const applyFilters = () => {
    setPage(1);
    setParams({
      page: 1,
      pageSize: 10,
      batchId: filters.batchId || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
    });
  };

  if (error && !loading && sessions.length === 0) {
    return (
      <PageContainer title={title} subtitle={subtitle}>
        <AttendanceNav basePath={basePath} showMark={showMark} />
        <ErrorState
          code={500}
          title="Unable to load attendance"
          description={error}
          action={{ label: "Retry", onClick: refetch }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={title}
      subtitle={subtitle}
      actions={
        showMark ? (
          <Link
            href={`${basePath}/mark`}
            className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] border border-border px-3 text-sm font-medium text-text-primary hover:bg-surface-raised"
          >
            <Users size={14} />
            Mark Attendance
          </Link>
        ) : undefined
      }
    >
      <AttendanceNav basePath={basePath} showMark={showMark} />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <AttendanceFilters value={filters} onChange={setFilters} />
          <Button size="sm" onClick={applyFilters}>
            Apply Filters
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Sessions</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              leftIcon={<RefreshCw size={14} />}
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <AttendanceTable
            sessions={sessions}
            loading={loading}
            markPath={showMark ? `${basePath}/mark` : undefined}
          />
          <div className="mt-4">
            <Pagination
              page={meta.page}
              pageSize={meta.pageSize}
              total={meta.total}
              onPageChange={setPage}
            />
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
