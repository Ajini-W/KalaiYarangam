"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { BranchForm, type BranchFormData } from "@/components/forms/BranchForm";
import { claimTenant } from "@/services/tenant";
import { createBranch } from "@/services/branches";
import { useAuthStore } from "@/store/auth.store";
import { setTokens } from "@/services/api-client";

const bizSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  phone:        z.string().min(10, "Valid phone number required"),
  email:        z.string().email("Valid email required"),
  industry:     z.string().min(1, "Select an industry"),
});
type BizFormData = z.infer<typeof bizSchema>;

export default function BranchSetupPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [step, setStep] = React.useState<"business" | "branch">("business");
  const [claiming, setClaiming] = React.useState(false);
  const [tenantId, setTenantId] = React.useState<string | null>(null);

  const bizForm = useForm<BizFormData>({
    resolver: zodResolver(bizSchema),
  });

  const handleBizSubmit = async (data: BizFormData) => {
    setClaiming(true);
    try {
      const res = await claimTenant({
        businessName: data.businessName,
        industry: data.industry.toUpperCase(),
        phone: data.phone,
        email: data.email,
      });
      const { accessToken, user } = res.data.token;
      setTokens(accessToken, accessToken);
      setUser({ ...user, branchId: null, emailVerified: true, status: (user as any).status || "ACTIVE" });
      setTenantId(res.data.tenant.id);
      toast.success("Business created successfully");
      setStep("branch");
    } catch {
      toast.error("Failed to create business");
    } finally {
      setClaiming(false);
    }
  };

  const handleBranchSave = async (data: BranchFormData) => {
    try {
      await createBranch(data);
      toast.success("Branch created successfully");
      router.push("/onboarding/branding");
    } catch {
      toast.error("Failed to create branch");
    }
  };

  if (step === "business") {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Set Up Your Business</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Tell us about your business to get started.
          </p>
        </div>
        <form onSubmit={bizForm.handleSubmit(handleBizSubmit)} className="max-w-xl space-y-6">
          <Card>
            <CardHeader><CardTitle>Business Details</CardTitle></CardHeader>
            <CardBody className="space-y-4 pt-0">
              <Input label="Business Name" required error={bizForm.formState.errors.businessName?.message} {...bizForm.register("businessName")} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Phone" type="tel" required error={bizForm.formState.errors.phone?.message} {...bizForm.register("phone")} />
                <Input label="Email" type="email" required error={bizForm.formState.errors.email?.message} {...bizForm.register("email")} />
              </div>
              <Select
                label="Industry"
                required
                error={bizForm.formState.errors.industry?.message}
                options={[
                  { value: "training", label: "Training / Coaching" },
                  { value: "rental", label: "Rental Business" },
                  { value: "event", label: "Event Management" },
                ]}
                {...bizForm.register("industry")}
              />
            </CardBody>
          </Card>
          <div className="flex justify-end">
            <Button type="submit" loading={claiming}>Continue</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      {tenantId && (
        <div className="mb-6 rounded-[var(--radius-md)] border border-info/20 bg-info/5 px-4 py-3 text-sm">
          <span className="font-medium text-text-primary">Tenant ID: </span>
          <code className="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-xs text-text-secondary">{tenantId}</code>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Set Up Your First Branch</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Add your primary business location.
        </p>
      </div>
      <BranchForm onSave={handleBranchSave} submitLabel="Continue" />
    </div>
  );
}
