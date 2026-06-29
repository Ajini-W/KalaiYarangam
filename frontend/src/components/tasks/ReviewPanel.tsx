"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { submissionReviewSchema, type SubmissionReviewFormValues } from "@/validations/tasks";
import type { Task, TaskSubmission } from "@/types/tasks";

interface ReviewPanelProps {
  submission: TaskSubmission | null;
  task: Task;
  saving?: boolean;
  onSubmit: (values: SubmissionReviewFormValues) => Promise<void>;
}

export function ReviewPanel({ submission, task, saving, onSubmit }: ReviewPanelProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionReviewFormValues>({
    resolver: zodResolver(submissionReviewSchema),
    defaultValues: {
      score: submission?.score != null ? String(submission.score) : "",
      feedback: submission?.feedback ?? "",
      status: submission?.status === "RETURNED" ? "RETURNED" : "GRADED",
    },
  });

  React.useEffect(() => {
    reset({
      score: submission?.score != null ? String(submission.score) : "",
      feedback: submission?.feedback ?? "",
      status: submission?.status === "RETURNED" ? "RETURNED" : "GRADED",
    });
  }, [submission, reset]);

  if (!submission) {
    return (
      <Card>
        <CardBody className="py-12 text-center text-sm text-text-secondary">
          Select a submission to review
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review — {submission.student?.name}</CardTitle>
      </CardHeader>
      <CardBody className="space-y-4 pt-0">
        {submission.content && (
          <div>
            <p className="text-xs font-medium uppercase text-text-secondary">Submission</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-text-primary">{submission.content}</p>
          </div>
        )}
        {submission.fileUrl && (
          <div>
            <p className="text-xs font-medium uppercase text-text-secondary">Attachment</p>
            <a
              href={submission.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-sm text-primary hover:underline"
            >
              View file
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label={`Score${task.maxScore ? ` (max ${task.maxScore})` : ""}`}
            type="number"
            min={0}
            max={task.maxScore ?? undefined}
            error={errors.score?.message}
            {...register("score")}
          />
          <Textarea
            label="Feedback"
            rows={4}
            error={errors.feedback?.message}
            {...register("feedback")}
          />
          <Select
            label="Status"
            options={[
              { value: "GRADED", label: "Graded" },
              { value: "RETURNED", label: "Returned for revision" },
            ]}
            error={errors.status?.message}
            {...register("status")}
          />
          <Button type="submit" loading={saving} className="w-full sm:w-auto">
            Save review
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
