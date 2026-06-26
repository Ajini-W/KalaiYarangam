"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { getTenant, updateTenant } from "@/services/tenant";
import { getSettings, updateSettings } from "@/services/settings";

const schema = z.object({
  orgName:     z.string().min(2, "Required"),
  phone:       z.string().min(10, "Required"),
  email:       z.string().email("Valid email required"),
  website:     z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  industry:    z.string().min(1, "Select an industry"),
  timezone:    z.string().min(1, "Required"),
  currency:    z.string().min(1, "Required"),
  dateFormat:  z.string().min(1, "Required"),
  language:    z.string().min(1, "Required"),
  timeFormat:  z.string().min(1, "Required"),
  weekStartDay: z.string().min(1, "Required"),
});
type FormData = z.infer<typeof schema>;

export default function OrganisationSettingsPage() {
  const [loading, setLoading] = React.useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [tenantRes, settingsRes] = await Promise.all([
          getTenant(),
          getSettings(),
        ]);

        if (!mounted) return;

        reset({
          orgName:      tenantRes.data.name ?? "",
          phone:        tenantRes.data.phone ?? "",
          email:        tenantRes.data.email ?? "",
          website:      tenantRes.data.website ?? "",
          industry:     tenantRes.data.industry?.toLowerCase() ?? "",
          timezone:     settingsRes.data.timezone ?? "",
          currency:     settingsRes.data.currency ?? "",
          dateFormat:   settingsRes.data.dateFormat ?? "",
          language:     settingsRes.data.language ?? "",
          timeFormat:   settingsRes.data.timeFormat ?? "",
          weekStartDay: settingsRes.data.weekStartDay ?? "",
        });
      } catch {
        if (!mounted) return;
        toast.error("Failed to load organisation settings");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await Promise.all([
        updateTenant({
          name:     data.orgName,
          phone:    data.phone,
          email:    data.email,
          website:  data.website || undefined,
          industry: data.industry.toUpperCase(),
        }),
        updateSettings({
          timezone:     data.timezone,
          currency:     data.currency,
          dateFormat:   data.dateFormat,
          language:     data.language,
          timeFormat:   data.timeFormat,
          weekStartDay: data.weekStartDay,
        }),
      ]);

      toast.success("Organisation settings saved");
    } catch {
      toast.error("Failed to save organisation settings");
    }
  };

  if (loading) {
    return (
      <PageContainer title="Organisation Settings" subtitle="Manage your business profile">
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader><CardTitle>Business Details</CardTitle></CardHeader>
            <CardBody className="space-y-4 pt-0">
              <Skeleton className="h-9 w-full" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
              <Skeleton className="h-9 w-full" />
            </CardBody>
          </Card>
          <Card>
            <CardHeader><CardTitle>Regional Settings</CardTitle></CardHeader>
            <CardBody className="space-y-4 pt-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </CardBody>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Organisation Settings" subtitle="Manage your business profile">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <Card>
          <CardHeader><CardTitle>Business Details</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <Input label="Organisation Name" required error={errors.orgName?.message} {...register("orgName")} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Phone" type="tel" required error={errors.phone?.message}  {...register("phone")} />
              <Input label="Email" type="email" required error={errors.email?.message} {...register("email")} />
            </div>
            <Input label="Website" type="url" placeholder="https://example.com" error={errors.website?.message} {...register("website")} />
            <Select
              label="Industry"
              required
              error={errors.industry?.message}
              options={[
                { value: "training", label: "Training / Coaching" },
                { value: "rental",   label: "Rental Business" },
                { value: "event",   label: "Event Management" },
              ]}
              {...register("industry")}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Regional Settings</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Timezone"
                required
                error={errors.timezone?.message}
                options={[
                  { value: "Asia/Kolkata",    label: "IST (UTC+5:30)" },
                  { value: "Asia/Singapore",  label: "SGT (UTC+8)" },
                  { value: "America/New_York",label: "EST (UTC-5)" },
                ]}
                {...register("timezone")}
              />
              <Select
                label="Currency"
                required
                error={errors.currency?.message}
                options={[
                  { value: "INR", label: "INR — Indian Rupee" },
                  { value: "USD", label: "USD — US Dollar" },
                  { value: "SGD", label: "SGD — Singapore Dollar" },
                ]}
                {...register("currency")}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Date Format"
                required
                error={errors.dateFormat?.message}
                options={[
                  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                ]}
                {...register("dateFormat")}
              />
              <Select
                label="Time Format"
                required
                error={errors.timeFormat?.message}
                options={[
                  { value: "12h", label: "12-hour (AM/PM)" },
                  { value: "24h", label: "24-hour" },
                ]}
                {...register("timeFormat")}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Language"
                required
                error={errors.language?.message}
                options={[
                  { value: "en", label: "English" },
                  { value: "ta", label: "தமிழ் (Tamil)" },
                  { value: "hi", label: "हिन्दी (Hindi)" },
                ]}
                {...register("language")}
              />
              <Select
                label="Week Starts On"
                required
                error={errors.weekStartDay?.message}
                options={[
                  { value: "monday",    label: "Monday" },
                  { value: "sunday",    label: "Sunday" },
                  { value: "saturday",  label: "Saturday" },
                ]}
                {...register("weekStartDay")}
              />
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting}>Save Changes</Button>
        </div>
      </form>
    </PageContainer>
  );
}
