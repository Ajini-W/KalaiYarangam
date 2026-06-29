import { z } from "zod";

export const progressFormSchema = z.object({
  studentId: z.string().uuid("Select a student"),
  batchId: z.string().uuid().optional().or(z.literal("")),
  module: z.string().max(200).optional(),
  percentage: z.coerce.number().int().min(0, "Minimum is 0").max(100, "Maximum is 100"),
  grade: z.string().min(1).max(10).optional().or(z.literal("")),
  remarks: z.string().optional(),
});

export type ProgressFormValues = z.infer<typeof progressFormSchema>;
