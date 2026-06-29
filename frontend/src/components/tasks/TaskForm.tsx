"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EntitySearch } from "@/components/shared/EntitySearch";
import { taskFormSchema, type TaskFormValues } from "@/validations/tasks";
import type { Task } from "@/types/tasks";

const TYPE_OPTIONS = [
  { value: "HOMEWORK", label: "Homework" },
  { value: "ASSIGNMENT", label: "Assignment" },
  { value: "QUIZ", label: "Quiz" },
  { value: "PROJECT", label: "Project" },
  { value: "EXAM", label: "Exam" },
];

interface TaskFormProps {
  initial?: Task | null;
  loading?: boolean;
  saving?: boolean;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel?: () => void;
}

export function TaskForm({ initial, loading, saving, onSubmit, onCancel }: TaskFormProps) {
  const [batchLabel, setBatchLabel] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      batchId: initial?.batchId ?? "",
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      type: initial?.type ?? "HOMEWORK",
      dueDate: initial?.dueDate ? initial.dueDate.slice(0, 10) : "",
      maxScore: initial?.maxScore != null ? String(initial.maxScore) : "",
      allowLateSubmission: initial?.allowLateSubmission ?? false,
    },
  });

  const allowLate = watch("allowLateSubmission");

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!initial && (
        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">
            Batch <span className="text-danger">*</span>
          </label>
          <EntitySearch
            searchType="batches"
            onSelect={(item) => {
              setValue("batchId", item.id, { shouldValidate: true });
              setBatchLabel(item.label);
            }}
          />
          {errors.batchId && (
            <p role="alert" className="mt-1 text-xs text-danger">{errors.batchId.message}</p>
          )}
          {batchLabel && (
            <p className="mt-1 text-xs text-text-secondary">Selected: {batchLabel}</p>
          )}
        </div>
      )}

      <Input
        label="Title"
        required
        error={errors.title?.message}
        {...register("title")}
      />

      <Textarea
        label="Description"
        error={errors.description?.message}
        rows={4}
        {...register("description")}
      />

      <Select
        label="Type"
        required
        options={TYPE_OPTIONS}
        error={errors.type?.message}
        {...register("type")}
      />

      <Input
        label="Due date"
        type="date"
        error={errors.dueDate?.message}
        {...register("dueDate")}
      />

      <Input
        label="Maximum score"
        type="number"
        min={1}
        error={errors.maxScore?.message}
        {...register("maxScore")}
      />

      <div className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-border px-3 py-2">
        <div>
          <p className="text-sm font-medium text-text-primary">Allow late submission</p>
          <p className="text-xs text-text-secondary">Students can submit after the due date</p>
        </div>
        <Switch
          checked={allowLate}
          onCheckedChange={(checked) => setValue("allowLateSubmission", checked)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={saving}>
          {initial ? "Save changes" : "Create task"}
        </Button>
      </div>
    </form>
  );
}
