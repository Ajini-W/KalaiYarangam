"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout";
import { Card, CardBody } from "@/components/ui";
import { LeadForm, type LeadFormData } from "../components/LeadForm";
import { createLead } from "@/services/leads";
import { toast } from "sonner";

export function CreateLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: LeadFormData) => {
    setLoading(true);
    try {
      const res = await createLead(formData);
      toast.success("Lead created successfully");
      router.push(`/leads/${res.data.id}`);
    } catch {
      toast.error("Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Create Lead"
      subtitle="Add a new lead to your pipeline"
      back={() => router.push("/leads")}
    >
      <Card className="max-w-2xl">
        <CardBody>
          <LeadForm onSubmit={handleSubmit} onCancel={() => router.push("/leads")} loading={loading} />
        </CardBody>
      </Card>
    </PageContainer>
  );
}
