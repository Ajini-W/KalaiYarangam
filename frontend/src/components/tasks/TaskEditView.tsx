"use client";

import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { TaskForm } from "./TaskForm";
import { useTask, useTaskMutations } from "@/hooks/useTasks";
import type { TaskFormValues } from "@/validations/tasks";

interface TaskEditViewProps {
  basePath: string;
  taskId: string;
}

export function TaskEditView({ basePath, taskId }: TaskEditViewProps) {
  const router = useRouter();
  const { task, loading, error } = useTask(taskId);
  const { saving, update } = useTaskMutations();

  const onSubmit = async (values: TaskFormValues) => {
    await update(taskId, {
      title: values.title,
      description: values.description,
      type: values.type,
      dueDate: values.dueDate || undefined,
      maxScore: values.maxScore ? Number(values.maxScore) : undefined,
      allowLateSubmission: values.allowLateSubmission,
    });
    router.push(`${basePath}/${taskId}`);
  };

  if (loading) {
    return (
      <PageContainer title="Edit task" back={() => router.push(`${basePath}/${taskId}`)}>
        <Skeleton className="h-64 w-full" />
      </PageContainer>
    );
  }

  if (error || !task) {
    return (
      <PageContainer title="Edit task" back={() => router.push(basePath)}>
        <ErrorState code={404} title="Task not found" description={error ?? undefined} />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Edit task"
      subtitle={task.title}
      back={() => router.push(`${basePath}/${taskId}`)}
    >
      <Card>
        <CardBody>
          <TaskForm
            initial={task}
            saving={saving}
            onSubmit={onSubmit}
            onCancel={() => router.push(`${basePath}/${taskId}`)}
          />
        </CardBody>
      </Card>
    </PageContainer>
  );
}
