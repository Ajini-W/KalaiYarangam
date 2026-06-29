"use client";

import { use } from "react";
import { TaskDetailView } from "@/components/tasks";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <TaskDetailView basePath="/branch-manager/tasks" taskId={id} />;
}
