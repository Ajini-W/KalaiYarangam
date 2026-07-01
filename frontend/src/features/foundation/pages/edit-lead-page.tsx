"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout";
import { Card, CardBody, Skeleton } from "@/components/ui";
import { LeadForm } from "../components/LeadForm";
import { getLead, updateLead } from "@/services/leads";
import { toast } from "sonner";

interface EditLeadPageProps {
  leadId: string;
}

export function EditLeadPage({ leadId }: EditLeadPageProps) {
  const router = useRouter();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getLead(leadId)
      .then((res) => setLead(res.data))
      .catch(() => { toast.error("Lead not found"); router.push("/leads"); })
      .finally(() => setLoading(false));
  }, [leadId, router]);

  const handleSubmit = async (formData: any) => {
    setSubmitting(true);
    try {
      await updateLead(leadId, formData);
      toast.success("Lead updated successfully");
      router.push(`/leads/${leadId}`);
    } catch {
      toast.error("Failed to update lead");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer back={() => router.push("/leads")} title="Edit Lead">
        <Card className="max-w-2xl"><CardBody><div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-[var(--radius-sm)]" />)}</div></CardBody></Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Edit Lead"
      subtitle={`Editing ${lead?.name}`}
      back={() => router.push(`/leads/${leadId}`)}
    >
      <Card className="max-w-2xl">
        <CardBody>
          <LeadForm initialData={lead} onSubmit={handleSubmit} onCancel={() => router.push(`/leads/${leadId}`)} loading={submitting} />
        </CardBody>
      </Card>
    </PageContainer>
  );
}
