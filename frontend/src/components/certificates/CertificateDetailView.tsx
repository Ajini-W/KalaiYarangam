"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/EmptyState";
import { useCertificate, useCertificateMutations } from "@/hooks/useCertificates";
import { CertificateStatusBadge } from "./CertificateStatusBadge";
import { TemplatePreview } from "./TemplatePreview";
import { DownloadButton } from "./DownloadButton";
import { RevokeDialog } from "./RevokeDialog";

interface CertificateDetailViewProps {
  basePath: string;
  certificateId: string;
  readOnly?: boolean;
}

export function CertificateDetailView({
  basePath,
  certificateId,
  readOnly = false,
}: CertificateDetailViewProps) {
  const router = useRouter();
  const [revokeOpen, setRevokeOpen] = React.useState(false);
  const { certificate, loading, error, refetch } = useCertificate(certificateId);
  const { saving, reissue, revoke } = useCertificateMutations();

  const handleRevoke = async (values: { reason?: string }) => {
    await revoke(certificateId, values.reason);
    setRevokeOpen(false);
    refetch();
  };

  const handleReissue = async () => {
    const updated = await reissue(certificateId);
    router.push(`${basePath}/${updated.id}`);
  };

  if (loading) {
    return (
      <PageContainer title="Certificate">
        <Skeleton className="h-96 w-full max-w-2xl mx-auto" />
      </PageContainer>
    );
  }

  if (error || !certificate) {
    return (
      <PageContainer title="Certificate" back={() => router.push(basePath)}>
        <ErrorState code={404} title="Certificate not found" description={error ?? undefined} />
      </PageContainer>
    );
  }

  const revoked = Boolean(certificate.revokedAt);

  return (
    <PageContainer
      title={certificate.certNumber}
      subtitle={certificate.courseName}
      back={() => router.push(basePath)}
      actions={
        <div className="flex flex-wrap gap-2">
          <DownloadButton certificateId={certificate.id} certNumber={certificate.certNumber} />
          {!readOnly && revoked && (
            <Button size="sm" loading={saving} onClick={handleReissue}>Reissue</Button>
          )}
          {!readOnly && !revoked && (
            <Button size="sm" variant="outline" onClick={() => setRevokeOpen(true)}>Revoke</Button>
          )}
        </div>
      }
    >
      <div className="mb-4">
        <CertificateStatusBadge certificate={certificate} />
      </div>

      <TemplatePreview snapshot={certificate.data} className="mb-8" />

      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardBody className="grid grid-cols-1 gap-3 pt-0 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs text-text-secondary">Student</p>
            <p className="font-medium text-text-primary">{certificate.student?.name}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Template</p>
            <p className="font-medium text-text-primary">{certificate.template?.name}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Issued</p>
            <p className="font-medium text-text-primary">
              {new Date(certificate.issuedDate).toLocaleDateString()}
            </p>
          </div>
          {certificate.revokedAt && (
            <div>
              <p className="text-xs text-text-secondary">Revoked</p>
              <p className="font-medium text-danger">{new Date(certificate.revokedAt).toLocaleDateString()}</p>
            </div>
          )}
        </CardBody>
      </Card>

      {!readOnly && (
        <RevokeDialog
          open={revokeOpen}
          onClose={() => setRevokeOpen(false)}
          certNumber={certificate.certNumber}
          saving={saving}
          onSubmit={handleRevoke}
        />
      )}
    </PageContainer>
  );
}
