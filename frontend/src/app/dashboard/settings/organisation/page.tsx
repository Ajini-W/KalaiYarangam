"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  orgName:   z.string().min(2, "Required"),
  phone:     z.string().min(10, "Required"),
  email:     z.string().email("Valid email required"),
  address:   z.string().min(5, "Required"),
  industry:  z.string().min(1, "Select an industry"),
  timezone:  z.string().min(1, "Required"),
  currency:  z.string().min(1, "Required"),
});
type FormData = z.infer<typeof schema>;

export default function OrganisationSettingsPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { orgName: "My Academy", phone: "9876543210", email: "admin@myacademy.com", address: "Chennai, Tamil Nadu", industry: "training", timezone: "Asia/Kolkata", currency: "INR" },
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    toast.success("Settings saved!");
  };

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
            <Input label="Address" required error={errors.address?.message} {...register("address")} />
            <Select
              label="Industry"
              required
              error={errors.industry?.message}
              options={[
                { value: "training", label: "Training / Coaching" },
                { value: "rental",   label: "Rental Business" },
                { value: "events",   label: "Event Management" },
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
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting}>Save Changes</Button>
        </div>
      </form>
    </PageContainer>
  );
}
