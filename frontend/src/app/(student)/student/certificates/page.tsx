"use client";

import { CertificateListView } from "@/components/certificates";

export default function Page() {
  return (
    <CertificateListView
      basePath="/student/certificates"
      title="My Certificates"
      subtitle="View your earned certificates."
      readOnly
    />
  );
}
