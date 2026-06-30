"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { setupTenant } from "@/services/onboarding";
import { apiClient } from "@/services/api-client";
import { useAuthStore } from "@/store/auth.store";

const tenantSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  address: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a hex color e.g. #FF0000").optional().or(z.literal("")),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a hex color e.g. #FF0000").optional().or(z.literal("")),
});

type TenantFormData = z.infer<typeof tenantSchema>;

export default function TenantSetupPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [saving, setSaving] = React.useState(false);

  const form = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: { businessName: "", businessType: "", address: "", primaryColor: "", secondaryColor: "" },
  });

  const handleSubmit = async (data: TenantFormData) => {
    setSaving(true);
    try {
      const res = await setupTenant({
        businessName: data.businessName,
        businessType: data.businessType,
        address: data.address || undefined,
        primaryColor: data.primaryColor || undefined,
        secondaryColor: data.secondaryColor || undefined,
      });

      toast.success("Business registered successfully!");

      if (res.data?.token) {
        apiClient.defaults.headers.common.Authorization = `Bearer ${res.data.token.accessToken}`;
        setUser(res.data.token.user as any);
      }

      router.push(res.data?.redirectTo || "/dashboard/owner");
    } catch {
      toast.error("Failed to register business");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Set Up Your Business</h1>
        <p className="mt-1 text-sm text-text-secondary">Register your organization to get started.</p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-xl space-y-6">
        <Card>
          <CardHeader><CardTitle>Business Details</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <Input
              label="Business Name"
              required
              error={form.formState.errors.businessName?.message}
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
            <Input
              label="Address"
              {...form.register("address")}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Branding (Optional)</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Primary Color"
                placeholder="#3B82F6"
                error={form.formState.errors.primaryColor?.message}
                {...form.register("primaryColor")}
              />
              <Input
                label="Secondary Color"
                placeholder="#10B981"
                error={form.formState.errors.secondaryColor?.message}
                {...form.register("secondaryColor")}
              />
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={saving}>Complete Setup</Button>
        </div>
      </form>
    </div>
  );
}
