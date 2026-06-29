"use client";

import { use } from "react";
import { CertificateDetailView } from "@/components/certificates";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <CertificateDetailView
      basePath="/student/certificates"
      certificateId={id}
      readOnly
    />
  );
}
