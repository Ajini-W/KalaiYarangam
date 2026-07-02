import { apiClient } from "./api-client";
import type { ApiResponse, PaginatedData } from "./types";

/* ─── Fee Plan Types ──────────────────────────────────────────────────── */

export type FeePlanStatus = "active" | "inactive";

export interface FeePlan {
  id: string;
  tenantId: string;
  branchId: string;
  planName: string;
  courseId: string;
  courseName: string;
  validity: string;
  admissionFee: number;
  tuitionFee: number;
  installments: number;
  discount: number;
  status: FeePlanStatus;
  studentsAssigned: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeePlanRequest {
  planName: string;
  courseId: string;
  validity: string;
  admissionFee: number;
  tuitionFee: number;
  installments: number;
  discount: number;
}

export interface UpdateFeePlanRequest {
  planName?: string;
  courseId?: string;
  validity?: string;
  admissionFee?: number;
  tuitionFee?: number;
  installments?: number;
  discount?: number;
}

export interface FeePlanListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: FeePlanStatus;
  courseId?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

/* ─── Invoice Types ───────────────────────────────────────────────────── */

export type InvoiceStatus = "paid" | "partial" | "overdue" | "pending";

export interface Invoice {
  id: string;
  tenantId: string;
  branchId: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  feePlanId: string;
  feePlanName: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceRequest {
  studentId: string;
  feePlanId: string;
  issueDate: string;
  dueDate: string;
  notes?: string;
}

export interface InvoiceListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: InvoiceStatus;
  courseId?: string;
  dateFrom?: string;
  dateTo?: string;
  studentId?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

/* ─── Payment Types ───────────────────────────────────────────────────── */

export type PaymentStatus = "completed" | "pending" | "failed" | "refunded";
export type PaymentMethod = "cash" | "card" | "bank_transfer" | "cheque" | "online";

export interface Payment {
  id: string;
  tenantId: string;
  branchId: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string | null;
  status: PaymentStatus;
  collectedById: string;
  collectedByName: string;
  referenceNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecordPaymentRequest {
  studentId: string;
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  referenceNumber?: string;
  notes?: string;
}

export interface PaymentListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  studentId?: string;
  invoiceId?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

/* ─── Fee Plan API ────────────────────────────────────────────────────── */

export async function getFeePlans(
  params?: FeePlanListParams,
): Promise<ApiResponse<PaginatedData<FeePlan>>> {
  const response = await apiClient.get<ApiResponse<PaginatedData<FeePlan>>>(
    "/fee-plans",
    { params },
  );
  return response.data;
}

export async function getFeePlan(
  id: string,
): Promise<ApiResponse<FeePlan>> {
  const response = await apiClient.get<ApiResponse<FeePlan>>(
    `/fee-plans/${id}`,
  );
  return response.data;
}

export async function createFeePlan(
  data: CreateFeePlanRequest,
): Promise<ApiResponse<FeePlan>> {
  const response = await apiClient.post<ApiResponse<FeePlan>>(
    "/fee-plans",
    data,
  );
  return response.data;
}

export async function updateFeePlan(
  id: string,
  data: UpdateFeePlanRequest,
): Promise<ApiResponse<FeePlan>> {
  const response = await apiClient.patch<ApiResponse<FeePlan>>(
    `/fee-plans/${id}`,
    data,
  );
  return response.data;
}

export async function activateFeePlan(
  id: string,
): Promise<ApiResponse<FeePlan>> {
  const response = await apiClient.post<ApiResponse<FeePlan>>(
    `/fee-plans/${id}/activate`,
  );
  return response.data;
}

export async function deactivateFeePlan(
  id: string,
): Promise<ApiResponse<FeePlan>> {
  const response = await apiClient.post<ApiResponse<FeePlan>>(
    `/fee-plans/${id}/deactivate`,
  );
  return response.data;
}

export async function duplicateFeePlan(
  id: string,
): Promise<ApiResponse<FeePlan>> {
  const response = await apiClient.post<ApiResponse<FeePlan>>(
    `/fee-plans/${id}/duplicate`,
  );
  return response.data;
}

export async function deleteFeePlan(
  id: string,
): Promise<ApiResponse<void>> {
  const response = await apiClient.delete<ApiResponse<void>>(
    `/fee-plans/${id}`,
  );
  return response.data;
}

/* ─── Invoice API ─────────────────────────────────────────────────────── */

export async function getInvoices(
  params?: InvoiceListParams,
): Promise<ApiResponse<PaginatedData<Invoice>>> {
  const response = await apiClient.get<ApiResponse<PaginatedData<Invoice>>>(
    "/invoices",
    { params },
  );
  return response.data;
}

export async function getInvoice(
  id: string,
): Promise<ApiResponse<Invoice>> {
  const response = await apiClient.get<ApiResponse<Invoice>>(
    `/invoices/${id}`,
  );
  return response.data;
}

export async function createInvoice(
  data: CreateInvoiceRequest,
): Promise<ApiResponse<Invoice>> {
  const response = await apiClient.post<ApiResponse<Invoice>>(
    "/invoices",
    data,
  );
  return response.data;
}

export async function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus,
): Promise<ApiResponse<Invoice>> {
  const response = await apiClient.patch<ApiResponse<Invoice>>(
    `/invoices/${id}/status`,
    { status },
  );
  return response.data;
}

/* ─── Payment API ─────────────────────────────────────────────────────── */

export async function getPayments(
  params?: PaymentListParams,
): Promise<ApiResponse<PaginatedData<Payment>>> {
  const response = await apiClient.get<ApiResponse<PaginatedData<Payment>>>(
    "/payments",
    { params },
  );
  return response.data;
}

export async function getPayment(
  id: string,
): Promise<ApiResponse<Payment>> {
  const response = await apiClient.get<ApiResponse<Payment>>(
    `/payments/${id}`,
  );
  return response.data;
}

export async function recordPayment(
  data: RecordPaymentRequest,
): Promise<ApiResponse<Payment>> {
  const response = await apiClient.post<ApiResponse<Payment>>(
    "/payments",
    data,
  );
  return response.data;
}

export async function refundPayment(
  id: string,
): Promise<ApiResponse<Payment>> {
  const response = await apiClient.post<ApiResponse<Payment>>(
    `/payments/${id}/refund`,
  );
  return response.data;
}
