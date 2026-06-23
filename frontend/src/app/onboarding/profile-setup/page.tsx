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
import { setupProfile, getOnboardingProgress } from "@/services/onboarding";
import { useAuthStore } from "@/store/auth.store";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  mobileNumber: z.string().min(10, "Valid mobile number required"),
  address: z.string().optional(),
  timeZone: z.string().optional(),
  preferredLanguage: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  parentContact: z.string().optional(),
  companyName: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileSetupPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [saving, setSaving] = React.useState(false);
  const [redirectPath, setRedirectPath] = React.useState("/onboarding");

  React.useEffect(() => {
    getOnboardingProgress()
      .then((res) => {
        const role = res.data.progress.selectedRole || res.data.user.role;
        if (role === "OWNER") setRedirectPath("/onboarding/company-profile");
        else if (role === "CLIENT") setRedirectPath("/onboarding");
        else setRedirectPath("/onboarding/tenant-search");
      })
      .catch(() => {});
  }, []);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.name || "",
      mobileNumber: "",
    },
  });

  const handleSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      await setupProfile(data);
      toast.success("Profile saved successfully");
      router.push(redirectPath);
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Set Up Your Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">Tell us about yourself to personalize your experience.</p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-xl space-y-6">
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <Input label="Full Name" required error={form.formState.errors.fullName?.message} {...form.register("fullName")} />
            <Input label="Mobile Number" type="tel" required error={form.formState.errors.mobileNumber?.message} {...form.register("mobileNumber")} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Date of Birth" type="date" {...form.register("dateOfBirth")} />
              <Select label="Gender" options={[{ value: "MALE", label: "Male" }, { value: "FEMALE", label: "Female" }, { value: "OTHER", label: "Other" }]} {...form.register("gender")} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact & Preferences</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <Input label="Address" {...form.register("address")} />
            <Input label="Parent / Guardian Contact" type="tel" {...form.register("parentContact")} />
            <Input label="Company Name" {...form.register("companyName")} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Time Zone" options={[{ value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" }, { value: "Asia/Dubai", label: "Asia/Dubai" }, { value: "America/New_York", label: "America/New_York" }]} {...form.register("timeZone")} />
              <Select label="Preferred Language" options={[{ value: "en", label: "English" }, { value: "ta", label: "Tamil" }, { value: "hi", label: "Hindi" }]} {...form.register("preferredLanguage")} />
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={saving}>Save & Continue</Button>
        </div>
      </form>
    </div>
  );
}
