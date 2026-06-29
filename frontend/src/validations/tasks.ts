import { z } from "zod";

export const taskTypeSchema = z.enum(["HOMEWORK", "ASSIGNMENT", "QUIZ", "PROJECT", "EXAM"]);

export const taskFormSchema = z.object({
  batchId: z.string().uuid("Select a batch"),
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().optional(),
  type: taskTypeSchema,
  dueDate: z.string().optional(),
  maxScore: z
    .string()
    .optional()
    .refine((val) => !val || (Number.isInteger(Number(val)) && Number(val) >= 1), {
      message: "Minimum score is 1",
    }),
  allowLateSubmission: z.boolean(),
});

export const submissionReviewSchema = z.object({
  score: z
    .string()
    .optional()
    .refine((val) => val === undefined || val === "" || (Number.isInteger(Number(val)) && Number(val) >= 0), {
      message: "Score cannot be negative",
    }),
  feedback: z.string().optional(),
  status: z.enum(["GRADED", "RETURNED"]).optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
export type SubmissionReviewFormValues = z.infer<typeof submissionReviewSchema>;
