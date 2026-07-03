"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, RefreshCw, Layers, ShieldCheck } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table, type Column } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState } from "@/components/ui/EmptyState";
import { useCertificateList, useCertificateMutations, useCertificateTemplates } from "@/hooks/useCertificates";
import { DevModeBadge } from "@/components/shared/DevModeBadge";
import { CertificateStatusBadge } from "./CertificateStatusBadge";
import { BulkGenerateDialog } from "./BulkGenerateDialog";
import type { Certificate } from "@/types/certificates";
import type { BulkGenerateFormValues } from "@/validations/certificates";

interface CertificateListViewProps {
  basePath: string;
  title?: string;
  subtitle?: string;
  readOnly?: boolean;
}

export function CertificateListView({
  basePath,
  title = "Certificates",
  subtitle = "View and manage issued certificates.",
  readOnly = false,
}: CertificateListViewProps) {
  const [page, setPage] = React.useState(1);
  const [bulkOpen, setBulkOpen] = React.useState(false);

  const { certificates, meta, loading, error, usingMock, setParams, refetch } = useCertificateList({
    page: 1,
    pageSize: 10,
  });
  const { templates } = useCertificateTemplates();
  const { saving, generateBulk } = useCertificateMutations();

  React.useEffect(() => {
    setParams({ page, pageSize: 10 });
  }, [page, setParams]);

  const handleBulk = async (values: BulkGenerateFormValues) => {
    await generateBulk({
      batchId: values.batchId,
      templateId: values.templateId,
      issuedDate: values.issuedDate || undefined,
    });
    setBulkOpen(false);
    refetch();
  };

  const columns: Column<Certificate>[] = [
    {
      key: "certNumber",
      header: "Certificate No",
      render: (row) => (
        <Link href={`${basePath}/${row.id}`} className="font-medium text-primary hover:underline">
          {row.certNumber}
        </Link>
      ),
    },
    {
      key: "student",
      header: "Student",
      render: (row) => row.student?.name ?? "—",
    },
    {
      key: "courseName",
      header: "Course",
    },
    {
      key: "issuedDate",
      header: "Issued",
      render: (row) => new Date(row.issuedDate).toLocaleDateString(),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <CertificateStatusBadge certificate={row} />,
    },
  ];

  if (error && !loading && certificates.length === 0) {
    return (
      <PageContainer title={title} subtitle={subtitle}>
        <ErrorState
          code={500}
          title="Unable to load certificates"
          description={error}
          action={{ label: "Retry", onClick: refetch }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={title}
      subtitle={subtitle}
      actions={
        !readOnly ? (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" leftIcon={<Layers size={14} />} onClick={() => setBulkOpen(true)}>
              Bulk generate
            </Button>
            <Link href={`${basePath}/generate`}>
              <Button size="sm" leftIcon={<Plus size={14} />}>Generate</Button>
            </Link>
          </div>
        ) : undefined
      }
    >
      <DevModeBadge visible={usingMock} className="mb-4" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-primary" size={20} />
                <CardTitle>All certificates</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={refetch} leftIcon={<RefreshCw size={14} />}>
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardBody className="space-y-4 pt-0">
            <Table
              columns={columns}
              data={certificates}
              loading={loading}
              emptyTitle="No certificates yet"
              emptyDescription="Generate certificates for students who complete their courses."
            />
            <Pagination
              page={meta.page}
              pageSize={meta.pageSize}
              total={meta.total}
              onPageChange={setPage}
            />
          </CardBody>
        </Card>
      </motion.div>

      {!readOnly && (
        <BulkGenerateDialog
          open={bulkOpen}
          onClose={() => setBulkOpen(false)}
          templates={templates}
          saving={saving}
          onSubmit={handleBulk}
        />
      )}
    </PageContainer>
  );
}
