"use client";

import { Badge } from "@/components/ui/Badge";
import type { Certificate } from "@/types/certificates";

export function CertificateStatusBadge({ certificate }: { certificate: Certificate }) {
  const revoked = Boolean(certificate.revokedAt);
  return (
    <Badge variant={revoked ? "danger" : "success"}>
      {revoked ? "Revoked" : "Active"}
    </Badge>
  );
}
