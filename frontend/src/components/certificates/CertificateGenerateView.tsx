"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { EntitySearch } from "@/components/shared/EntitySearch";
import { useCertificateMutations, useCertificateTemplates } from "@/hooks/useCertificates";
import { certificateFormSchema, type CertificateFormValues } from "@/validations/certificates";
import { TemplatePreview } from "./TemplatePreview";
import type { CertificateSnapshot } from "@/types/certificates";

interface CertificateGenerateViewProps {
  basePath: string;
}

export function CertificateGenerateView({ basePath }: CertificateGenerateViewProps) {
  const router = useRouter();
  const { templates, loading: templatesLoading } = useCertificateTemplates();
  const { saving, create } = useCertificateMutations();
  const [preview, setPreview] = React.useState<CertificateSnapshot | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: { studentId: "", templateId: "", batchId: "", courseName: "", issuedDate: "" },
  });

  const templateId = watch("templateId");
  const selectedTemplate = templates.find((t) => t.id === templateId);

  const onSubmit = async (values: CertificateFormValues) => {
    const cert = await create({
      studentId: values.studentId,
      templateId: values.templateId,
      batchId: values.batchId || undefined,
      courseName: values.courseName || undefined,
      issuedDate: values.issuedDate || undefined,
    });
    router.push(`${basePath}/${cert.id}`);
  };

  return (
    <PageContainer
      title="Generate certificate"
      subtitle="Create a certificate for a student."
      back={() => router.push(basePath)}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-text-primary">Student</label>
                <EntitySearch
                  searchType="students"
                  onSelect={(item) => {
                    setValue("studentId", item.id, { shouldValidate: true });
                    setPreview((p) => ({
                      ...(p ?? {}),
                      student: { id: item.id, name: item.label },
                    }));
                  }}
                />
                {errors.studentId && (
                  <p className="mt-1 text-xs text-danger">{errors.studentId.message}</p>
                )}
              </div>

              {templatesLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Select
                  label="Template"
                  required
                  placeholder="Select template"
                  options={templates.map((t) => ({ value: t.id, label: t.name }))}
                  error={errors.templateId?.message}
                  {...register("templateId", {
                    onChange: (e) => {
                      const tpl = templates.find((t) => t.id === e.target.value);
                      setPreview((p) => ({
                        ...(p ?? {}),
                        template: tpl ? { id: tpl.id, name: tpl.name } : undefined,
                      }));
                    },
                  })}
                />
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-text-primary">Batch (optional)</label>
                <EntitySearch
                  searchType="batches"
                  onSelect={(item) => {
                    setValue("batchId", item.id);
                    setPreview((p) => ({
                      ...(p ?? {}),
                      courseName: item.label,
                      batch: { id: item.id, name: item.label },
                    }));
                  }}
                />
              </div>

              <Input
                label="Course name"
                hint="Required if no batch is selected"
                error={errors.courseName?.message}
                {...register("courseName", {
                  onChange: (e) =>
                    setPreview((p) => ({ ...(p ?? {}), courseName: e.target.value })),
                })}
              />

              <Input label="Issue date" type="date" error={errors.issuedDate?.message} {...register("issuedDate")} />

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => router.push(basePath)}>
                  Cancel
                </Button>
                <Button type="submit" loading={saving}>Generate</Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <div>
          <p className="mb-3 text-sm font-medium text-text-primary">Preview</p>
          <TemplatePreview
            snapshot={
              preview ?? {
                student: { id: "", name: "Student Name" },
                courseName: "Course Name",
                template: selectedTemplate
                  ? { id: selectedTemplate.id, name: selectedTemplate.name }
                  : { id: "", name: "Certificate" },
              }
            }
          />
        </div>
      </div>
    </PageContainer>
  );
}
