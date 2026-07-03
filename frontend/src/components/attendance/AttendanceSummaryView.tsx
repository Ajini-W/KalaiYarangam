"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AttendanceNav } from "./AttendanceNav";
import { AttendanceSummaryCards } from "./AttendanceSummaryCards";
import { AttendanceFilters, type AttendanceFiltersValue } from "./AttendanceFilters";
import { useAttendanceSummary } from "@/hooks/useAttendance";
import { DevModeBadge } from "@/components/shared/DevModeBadge";

interface AttendanceSummaryViewProps {
  basePath: string;
}

export function AttendanceSummaryView({ basePath }: AttendanceSummaryViewProps) {
  const [filters, setFilters] = React.useState<AttendanceFiltersValue>({
    batchId: "",
    batchLabel: "",
    dateFrom: "",
    dateTo: "",
  });

  const { summary, loading, error, usingMock, setParams, refetch } = useAttendanceSummary({});

  const applyFilters = () => {
    setParams({
      batchId: filters.batchId || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
    });
  };

  return (
    <PageContainer title="Attendance Summary" subtitle="Overview of attendance statistics.">
      <AttendanceNav basePath={basePath} />
      <DevModeBadge visible={usingMock} className="mb-4" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Card variant="elevated">
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

        <AttendanceSummaryCards
          summary={summary}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
      </motion.div>
    </PageContainer>
  );
}
