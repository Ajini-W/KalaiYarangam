"use client";

import { use } from "react";
import { CertificateDetailView } from "@/components/certificates";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <CertificateDetailView basePath="/branch-manager/certificates" certificateId={id} />;
}
