"use client";

import * as React from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { REPORT_CATALOG } from "@/types/reports";

interface ReportsSelectionViewProps {
  basePath: string;
}

export function ReportsSelectionView({ basePath }: ReportsSelectionViewProps) {
  const categories = React.useMemo(() => {
    const map = new Map<string, typeof REPORT_CATALOG>();
    for (const report of REPORT_CATALOG) {
      const list = map.get(report.category) ?? [];
      list.push(report);
      map.set(report.category, list);
    }
    return map;
  }, []);

  return (
    <PageContainer
      title="Reports"
      subtitle="Choose a report to view analytics and export data."
    >
      <div className="space-y-8">
        {Array.from(categories.entries()).map(([category, reports]) => (
          <section key={category}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-secondary">
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <Link key={report.type} href={`${basePath}/${report.type}`}>
                  <Card className="h-full transition-colors hover:border-primary/40">
                    <CardBody className="flex flex-col gap-3 py-5">
                      <div className="flex items-start justify-between gap-2">
                        <BarChart3 size={20} className="shrink-0 text-primary" aria-hidden />
                        <Badge variant="outline">{category}</Badge>
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{report.label}</p>
                        <p className="mt-1 text-sm text-text-secondary">{report.description}</p>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
