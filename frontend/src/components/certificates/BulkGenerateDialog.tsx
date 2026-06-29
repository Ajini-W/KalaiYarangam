"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { EntitySearch } from "@/components/shared/EntitySearch";
import { bulkGenerateSchema, type BulkGenerateFormValues } from "@/validations/certificates";
import type { CertificateTemplate } from "@/types/certificates";

interface BulkGenerateDialogProps {
  open: boolean;
  onClose: () => void;
  templates: CertificateTemplate[];
  saving?: boolean;
  onSubmit: (values: BulkGenerateFormValues) => Promise<void>;
}

export function BulkGenerateDialog({
  open,
  onClose,
  templates,
  saving,
  onSubmit,
}: BulkGenerateDialogProps) {
  const [batchLabel, setBatchLabel] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BulkGenerateFormValues>({
    resolver: zodResolver(bulkGenerateSchema),
    defaultValues: { batchId: "", templateId: "", issuedDate: "" },
  });

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const templateOptions = templates.map((t) => ({ value: t.id, label: t.name }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Bulk generate certificates"
      description="Generate certificates for all active students in a batch."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button loading={saving} onClick={handleSubmit(onSubmit)}>Generate</Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">Batch</label>
          <EntitySearch
            searchType="batches"
            onSelect={(item) => {
              setValue("batchId", item.id, { shouldValidate: true });
              setBatchLabel(item.label);
            }}
          />
          {errors.batchId && <p className="mt-1 text-xs text-danger">{errors.batchId.message}</p>}
          {batchLabel && <p className="mt-1 text-xs text-text-secondary">{batchLabel}</p>}
        </div>
        <Select
          label="Template"
          required
          placeholder="Select template"
          options={templateOptions}
          error={errors.templateId?.message}
          {...register("templateId")}
        />
        <Input label="Issue date" type="date" error={errors.issuedDate?.message} {...register("issuedDate")} />
      </form>
    </Modal>
  );
}
