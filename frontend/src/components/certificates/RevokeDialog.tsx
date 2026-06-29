"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { revokeCertificateSchema, type RevokeCertificateFormValues } from "@/validations/certificates";

interface RevokeDialogProps {
  open: boolean;
  onClose: () => void;
  certNumber?: string;
  saving?: boolean;
  onSubmit: (values: RevokeCertificateFormValues) => Promise<void>;
}

export function RevokeDialog({ open, onClose, certNumber, saving, onSubmit }: RevokeDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RevokeCertificateFormValues>({
    resolver: zodResolver(revokeCertificateSchema),
    defaultValues: { reason: "" },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Revoke certificate"
      description={
        certNumber
          ? `Revoke certificate ${certNumber}? This action cannot be undone without reissuing.`
          : undefined
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button variant="danger" loading={saving} onClick={handleSubmit(onSubmit)}>Revoke</Button>
        </>
      }
    >
      <Textarea
        label="Reason (optional)"
        rows={3}
        error={errors.reason?.message}
        {...register("reason")}
      />
    </Modal>
  );
}
