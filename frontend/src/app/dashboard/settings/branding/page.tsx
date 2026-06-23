"use client";

import * as React from "react";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/PageContainer";
import { BrandingForm, type BrandingFormData } from "@/components/forms/BrandingForm";
import { getBranding, updateBranding } from "@/services/branding";
import { useBrandTheme } from "@/providers/BrandThemeProvider";

export default function BrandingSettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [defaultValues, setDefaultValues] = React.useState<Partial<BrandingFormData>>();

  React.useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await getBranding();
        if (!mounted) return;
        setDefaultValues({
          logoUrl: res.data.logoUrl ?? "",
          primaryColor: res.data.primaryColor ?? "",
          secondaryColor: res.data.secondaryColor ?? "",
          tagline: res.data.tagline ?? "",
        });
      } catch {
        if (!mounted) return;
        toast.error("Failed to load branding settings");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  const { applyBrandTheme } = useBrandTheme();

  const handleSave = async (data: BrandingFormData) => {
    try {
      await updateBranding(data);
      if (data.primaryColor) {
        applyBrandTheme(data.primaryColor, data.secondaryColor ?? data.primaryColor);
      }
      toast.success("Branding settings saved");
    } catch {
      toast.error("Failed to save branding settings");
    }
  };

  return (
    <PageContainer title="Branding" subtitle="Customise your business appearance">
      <BrandingForm
        defaultValues={defaultValues}
        loading={loading}
        onSave={handleSave}
      />
    </PageContainer>
  );
}
