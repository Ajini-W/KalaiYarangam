import { apiClient } from "./api-client";
import type {
  Certificate,
  CertificateDownloadData,
  CertificateListParams,
  CertificateTemplate,
  CertificateVerificationResult,
  CreateCertificatePayload,
  GenerateBulkCertificatePayload,
  PaginatedMeta,
  PaginatedResult,
} from "@/types/certificates";

interface ApiEnvelope<T> {
  httpStatusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data;
}

function unwrapPaginated<T>(
  response: { data: ApiEnvelope<PaginatedResult<T>> },
): { data: T[]; meta: PaginatedMeta } {
  const payload = response.data.data;
  return { data: payload.data ?? [], meta: payload.meta };
}

export const certificatesService = {
  async list(params: CertificateListParams = {}) {
    const response = await apiClient.get<ApiEnvelope<PaginatedResult<Certificate>>>(
      "/class/certificates",
      { params },
    );
    return unwrapPaginated<Certificate>(response);
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiEnvelope<Certificate>>(`/class/certificates/${id}`);
    return unwrap(response);
  },

  async create(payload: CreateCertificatePayload) {
    const response = await apiClient.post<ApiEnvelope<Certificate>>(
      "/class/certificates",
      payload,
    );
    return unwrap(response);
  },

  async download(id: string) {
    const response = await apiClient.get<ApiEnvelope<CertificateDownloadData>>(
      `/class/certificates/${id}/download`,
    );
    return unwrap(response);
  },

  async verify(certificateNo: string) {
    const response = await apiClient.get<ApiEnvelope<CertificateVerificationResult>>(
      `/class/certificates/verify/${encodeURIComponent(certificateNo)}`,
    );
    return unwrap(response);
  },

  async generateBulk(payload: GenerateBulkCertificatePayload) {
    const response = await apiClient.post<ApiEnvelope<Certificate[]>>(
      "/class/certificates/generate-bulk",
      payload,
    );
    return unwrap(response);
  },

  async reissue(id: string) {
    const response = await apiClient.post<ApiEnvelope<Certificate>>(
      `/class/certificates/${id}/reissue`,
    );
    return unwrap(response);
  },

  async revoke(id: string, reason?: string) {
    const response = await apiClient.post<ApiEnvelope<Certificate>>(
      `/class/certificates/${id}/revoke`,
      reason ? { reason } : {},
    );
    return unwrap(response);
  },

  async listTemplates() {
    const response = await apiClient.get<
      ApiEnvelope<PaginatedResult<CertificateTemplate> | CertificateTemplate[]>
    >("/class/certificate-templates", { params: { pageSize: 100 } });
    const payload = unwrap(response);
    if (Array.isArray(payload)) return payload;
    return payload.data ?? [];
  },
};
