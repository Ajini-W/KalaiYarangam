import { Badge } from "@/components/ui/Badge";
import type { EnrollmentStatus } from "@/services/enrollments";
import type { TransferStatus } from "@/services/transfers";
import type { RenewalStatus } from "@/services/renewals";

const enrollmentVariant: Record<EnrollmentStatus, "success" | "warning" | "danger" | "info"> = {
  active: "success",
  paused: "warning",
  cancelled: "danger",
  completed: "info",
};

const enrollmentLabel: Record<EnrollmentStatus, string> = {
  active: "Active",
  paused: "Paused",
  cancelled: "Cancelled",
  completed: "Completed",
};

export function EnrollmentStatusBadge({ status }: { status: EnrollmentStatus }) {
  return (
    <Badge variant={enrollmentVariant[status]} size="sm">
      {enrollmentLabel[status]}
    </Badge>
  );
}

const transferVariant: Record<TransferStatus, "info" | "success" | "danger" | "warning"> = {
  pending: "info",
  approved: "success",
  rejected: "danger",
  cancelled: "warning",
};

const transferLabel: Record<TransferStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export function TransferStatusBadge({ status }: { status: TransferStatus }) {
  return (
    <Badge variant={transferVariant[status]} size="sm">
      {transferLabel[status]}
    </Badge>
  );
}

const renewalVariant: Record<RenewalStatus, "info" | "success" | "danger" | "warning"> = {
  pending: "info",
  approved: "success",
  rejected: "danger",
  cancelled: "warning",
};

const renewalLabel: Record<RenewalStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export function RenewalStatusBadge({ status }: { status: RenewalStatus }) {
  return (
    <Badge variant={renewalVariant[status]} size="sm">
      {renewalLabel[status]}
    </Badge>
  );
}
