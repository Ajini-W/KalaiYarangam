"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Eye, Upload } from "lucide-react";

const BRAND_COLORS = [
  { label: "Indigo", value: "#4F46E5" },
  { label: "Teal", value: "#0D9488" },
  { label: "Rose", value: "#E11D48" },
  { label: "Violet", value: "#7C3AED" },
];

const schema = z.object({
  logoUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  tagline: z.string().optional(),
});
export type BrandingFormData = z.infer<typeof schema>;

export interface BrandingFormProps {
  defaultValues?: Partial<BrandingFormData>;
  loading?: boolean;
  onSave: (data: BrandingFormData) => Promise<void>;
  submitLabel?: string;
}

export function BrandingForm({ defaultValues, loading, onSave, submitLabel = "Save Changes" }: BrandingFormProps) {
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BrandingFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      logoUrl: "",
      primaryColor: "",
      secondaryColor: "",
      tagline: "",
      ...defaultValues,
    },
  });

  const primaryColor = watch("primaryColor");
  const secondaryColor = watch("secondaryColor");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLogoPreview(dataUrl);
      setValue("logoUrl", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader><CardTitle>Brand Identity</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">Logo</label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface">
                  <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
                </div>
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-border bg-surface text-text-secondary">
                  <Eye size={24} />
                </div>
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-raised transition-colors">
                <Upload size={16} />
                Choose file
                <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
              </label>
            </div>
          </div>
          <Textarea label="Tagline" placeholder="Your business tagline" {...register("tagline")} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">Primary Color</label>
            <div className="flex flex-wrap gap-2">
              {BRAND_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setValue("primaryColor", c.value)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    primaryColor === c.value ? "border-foreground scale-110" : "border-transparent hover:scale-110"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                  aria-label={`Primary color: ${c.label}`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">Secondary Color</label>
            <div className="flex flex-wrap gap-2">
              {BRAND_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setValue("secondaryColor", c.value)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    secondaryColor === c.value ? "border-foreground scale-110" : "border-transparent hover:scale-110"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                  aria-label={`Secondary color: ${c.label}`}
                />
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>{submitLabel}</Button>
      </div>
    </form>
  );
}
