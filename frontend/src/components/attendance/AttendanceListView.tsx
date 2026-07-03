"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCw, Users, Calendar } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState } from "@/components/ui/EmptyState";
import { AttendanceNav } from "./AttendanceNav";
import { AttendanceTable } from "./AttendanceTable";
import { AttendanceFilters, type AttendanceFiltersValue } from "./AttendanceFilters";
import { useAttendanceList } from "@/hooks/useAttendance";
import { DevModeBadge } from "@/components/shared/DevModeBadge";

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

  const { sessions, meta, loading, error, usingMock, setParams, refetch } = useAttendanceList({
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
          <Link href={`${basePath}/mark`}>
            <Button size="sm" leftIcon={<Users size={14} />}>Mark Attendance</Button>
          </Link>
        ) : undefined
      }
    >
      <AttendanceNav basePath={basePath} showMark={showMark} />
      <DevModeBadge visible={usingMock} className="mb-4" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="text-primary" size={18} />
              <CardTitle>Filters</CardTitle>
            </div>
          </CardHeader>
          <CardBody className="space-y-4 pt-0">
            <AttendanceFilters value={filters} onChange={setFilters} />
            <Button size="sm" onClick={applyFilters}>
              Apply Filters
            </Button>
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="text-primary" size={18} />
                <CardTitle>Sessions</CardTitle>
              </div>
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
      </motion.div>
    </PageContainer>
  );
}
