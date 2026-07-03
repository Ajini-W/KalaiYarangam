"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/EmptyState";
import { PdfViewer } from "@/components/ui/PdfViewer";
import { useCertificate, useCertificateMutations } from "@/hooks/useCertificates";
import { DevModeBadge } from "@/components/shared/DevModeBadge";
import { CertificateStatusBadge } from "./CertificateStatusBadge";
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
  const { certificate, loading, error, usingMock, refetch } = useCertificate(certificateId);
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Skeleton className="h-96 w-full max-w-2xl mx-auto" />
        </motion.div>
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <DevModeBadge visible={usingMock} className="mb-4" />
        <div className="mb-4">
          <CertificateStatusBadge certificate={certificate} />
        </div>

        {/* PDF Preview Section */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Certificate Preview</CardTitle>
          </CardHeader>
          <CardBody className="pt-0">
            {certificate.pdfUrl ? (
              <PdfViewer file={certificate.pdfUrl} />
            ) : (
              <div className="flex items-center justify-center p-12 text-center text-text-secondary">
                <p>PDF preview not available. Use the download button to view the certificate.</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Details Card */}
        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardBody className="grid grid-cols-1 gap-4 pt-0 text-sm sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Student</p>
              <p className="font-semibold text-text-primary">{certificate.student?.name}</p>
              {certificate.student?.email && (
                <p className="text-xs text-text-secondary">{certificate.student.email}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Template</p>
              <p className="font-semibold text-text-primary">{certificate.template?.name}</p>
              {certificate.template?.orientation && (
                <p className="text-xs text-text-secondary capitalize">{certificate.template.orientation}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Issued Date</p>
              <p className="font-semibold text-text-primary">
                {new Date(certificate.issuedDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            {certificate.batch && (
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Batch</p>
                <p className="font-semibold text-text-primary">{certificate.batch.name}</p>
                {certificate.batch.code && (
                  <p className="text-xs text-text-secondary">{certificate.batch.code}</p>
                )}
              </div>
            )}
            {certificate.revokedAt && (
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Revoked Date</p>
                <p className="font-semibold text-danger">
                  {new Date(certificate.revokedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
            {certificate.verifications && certificate.verifications.length > 0 && (
              <div className="space-y-1 sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Verification Count</p>
                <p className="font-semibold text-text-primary">{certificate.verifications.length} verification(s)</p>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>

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
