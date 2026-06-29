import { Badge } from "@/components/ui/Badge";
import type { FeePlanStatus, InvoiceStatus, PaymentStatus } from "@/services/finance";

const feePlanVariant: Record<FeePlanStatus, "success" | "secondary"> = {
  active: "success",
  inactive: "secondary",
};

const feePlanLabel: Record<FeePlanStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

export function FeePlanStatusBadge({ status }: { status: FeePlanStatus }) {
  return (
    <Badge variant={feePlanVariant[status]} size="sm">
      {feePlanLabel[status]}
    </Badge>
  );
}

const invoiceVariant: Record<InvoiceStatus, "success" | "warning" | "danger" | "info"> = {
  paid: "success",
  partial: "warning",
  overdue: "danger",
  pending: "info",
};

const invoiceLabel: Record<InvoiceStatus, string> = {
  paid: "Paid",
  partial: "Partial",
  overdue: "Overdue",
  pending: "Pending",
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <Badge variant={invoiceVariant[status]} size="sm">
      {invoiceLabel[status]}
    </Badge>
  );
}

const paymentVariant: Record<PaymentStatus, "success" | "warning" | "danger" | "info"> = {
  completed: "success",
  pending: "warning",
  failed: "danger",
  refunded: "info",
};

const paymentLabel: Record<PaymentStatus, string> = {
  completed: "Completed",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant={paymentVariant[status]} size="sm">
      {paymentLabel[status]}
    </Badge>
  );
}
