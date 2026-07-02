"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Textarea, Button } from "@/components/ui";
import type { Resolver } from "react-hook-form";
import type { Course } from "@/services/training";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  duration: z.preprocess((v) => (v === "" || v === undefined ? undefined : Number(v)), z.number().int().min(1).optional()),
  fee: z.preprocess((v) => (v === "" || v === undefined ? undefined : Number(v)), z.number().min(0).optional()),
});

export interface FormData {
  name: string;
  description?: string;
  duration?: number;
  fee?: number;
}

interface ProgramFormProps {
  initialData?: Partial<Course> | null;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ProgramForm({ initialData, onSubmit, onCancel, loading }: ProgramFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as unknown as Resolver<FormData>,
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      duration: initialData?.duration ?? undefined,
      fee: initialData?.fee ?? undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Program Name" required error={errors.name?.message} {...register("name")} />
      <Textarea label="Description" error={errors.description?.message} {...register("description")} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Duration (hours)" type="number" error={errors.duration?.message} {...register("duration")} />
        <Input label="Fee" type="number" leftAddon="₹" error={errors.fee?.message} {...register("fee")} />
      </div>
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
