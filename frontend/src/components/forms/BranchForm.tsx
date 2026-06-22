"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

const schema = z.object({
  name: z.string().min(1, "Branch name is required"),
  code: z.string().min(1, "Branch code is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(4, "Valid pincode required"),
});
export type BranchFormData = z.infer<typeof schema>;

export interface BranchFormProps {
  defaultValues?: Partial<BranchFormData>;
  loading?: boolean;
  onSave: (data: BranchFormData) => Promise<void>;
  submitLabel?: string;
}

export function BranchForm({ defaultValues, loading, onSave, submitLabel = "Save" }: BranchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      ...defaultValues,
    },
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Branch Details</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
            <Skeleton className="h-9 w-full" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Branch Details</CardTitle></CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Branch Name" required error={errors.name?.message} {...register("name")} />
            <Input label="Branch Code" required error={errors.code?.message} {...register("code")} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Email" type="email" required error={errors.email?.message} {...register("email")} />
            <Input label="Phone" type="tel" required error={errors.phone?.message} {...register("phone")} />
          </div>
          <Input label="Address" required error={errors.address?.message} {...register("address")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="City" required error={errors.city?.message} {...register("city")} />
            <Input label="State" required error={errors.state?.message} {...register("state")} />
            <Input label="Pincode" required error={errors.pincode?.message} {...register("pincode")} />
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>{submitLabel}</Button>
      </div>
    </form>
  );
}
