"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, Edit, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { useTask, useTaskMutations, useTaskSubmissions } from "@/hooks/useTasks";
import { TaskStatusBadge, TaskTypeBadge, formatTaskDueDate } from "./TaskBadges";
import { PublishToggle, CloseToggle } from "./TaskToggles";
import { ArchiveDialog, RestoreDialog } from "./TaskDialogs";
import { SubmissionCard } from "./SubmissionCard";
import { ReviewPanel } from "./ReviewPanel";
import type { SubmissionReviewFormValues } from "@/validations/tasks";

interface TaskDetailViewProps {
  basePath: string;
  taskId: string;
}

export function TaskDetailView({ basePath, taskId }: TaskDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"overview" | "submissions">("overview");
  const [selectedSubmissionId, setSelectedSubmissionId] = React.useState<string | null>(null);
  const [archiveOpen, setArchiveOpen] = React.useState(false);
  const [restoreOpen, setRestoreOpen] = React.useState(false);

  const { task, loading, error, refetch } = useTask(taskId);
  const { submissions, loading: submissionsLoading, refetch: refetchSubmissions } = useTaskSubmissions(
    activeTab === "submissions" ? taskId : null,
  );
  const { saving, publish, close, archive, restore, gradeSubmission } = useTaskMutations();

  const selectedSubmission = submissions.find((s) => s.id === selectedSubmissionId) ?? null;

  const handlePublish = async () => {
    await publish(taskId);
    refetch();
  };

  const handleClose = async () => {
    await close(taskId);
    refetch();
  };

  const handleArchive = async () => {
    await archive(taskId);
    setArchiveOpen(false);
    router.push(basePath);
  };

  const handleRestore = async () => {
    await restore(taskId);
    setRestoreOpen(false);
    refetch();
  };

  const handleReview = async (values: SubmissionReviewFormValues) => {
    if (!selectedSubmission) return;
    await gradeSubmission(taskId, selectedSubmission.id, {
      score: values.score === "" || values.score == null ? undefined : Number(values.score),
      feedback: values.feedback,
      status: values.status,
    });
    refetchSubmissions();
  };

  if (loading) {
    return (
      <PageContainer title="Task details">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <SkeletonCard />
        </div>
      </PageContainer>
    );
  }

  if (error || !task) {
    return (
      <PageContainer title="Task details">
        <ErrorState
          code={404}
          title="Task not found"
          description={error ?? "This task may have been removed."}
          action={{ label: "Back to tasks", onClick: () => router.push(basePath) }}
        />
      </PageContainer>
    );
  }

  const due = formatTaskDueDate(task.dueDate, task.status);

  return (
    <PageContainer
      title={task.title}
      subtitle={`${task.type.replace("_", " ")} task`}
      back={() => router.push(basePath)}
      actions={
        <div className="flex flex-wrap gap-2">
          <Link href={`${basePath}/${taskId}/edit`}>
            <Button variant="outline" size="sm" leftIcon={<Edit size={14} />}>
              Edit
            </Button>
          </Link>
          {task.isArchived ? (
            <Button variant="outline" size="sm" onClick={() => setRestoreOpen(true)}>
              Restore
            </Button>
          ) : (
            <Button variant="outline" size="sm" leftIcon={<Archive size={14} />} onClick={() => setArchiveOpen(true)}>
              Archive
            </Button>
          )}
        </div>
      }
    >
      <div className="mb-4 flex gap-2 border-b border-border">
        {(["overview", "submissions"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardBody className="space-y-3 pt-0 text-sm">
              <div className="flex flex-wrap gap-2">
                <TaskStatusBadge status={task.status} />
                <TaskTypeBadge type={task.type} />
              </div>
              {task.description && (
                <p className="text-text-secondary whitespace-pre-wrap">{task.description}</p>
              )}
              <dl className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-xs text-text-secondary">Due date</dt>
                  <dd className={due?.isOverdue ? "font-medium text-warning-700" : "text-text-primary"}>
                    {due?.label ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-text-secondary">Max score</dt>
                  <dd className="text-text-primary">{task.maxScore ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-text-secondary">Submissions</dt>
                  <dd className="text-text-primary">{task.submissionCount ?? task._count?.submissions ?? 0}</dd>
                </div>
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
            <CardBody className="space-y-3 pt-0">
              <PublishToggle task={task} disabled={saving} onToggle={handlePublish} />
              <CloseToggle task={task} disabled={saving} onToggle={handleClose} />
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === "submissions" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={refetchSubmissions} leftIcon={<RefreshCw size={14} />}>
              Refresh
            </Button>
          </div>

          {submissionsLoading ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : submissions.length === 0 ? (
            <EmptyState
              variant="no-data"
              title="No Submissions Yet"
              description="Students haven't submitted work for this task."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    task={task}
                    selected={selectedSubmissionId === submission.id}
                    onSelect={() => setSelectedSubmissionId(submission.id)}
                  />
                ))}
              </div>
              <ReviewPanel
                submission={selectedSubmission}
                task={task}
                saving={saving}
                onSubmit={handleReview}
              />
            </div>
          )}
        </div>
      )}

      <ArchiveDialog
        task={task}
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        onConfirm={handleArchive}
        loading={saving}
      />
      <RestoreDialog
        task={task}
        open={restoreOpen}
        onClose={() => setRestoreOpen(false)}
        onConfirm={handleRestore}
        loading={saving}
      />
    </PageContainer>
  );
}
