"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { AddressAutocomplete, type AddressResult } from "@/components/ui/AddressAutocomplete";
import { setupTenant } from "@/services/onboarding";
import { apiClient } from "@/services/api-client";
import { useAuthStore } from "@/store/auth.store";

const tenantSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  manualAddress: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
});

type TenantFormData = z.infer<typeof tenantSchema>;

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function TenantSetupPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [saving, setSaving] = React.useState(false);
  const [useManual, setUseManual] = React.useState(false);

  const form = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      businessName: "", businessType: "", address: "",
      city: "", state: "", pincode: "",
      manualAddress: "",
      primaryColor: "", secondaryColor: "",
    },
  });

  const primaryColor = form.watch("primaryColor");
  const secondaryColor = form.watch("secondaryColor");

  const handleAddressSelect = (result: AddressResult) => {
    form.setValue("address", result.formatted);
    form.setValue("city", result.city);
    form.setValue("state", result.state);
    form.setValue("pincode", result.pincode);
    form.setValue("latitude", result.latitude);
    form.setValue("longitude", result.longitude);
    form.setValue("manualAddress", "");
  };

  const handleSubmit = async (data: TenantFormData) => {
    setSaving(true);
    try {
      const finalAddress = useManual ? data.manualAddress : data.address;
      const res = await setupTenant({
        businessName: data.businessName,
        businessType: data.businessType,
        address: finalAddress || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        pincode: data.pincode || undefined,
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
        primaryColor: data.primaryColor || undefined,
        secondaryColor: data.secondaryColor || undefined,
      });

      toast.success("Business registered successfully!");

      router.push(res.data?.nextStep === "BRANCH_SETUP" ? "/onboarding/branch-setup" : "/dashboard/owner");
    } catch {
      toast.error("Failed to register business");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Set Up Your Business</h1>
        <p className="mt-1.5 text-sm text-text-secondary">Register your organization to get started.</p>
      </motion.div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="mx-auto max-w-xl space-y-6">
        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader><CardTitle>Business Details</CardTitle></CardHeader>
            <CardBody className="space-y-4 pt-0">
              <Input
                label="Business Name"
                required
                error={form.formState.errors.businessName?.message}
                leftAddon={<Building2 size={15} />}
                {...form.register("businessName")}
              />
              <Select
                label="Business Type"
                required
                error={form.formState.errors.businessType?.message}
                options={[
                  { value: "TRAINING", label: "Training Institute" },
                  { value: "RENTAL", label: "Rental Business" },
                  { value: "EVENT", label: "Event Management" },
                ]}
                {...form.register("businessType")}
              />

              {!useManual ? (
                <AddressAutocomplete
                  label="Address"
                  value={form.watch("address") || ""}
                  onChange={(v) => form.setValue("address", v)}
                  onAddressSelect={handleAddressSelect}
                  error={form.formState.errors.address?.message}
                  placeholder="Search for an address..."
                />
              ) : (
                <div className="space-y-3">
                  <Input
                    label="Address"
                    error={form.formState.errors.manualAddress?.message}
                    {...form.register("manualAddress")}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Input label="City" {...form.register("city")} />
                    <Input label="State" {...form.register("state")} />
                    <Input label="Pincode" {...form.register("pincode")} />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setUseManual((p) => !p);
                  if (!useManual) {
                    form.setValue("address", "");
                    form.setValue("latitude", undefined);
                    form.setValue("longitude", undefined);
                  } else {
                    form.setValue("manualAddress", "");
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Plus size={12} />
                {useManual ? "Use auto-detect address" : "Enter address manually"}
              </button>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader><CardTitle>Branding (Optional)</CardTitle></CardHeader>
            <CardBody className="space-y-5 pt-0">
              <ColorPicker
                label="Primary Color"
                value={primaryColor || ""}
                onChange={(v) => form.setValue("primaryColor", v, { shouldValidate: true })}
              />
              <ColorPicker
                label="Secondary Color"
                value={secondaryColor || ""}
                onChange={(v) => form.setValue("secondaryColor", v, { shouldValidate: true })}
              />
            </CardBody>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} className="flex justify-end">
          <Button type="submit" loading={saving} rightIcon={!saving ? <ChevronRight className="h-4 w-4" /> : undefined}>
            Complete Setup
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
