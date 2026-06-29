"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Select, Button } from "@/components/ui";
import type { Batch, Course } from "@/services/training";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),
  courseId: z.string().optional(),
  capacity: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional(),
});

interface FormData {
  name: string;
  code?: string;
  courseId?: string;
  capacity: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

interface BatchFormProps {
  initialData?: Partial<Batch> | null;
  courses?: Course[];
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function BatchForm({ initialData, courses, onSubmit, onCancel, loading }: BatchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name ?? "",
      code: initialData?.code ?? "",
      courseId: initialData?.courseId ?? "",
      capacity: String(initialData?.capacity ?? 30),
      startDate: initialData?.startDate ?? "",
      endDate: initialData?.endDate ?? "",
      status: initialData?.status ?? "UPCOMING",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Batch Name" required error={errors.name?.message} {...register("name")} />
      <Input label="Batch Code" error={errors.code?.message} {...register("code")} />
      {courses && (
        <Select
          label="Course"
          placeholder="Select course"
          options={courses.map((c) => ({ value: c.id, label: c.name }))}
          error={errors.courseId?.message}
          {...register("courseId")}
        />
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input label="Capacity" type="number" required error={errors.capacity?.message} {...register("capacity")} />
        <Select
          label="Status"
          options={[
            { value: "UPCOMING", label: "Upcoming" },
            { value: "ACTIVE", label: "Active" },
            { value: "COMPLETED", label: "Completed" },
            { value: "CANCELLED", label: "Cancelled" },
          ]}
          error={errors.status?.message}
          {...register("status")}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Start Date" type="date" error={errors.startDate?.message} {...register("startDate")} />
        <Input label="End Date" type="date" error={errors.endDate?.message} {...register("endDate")} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting || loading}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting || loading}>
          {initialData ? "Update Batch" : "Create Batch"}
        </Button>
      </div>
    </form>
  );
}
