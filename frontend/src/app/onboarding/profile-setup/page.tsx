"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Phone, CalendarDays, MapPin, Building2, Globe, ChevronRight, Contact } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardBody } from "@/components/ui/Card";
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

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function SectionHeading({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 px-5 pt-5 pb-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <p className="mt-0.5 text-xs text-text-secondary">{description}</p>
      </div>
    </div>
  );
}

export default function ProfileSetupPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [saving, setSaving] = React.useState(false);
  const [redirectPath, setRedirectPath] = React.useState("/onboarding");

  React.useEffect(() => {
    getOnboardingProgress()
      .then((res) => {
        const role = res.data.progress.selectedRole || res.data.user.role;
        if (role === "OWNER") setRedirectPath("/onboarding/tenant-setup");
        else if (role === "CLIENT") setRedirectPath("/client/dashboard");
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
      const res = await setupProfile(data);
      toast.success("Profile saved successfully");

      if (res.data?.completed && res.data?.redirectTo) {
        router.push(res.data.redirectTo);
      } else if (res.data?.nextStep) {
        const nextStepMap: Record<string, string> = {
          TENANT_SETUP: "/onboarding/tenant-setup",
          BRANCH_SETUP: "/onboarding/branch-setup",
          MODULE_SELECTION: "/onboarding/module-activation",
          SUBSCRIPTION: "/onboarding/subscription",
          SEARCH_TENANT: "/onboarding/tenant-search",
          COMPLETED: "/client/dashboard",
        };
        router.push(nextStepMap[res.data.nextStep] || redirectPath);
      } else {
        router.push(redirectPath);
      }
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Set Up Your Profile</h1>
        <p className="mt-1.5 text-sm text-text-secondary">Tell us about yourself to personalize your experience.</p>
      </motion.div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="mx-auto max-w-xl space-y-6">
        <motion.div variants={fadeUp}>
          <Card>
            <SectionHeading
              icon={<User size={15} />}
              title="Personal Information"
              description="Your basic details so we know who you are."
            />
            <div className="border-t border-border-subtle" />
            <CardBody className="space-y-4">
              <Input
                label="Full Name"
                required
                error={form.formState.errors.fullName?.message}
                leftAddon={<User size={15} />}
                {...form.register("fullName")}
              />
              <Input
                label="Mobile Number"
                type="tel"
                required
                error={form.formState.errors.mobileNumber?.message}
                leftAddon={<Phone size={15} />}
                {...form.register("mobileNumber")}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Date of Birth"
                  type="date"
                  leftAddon={<CalendarDays size={15} />}
                  {...form.register("dateOfBirth")}
                />
                <Select
                  label="Gender"
                  options={[
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                    { value: "OTHER", label: "Other" },
                  ]}
                  {...form.register("gender")}
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card>
            <SectionHeading
              icon={<Contact size={15} />}
              title="Contact & Preferences"
              description="How to reach you and how you like things set up."
            />
            <div className="border-t border-border-subtle" />
            <CardBody className="space-y-4">
              <Input
                label="Address"
                leftAddon={<MapPin size={15} />}
                {...form.register("address")}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Parent / Guardian Contact"
                  type="tel"
                  leftAddon={<Phone size={15} />}
                  {...form.register("parentContact")}
                />
                <Input
                  label="Company Name"
                  leftAddon={<Building2 size={15} />}
                  {...form.register("companyName")}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  label="Time Zone"
                  hint="Your local time zone for scheduling."
                  options={[
                    { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
                    { value: "Asia/Dubai", label: "Asia/Dubai" },
                    { value: "America/New_York", label: "America/New_York" },
                  ]}
                  {...form.register("timeZone")}
                />
                <Select
                  label="Preferred Language"
                  options={[
                    { value: "en", label: "English" },
                    { value: "ta", label: "Tamil" },
                    { value: "hi", label: "Hindi" },
                  ]}
                  {...form.register("preferredLanguage")}
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} className="flex justify-end">
          <Button type="submit" loading={saving} rightIcon={!saving ? <ChevronRight className="h-4 w-4" /> : undefined}>
            Save & Continue
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
