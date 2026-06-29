import { z } from "zod";

export const certificateFormSchema = z.object({
  studentId: z.string().uuid("Select a student"),
  templateId: z.string().uuid("Select a template"),
  batchId: z.string().uuid().optional().or(z.literal("")),
  courseName: z.string().min(1).optional().or(z.literal("")),
  issuedDate: z.string().optional(),
});

export const bulkGenerateSchema = z.object({
  batchId: z.string().uuid("Select a batch"),
  templateId: z.string().uuid("Select a template"),
  issuedDate: z.string().optional(),
});

export const revokeCertificateSchema = z.object({
  reason: z.string().optional(),
});

export type CertificateFormValues = z.infer<typeof certificateFormSchema>;
export type BulkGenerateFormValues = z.infer<typeof bulkGenerateSchema>;
export type RevokeCertificateFormValues = z.infer<typeof revokeCertificateSchema>;
