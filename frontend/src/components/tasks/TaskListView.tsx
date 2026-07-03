"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, RefreshCw, CheckSquare } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table, type Column } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState } from "@/components/ui/EmptyState";
import { useTaskList } from "@/hooks/useTasks";
import { DevModeBadge } from "@/components/shared/DevModeBadge";
import { TaskFiltersCard, type TaskFiltersValue } from "./TaskFilters";
import { TaskStatusBadge, TaskTypeBadge, formatTaskDueDate } from "./TaskBadges";
import type { Task } from "@/types/tasks";

interface TaskListViewProps {
  basePath: string;
  title?: string;
  subtitle?: string;
}

export function TaskListView({
  basePath,
  title = "Tasks",
  subtitle = "Create and manage batch tasks and assignments.",
}: TaskListViewProps) {
  const [filters, setFilters] = React.useState<TaskFiltersValue>({
    batchId: "",
    batchLabel: "",
    status: "",
    type: "",
  });
  const [page, setPage] = React.useState(1);

  const { tasks, meta, loading, error, usingMock, setParams, refetch } = useTaskList({
    page: 1,
    pageSize: 10,
  });

  const applyFilters = React.useCallback(() => {
    setPage(1);
    setParams({
      page: 1,
      pageSize: 10,
      batchId: filters.batchId || undefined,
      status: filters.status || undefined,
      type: filters.type || undefined,
    });
  }, [filters, setParams]);

  React.useEffect(() => {
    setParams({
      page,
      pageSize: 10,
      batchId: filters.batchId || undefined,
      status: filters.status || undefined,
      type: filters.type || undefined,
    });
  }, [page, filters.batchId, filters.status, filters.type, setParams]);

  const columns: Column<Task>[] = [
    {
      key: "title",
      header: "Title",
      render: (row) => (
        <Link href={`${basePath}/${row.id}`} className="font-medium text-primary hover:underline">
          {row.title}
        </Link>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (row) => <TaskTypeBadge type={row.type} />,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <TaskStatusBadge status={row.status} />,
    },
    {
      key: "dueDate",
      header: "Due",
      render: (row) => {
        const due = formatTaskDueDate(row.dueDate, row.status);
        if (!due) return "—";
        return (
          <span className={due.isOverdue ? "font-medium text-warning-700" : undefined}>
            {due.label}
          </span>
        );
      },
    },
    {
      key: "submissions",
      header: "Submissions",
      render: (row) => row._count?.submissions ?? row.submissionCount ?? 0,
    },
  ];

  if (error && !loading && tasks.length === 0) {
    return (
      <PageContainer title={title} subtitle={subtitle}>
        <ErrorState
          code={500}
          title="Unable to load tasks"
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
        <Link href={`${basePath}/new`}>
          <Button size="sm" leftIcon={<Plus size={14} />}>
            Create task
          </Button>
        </Link>
      }
    >
      <DevModeBadge visible={usingMock} className="mb-4" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <TaskFiltersCard value={filters} onChange={setFilters} onApply={applyFilters} />

        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="text-primary" size={20} />
                <CardTitle>All tasks</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={refetch} leftIcon={<RefreshCw size={14} />}>
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardBody className="pt-0 space-y-4">
            <Table
              columns={columns}
              data={tasks}
              loading={loading}
              emptyTitle="No tasks yet"
              emptyDescription="Create your first task to get started."
            />
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
