"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { RefreshCw, Filter } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState, EmptyState } from "@/components/ui/EmptyState";
import { EntitySearch } from "@/components/shared/EntitySearch";
import { useProgressList, useProgressSummary, useProgressMutations } from "@/hooks/useProgress";
import { DevModeBadge } from "@/components/shared/DevModeBadge";
import { ProgressCard } from "./ProgressCard";
import { ProgressSummaryCards } from "./ProgressSummaryCards";

interface BatchProgressSummaryViewProps {
  basePath: string;
  title?: string;
  subtitle?: string;
}

export function BatchProgressSummaryView({
  basePath,
  title = "Progress",
  subtitle = "Track how students are doing across batches.",
}: BatchProgressSummaryViewProps) {
  const [page, setPage] = React.useState(1);
  const [batchId, setBatchId] = React.useState("");
  const [batchLabel, setBatchLabel] = React.useState("");

  const { records, meta, loading, error, usingMock, setParams, refetch } = useProgressList({
    page: 1,
    pageSize: 10,
  });
  const { summary, loading: summaryLoading, setParams: setSummaryParams, refetch: refetchSummary } =
    useProgressSummary({});
  const { saving, recalculate } = useProgressMutations();

  React.useEffect(() => {
    setParams({ page, pageSize: 10, batchId: batchId || undefined });
    setSummaryParams({ batchId: batchId || undefined });
  }, [page, batchId, setParams, setSummaryParams]);

  const handleRecalculate = async () => {
    await recalculate({ batchId: batchId || undefined });
    refetch();
    refetchSummary();
  };

  if (error && !loading && records.length === 0) {
    return (
      <PageContainer title={title} subtitle={subtitle}>
        <ErrorState
          code={500}
          title="Unable to load progress"
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
        <Button size="sm" loading={saving} onClick={handleRecalculate}>
          Refresh progress
        </Button>
      }
    >
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
              <Filter className="text-primary" size={18} />
              <CardTitle>Filter by batch</CardTitle>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <EntitySearch
              searchType="batches"
              onSelect={(item) => {
                setBatchId(item.id);
                setBatchLabel(item.label);
                setPage(1);
              }}
            />
            {batchLabel && (
              <p className="mt-2 text-xs text-text-secondary">Showing: {batchLabel}</p>
            )}
          </CardBody>
        </Card>

        <ProgressSummaryCards summary={summary} loading={summaryLoading} />

        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Student progress</CardTitle>
              <Button variant="ghost" size="sm" onClick={refetch} leftIcon={<RefreshCw size={14} />}>
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardBody className="space-y-4 pt-0">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-[var(--radius-md)] bg-surface-overlay" />
                ))}
              </div>
            ) : records.length === 0 ? (
              <EmptyState
                variant="no-data"
                title="No progress records"
                description="Progress will appear once assessments are recorded."
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {records.map((record) => (
                  <ProgressCard key={record.id} record={record} />
                ))}
              </div>
            )}
            <Pagination
              page={meta.page}
              pageSize={meta.pageSize}
              total={meta.total}
              onPageChange={setPage}
            />
          </CardBody>
        </Card>
      </motion.div>
    </PageContainer>
  );
}
