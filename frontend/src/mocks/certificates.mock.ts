import type { PaginatedMeta } from "@/types/attendance";
import type { Certificate, CertificateTemplate } from "@/types/certificates";

/** Local sample PDFs for pdf.js preview testing */
export const MOCK_CERTIFICATE_PDF_URLS = {
  cert1: "/mocks/sample-certificate-1.pdf",
  cert2: "/mocks/sample-certificate-2.pdf",
} as const;

export const MOCK_CERTIFICATES_META: PaginatedMeta = {
  page: 1,
  pageSize: 10,
  total: 2,
  totalPages: 1,
};

export const MOCK_CERTIFICATE_TEMPLATES: CertificateTemplate[] = [
  {
    id: "mock-tpl-1",
    name: "Classic Gold Border",
    isActive: true,
    orientation: "landscape",
    paperSize: "A4",
  },
  {
    id: "mock-tpl-2",
    name: "Modern Minimal",
    isActive: true,
    orientation: "portrait",
    paperSize: "A4",
  },
];

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: "mock-cert-1",
    tenantId: "mock-tenant-1",
    studentId: "mock-stu-1",
    templateId: "mock-tpl-1",
    certNumber: "KY-2026-0001",
    courseName: "Bharatanatyam Level 1",
    issuedDate: "2026-06-15",
    pdfUrl: MOCK_CERTIFICATE_PDF_URLS.cert1,
    data: {
      certNumber: "KY-2026-0001",
      courseName: "Bharatanatyam Level 1",
      student: { id: "mock-stu-1", name: "priya", email: "priya@gmail.com" },
      batch: { id: "mock-batch-1", name: "Bharatanatyam Beginners", code: "BB-01" },
      template: { id: "mock-tpl-1", name: "Classic Gold Border" },
    },
    createdAt: "2026-06-15T10:00:00Z",
    updatedAt: "2026-06-15T10:00:00Z",
    student: { id: "mock-stu-1", name: "Ajini W", email: "ajini123@example.com" },
    template: { id: "mock-tpl-1", name: "Classic Gold Border", orientation: "landscape", paperSize: "A4" },
    batch: { id: "mock-batch-1", name: "Bharatanatyam Beginners", code: "BB-01" },
  },
  {
    id: "mock-cert-2",
    tenantId: "mock-tenant-1",
    studentId: "mock-stu-3",
    templateId: "mock-tpl-2",
    certNumber: "KY-2026-0002",
    courseName: "Carnatic Vocal Foundation",
    issuedDate: "2026-06-20",
    pdfUrl: MOCK_CERTIFICATE_PDF_URLS.cert2,
    data: {
      certNumber: "KY-2026-0002",
      courseName: "Carnatic Vocal Foundation",
      student: { id: "mock-stu-3", name: "Meera", email: "meera@example.com" },
      batch: { id: "mock-batch-2", name: "Carnatic Vocal — Intermediate", code: "CV-02" },
      template: { id: "mock-tpl-2", name: "Modern Minimal" },
    },
    createdAt: "2026-06-20T10:00:00Z",
    updatedAt: "2026-06-20T10:00:00Z",
    student: { id: "mock-stu-3", name: "Meera", email: "meera@example.com" },
    template: { id: "mock-tpl-2", name: "Modern Minimal", orientation: "portrait", paperSize: "A4" },
    batch: { id: "mock-batch-2", name: "Carnatic Vocal — Intermediate", code: "CV-02" },
  },
];

export function getMockCertificate(id: string): Certificate | null {
  return MOCK_CERTIFICATES.find((c) => c.id === id) ?? null;
}

export function getMockCertificateList() {
  return { data: MOCK_CERTIFICATES, meta: MOCK_CERTIFICATES_META };
}
