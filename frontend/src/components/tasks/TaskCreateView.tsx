"use client";

import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody } from "@/components/ui/Card";
import { TaskForm } from "./TaskForm";
import { useTaskMutations } from "@/hooks/useTasks";
import type { TaskFormValues } from "@/validations/tasks";

interface TaskCreateViewProps {
  basePath: string;
}

export function TaskCreateView({ basePath }: TaskCreateViewProps) {
  const router = useRouter();
  const { saving, create } = useTaskMutations();

  const onSubmit = async (values: TaskFormValues) => {
    const task = await create({
      batchId: values.batchId,
      title: values.title,
      description: values.description,
      type: values.type,
      dueDate: values.dueDate || undefined,
      maxScore: values.maxScore ? Number(values.maxScore) : undefined,
      allowLateSubmission: values.allowLateSubmission,
    });
    router.push(`${basePath}/${task.id}`);
  };

  return (
    <PageContainer
      title="Create task"
      subtitle="Add a new task for a batch."
      back={() => router.push(basePath)}
    >
      <Card>
        <CardBody>
          <TaskForm saving={saving} onSubmit={onSubmit} onCancel={() => router.push(basePath)} />
        </CardBody>
      </Card>
    </PageContainer>
  );
}
