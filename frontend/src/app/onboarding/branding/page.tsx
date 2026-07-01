"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BrandingForm, type BrandingFormData } from "@/components/forms/BrandingForm";
import { updateBranding } from "@/services/branding";
import { useBrandTheme } from "@/providers/BrandThemeProvider";

export default function BrandingPage() {
  const router = useRouter();

  const { applyBrandTheme } = useBrandTheme();

  const handleSave = async (data: BrandingFormData) => {
    try {
      await updateBranding(data);
      if (data.primaryColor) {
        applyBrandTheme(data.primaryColor, data.secondaryColor ?? data.primaryColor);
      }
      toast.success("Branding settings saved");
      router.push("/onboarding/module-activation");
    } catch {
      toast.error("Failed to save branding settings");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <h1 className="text-2xl font-bold text-text-primary">Customise Your Brand</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Upload your logo, set brand colours, and define your tagline.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <BrandingForm onSave={handleSave} submitLabel="Continue" />
      </motion.div>
    </motion.div>
  );
}
