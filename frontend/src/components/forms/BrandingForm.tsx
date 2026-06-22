"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

const schema = z.object({
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  tagline: z.string().optional(),
  customDomain: z.string().optional(),
});
export type BrandingFormData = z.infer<typeof schema>;

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function ColorInput({ label, value, onChange, error }: ColorInputProps) {
  const inputId = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-text-primary">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 shrink-0 cursor-pointer rounded-[var(--radius-sm)] border border-border bg-surface p-0.5"
          aria-label={label}
        />
        <div className="flex-1">
          <Input
            id={inputId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

export interface BrandingFormProps {
  defaultValues?: Partial<BrandingFormData>;
  loading?: boolean;
  onSave: (data: BrandingFormData) => Promise<void>;
  submitLabel?: string;
}

export function BrandingForm({ defaultValues, loading, onSave, submitLabel = "Save Changes" }: BrandingFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BrandingFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      logoUrl: "",
      faviconUrl: "",
      primaryColor: "",
      secondaryColor: "",
      tagline: "",
      customDomain: "",
      ...defaultValues,
    },
  });

  if (loading) {
    return (
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader><CardTitle>Brand Identity</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSave)} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader><CardTitle>Brand Identity</CardTitle></CardHeader>
        <CardBody className="space-y-4 pt-0">
          <Input label="Logo URL" placeholder="https://example.com/logo.png" {...register("logoUrl")} />
          <Input label="Favicon URL" placeholder="https://example.com/favicon.ico" {...register("faviconUrl")} />
          <Textarea label="Tagline" placeholder="Your business tagline" {...register("tagline")} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
        <CardBody className="space-y-4 pt-0">
          <Controller
            name="primaryColor"
            control={control}
            render={({ field }) => (
              <ColorInput label="Primary Color" value={field.value ?? ""} onChange={field.onChange} error={errors.primaryColor?.message} />
            )}
          />
          <Controller
            name="secondaryColor"
            control={control}
            render={({ field }) => (
              <ColorInput label="Secondary Color" value={field.value ?? ""} onChange={field.onChange} error={errors.secondaryColor?.message} />
            )}
          />
          <Input label="Custom Domain" placeholder="academy.example.com" {...register("customDomain")} />
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>{submitLabel}</Button>
      </div>
    </form>
  );
}
