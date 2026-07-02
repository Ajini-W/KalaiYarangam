export class CreateInvoiceDto {
  tenantId!: string;
  branchId?: string;
  studentId?: string;

  invoiceNumber!: string;
  description?: string;

  subtotal!: number;
  discount?: number;
  tax?: number;
  totalAmount!: number;

  currency?: string;

  dueDate!: Date;

  notes?: string;
}

export class UpdateInvoiceDto {
  tenantId?: string;
  branchId?: string;
  studentId?: string;

  invoiceNumber?: string;
  description?: string;

  subtotal?: number;
  discount?: number;
  tax?: number;
  totalAmount?: number;

  currency?: string;

  dueDate?: Date;

  notes?: string;
}