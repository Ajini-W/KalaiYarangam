"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BranchForm, type BranchFormData } from "@/components/forms/BranchForm";
import { createBranch } from "@/services/branches";

export default function BranchSetupPage() {
  const router = useRouter();

  const handleSave = async (data: BranchFormData) => {
    try {
      await createBranch(data);
      toast.success("Branch created successfully");
      router.push("/onboarding/branding");
    } catch {
      toast.error("Failed to create branch");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Set Up Your First Branch</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Add your primary business location to get started.
        </p>
      </div>
      <BranchForm onSave={handleSave} submitLabel="Continue" />
    </div>
  );
}
