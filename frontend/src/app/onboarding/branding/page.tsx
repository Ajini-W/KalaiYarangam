"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BrandingForm, type BrandingFormData } from "@/components/forms/BrandingForm";
import { updateBranding } from "@/services/branding";

export default function BrandingPage() {
  const router = useRouter();

  const handleSave = async (data: BrandingFormData) => {
    try {
      await updateBranding(data);
      toast.success("Branding settings saved");
      router.push("/onboarding/module-activation");
    } catch {
      toast.error("Failed to save branding settings");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Customise Your Brand</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Upload your logo, set brand colours, and define your tagline.
        </p>
      </div>
      <BrandingForm onSave={handleSave} submitLabel="Continue" />
    </div>
  );
}
