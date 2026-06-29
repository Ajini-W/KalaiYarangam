"use client";

import { use } from "react";
import { TaskEditView } from "@/components/tasks";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <TaskEditView basePath="/staff/tasks" taskId={id} />;
}
