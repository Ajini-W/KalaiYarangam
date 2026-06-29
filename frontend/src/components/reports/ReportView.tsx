"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table, type Column } from "@/components/ui/Table";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/EmptyState";
import { useReport } from "@/hooks/useReports";
import { DateRangePicker, useDefaultDateRange } from "./DateRangePicker";
import { ChartTableToggle } from "./ChartTableToggle";
import { ExportDialog } from "./ExportDialog";
import { REPORT_CATALOG, type ReportType, type ReportViewMode } from "@/types/reports";

interface ReportViewProps {
  basePath: string;
  reportType: ReportType;
}

export function ReportView({ basePath, reportType }: ReportViewProps) {
  const router = useRouter();
  const [range, setRange] = useDefaultDateRange();
  const [appliedRange, setAppliedRange] = React.useState(range);
  const [viewMode, setViewMode] = React.useState<ReportViewMode>("table");
  const [exportOpen, setExportOpen] = React.useState(false);

  const meta = REPORT_CATALOG.find((r) => r.type === reportType);
  const { data, loading, error, refetch } = useReport(reportType, appliedRange);

  const columns: Column<Record<string, string | number>>[] =
    data?.columns.map((col) => ({
      key: col.key,
      header: col.label,
      render: (row) => String(row[col.key] ?? "—"),
    })) ?? [];

  const applyRange = () => setAppliedRange(range);

  if (!meta) {
    return (
      <PageContainer title="Report" back={() => router.push(basePath)}>
        <ErrorState code={404} title="Report not found" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={meta.label}
      subtitle={meta.description}
      back={() => router.push(basePath)}
      actions={
        <Button size="sm" leftIcon={<Download size={14} />} onClick={() => setExportOpen(true)}>
          Export
        </Button>
      }
    >
      <Card className="mb-6">
        <CardHeader><CardTitle>Date range</CardTitle></CardHeader>
        <CardBody className="space-y-4 pt-0">
          <DateRangePicker from={range.from} to={range.to} onChange={setRange} />
          <Button size="sm" onClick={applyRange}>Apply</Button>
        </CardBody>
      </Card>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <ChartTableToggle mode={viewMode} onChange={setViewMode} />
        <Button variant="ghost" size="sm" onClick={refetch} leftIcon={<RefreshCw size={14} />}>
          Refresh
        </Button>
      </div>

      {error && !loading && !data ? (
        <ErrorState
          code={500}
          title="Unable to load report"
          description={error}
          action={{ label: "Retry", onClick: refetch }}
        />
      ) : (
        <Card>
          <CardBody className="pt-5">
            {loading ? (
              <SkeletonTable rows={8} />
            ) : viewMode === "chart" && data?.chart && data.chart.length > 0 ? (
              <div className="space-y-4">
                {data.chart.map((point) => (
                  <div key={point.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-primary">{point.label}</span>
                      <span className="tabular-nums text-text-secondary">{point.value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-overlay">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min(
                            100,
                            (point.value / Math.max(...data.chart!.map((p) => p.value), 1)) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Table
                columns={columns}
                data={(data?.rows ?? []).map((row, i) => ({ ...row, id: i }))}
                loading={loading}
                emptyTitle="No data for this period"
                emptyDescription="Try adjusting the date range."
              />
            )}
          </CardBody>
        </Card>
      )}

      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        reportType={reportType}
        queryParams={appliedRange}
      />
    </PageContainer>
  );
}
