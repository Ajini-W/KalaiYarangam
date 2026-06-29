"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Textarea, Select, Button } from "@/components/ui";
import type { Course } from "@/services/training";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  duration: z.string().optional(),
  fee: z.string().optional(),
  categoryId: z.string().optional(),
});

interface FormData {
  name: string;
  description?: string;
  duration?: string;
  fee?: string;
  categoryId?: string;
}

interface ProgramFormProps {
  initialData?: Partial<Course> | null;
  categories?: Array<{ id: string; name: string }>;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ProgramForm({ initialData, categories, onSubmit, onCancel, loading }: ProgramFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      duration: initialData?.duration ?? "",
      fee: initialData?.fee != null ? String(initialData.fee) : "",
      categoryId: initialData?.categoryId ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Program Name" required error={errors.name?.message} {...register("name")} />
      <Textarea label="Description" error={errors.description?.message} {...register("description")} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Duration (e.g. 3 months)" error={errors.duration?.message} {...register("duration")} />
        <Input label="Fee" type="number" leftAddon="₹" error={errors.fee?.message} {...register("fee")} />
      </div>
      {categories && (
        <Select
          label="Category"
          placeholder="Select category"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          error={errors.categoryId?.message}
          {...register("categoryId")}
        />
      )}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting || loading}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting || loading}>
          {initialData ? "Update Program" : "Create Program"}
        </Button>
      </div>
    </form>
  );
}
