import { z } from "zod";

export const reportDateRangeSchema = z
  .object({
    from: z.string().min(1, "Start date is required"),
    to: z.string().min(1, "End date is required"),
    batchId: z.string().uuid().optional().or(z.literal("")),
    branchId: z.string().uuid().optional().or(z.literal("")),
  })
  .refine((data) => data.from <= data.to, {
    message: "End date must be after start date",
    path: ["to"],
  });

export const exportFormSchema = z.object({
  format: z.enum(["csv", "xlsx", "pdf"]),
});

export type ReportDateRangeFormValues = z.infer<typeof reportDateRangeSchema>;
export type ExportFormValues = z.infer<typeof exportFormSchema>;
