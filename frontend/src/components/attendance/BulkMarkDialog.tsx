"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EntitySearch } from "@/components/shared/EntitySearch";
import { bulkMarkSchema, type BulkMarkFormValues } from "@/validations/attendance";
import type { SearchResultItem } from "@/services/search.service";

interface BulkMarkDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: BulkMarkFormValues) => Promise<void>;
  loading?: boolean;
}

export function BulkMarkDialog({ open, onClose, onSubmit, loading }: BulkMarkDialogProps) {
  const [batchLabel, setBatchLabel] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BulkMarkFormValues>({
    resolver: zodResolver(bulkMarkSchema),
    defaultValues: {
      batchId: "",
      classSessionId: "",
      date: new Date().toISOString().slice(0, 10),
      defaultStatus: "PRESENT",
      exceptions: [],
    },
  });

  const handleBatchSelect = (item: SearchResultItem) => {
    setValue("batchId", item.id, { shouldValidate: true });
    setBatchLabel(item.label);
  };

  const handleClose = () => {
    reset();
    setBatchLabel("");
    onClose();
  };

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
    handleClose();
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Bulk Mark Attendance"
      description="Mark all students in a batch with a default status. Override individual students after saving via the grid."
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={submit} loading={loading}>
            Mark All
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={submit}>
        <input type="hidden" {...register("batchId")} />
        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">Batch</label>
          <EntitySearch searchType="batches" onSelect={handleBatchSelect} />
          {batchLabel && <p className="mt-1 text-xs text-text-secondary">Selected: {batchLabel}</p>}
          {errors.batchId && <p className="mt-1 text-xs text-danger">{errors.batchId.message}</p>}
        </div>
        <Input type="date" label="Date" error={errors.date?.message} {...register("date")} />
        <Select
          label="Default Status"
          options={[
            { value: "PRESENT", label: "Present" },
            { value: "ABSENT", label: "Absent" },
            { value: "LATE", label: "Late" },
            { value: "EXCUSED", label: "Excused" },
          ]}
          error={errors.defaultStatus?.message}
          {...register("defaultStatus")}
        />
      </form>
    </Modal>
  );
}
