import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { CertificatePdfService } from './certificate-pdf.service';
import { CertificateStatusFilter, CreateCertificateDto, GenerateBulkCertificateDto, QueryCertificateDto, RevokeCertificateDto } from './dto/certificate.dto';

@Injectable()
export class CertificatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly certificatePdfService: CertificatePdfService,
  ) {}

  async create(user: AuthenticatedUser, dto: CreateCertificateDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const student = await this.prisma.student.findFirst({
      where: { id: dto.studentId, tenantId: user.tenantId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const template = await this.prisma.certificateTemplate.findFirst({
      where: { id: dto.templateId, tenantId: user.tenantId, isActive: true },
    });
    if (!template) {
      throw new NotFoundException('Certificate template not found');
    }

    let courseName: string;
    if (dto.batchId) {
      const batch = await this.prisma.batch.findFirst({
        where: { id: dto.batchId, tenantId: user.tenantId },
      });
      if (!batch) {
        throw new NotFoundException('Batch not found');
      }
      courseName = batch.name;
    } else if (dto.courseName) {
      courseName = dto.courseName;
    } else {
      throw new BadRequestException('Either batchId or courseName is required');
    }

    const issuedDate = dto.issuedDate ?? new Date();
    const certNumber = await this.generateCertNumber();

    const certificate = await this.prisma.certificate.create({
      data: {
        tenantId: user.tenantId,
        studentId: dto.studentId,
        templateId: dto.templateId,
        certNumber,
        courseName,
        issuedDate,
        data: (dto.data ?? {}) as any,
      },
    });

    this.generatePdfBackground(certificate, template, student.name);

    return { message: 'Certificate created successfully', data: certificate };
  }

  private async generatePdfBackground(
    certificate: { id: string; tenantId: string; courseName: string; certNumber: string; issuedDate: Date; data: unknown },
    template: { htmlContent: string; cssStyles: string | null; variables: unknown },
    studentName: string,
  ) {
    try {
      const renderedHtml = this.renderTemplate(template.htmlContent, {
        studentName,
        courseName: certificate.courseName,
        certNumber: certificate.certNumber,
        issuedDate: certificate.issuedDate.toISOString().split('T')[0],
        ...((certificate.data ?? {}) as Record<string, unknown>),
      });

      const pdfUrl = await this.certificatePdfService.generateAndUpload(
        certificate.id,
        certificate.tenantId,
        renderedHtml,
        template.cssStyles,
      );

      if (pdfUrl) {
        await this.prisma.certificate.update({
          where: { id: certificate.id },
          data: { pdfUrl },
        });
      }
    } catch (error) {
      console.error('PDF generation failed:', (error as Error).message);
    }
  }

  private renderTemplate(htmlContent: string, vars: Record<string, unknown>): string {
    return htmlContent.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const val = vars[key];
      return val !== undefined ? String(val) : '';
    });
  }

  async findAll(user: AuthenticatedUser, query: QueryCertificateDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const where: Record<string, unknown> = { tenantId: user.tenantId };

    if (query.studentId) {
      where.studentId = query.studentId;
    }

    if (query.status === CertificateStatusFilter.ACTIVE) {
      where.revokedAt = null;
    } else if (query.status === CertificateStatusFilter.REVOKED) {
      where.revokedAt = { not: null };
    }

    const [data, total] = await Promise.all([
      this.prisma.certificate.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          student: { select: { id: true, name: true, phone: true } },
          template: { select: { id: true, name: true } },
        },
      }),
      this.prisma.certificate.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async findOne(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const certificate = await this.prisma.certificate.findFirst({
      where: { id, tenantId: user.tenantId },
      include: {
        student: { select: { id: true, name: true, phone: true, email: true } },
        template: { select: { id: true, name: true } },
        verifications: { orderBy: { verifiedAt: 'desc' }, take: 5 },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return { message: 'Certificate retrieved successfully', data: certificate };
  }

  async download(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const certificate = await this.prisma.certificate.findFirst({
      where: { id, tenantId: user.tenantId },
      include: {
        student: { select: { name: true } },
        template: { select: { htmlContent: true, cssStyles: true } },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    if (certificate.pdfUrl) {
      return { message: 'Download URL retrieved successfully', data: { pdfUrl: certificate.pdfUrl } };
    }

    const renderedHtml = this.renderTemplate(certificate.template.htmlContent, {
      studentName: certificate.student.name,
      courseName: certificate.courseName,
      certNumber: certificate.certNumber,
      issuedDate: certificate.issuedDate.toISOString().split('T')[0],
      ...((certificate.data ?? {}) as Record<string, unknown>),
    });

    const pdfUrl = await this.certificatePdfService.generateAndUpload(
      certificate.id,
      certificate.tenantId,
      renderedHtml,
      certificate.template.cssStyles,
    );

    if (pdfUrl) {
      await this.prisma.certificate.update({
        where: { id },
        data: { pdfUrl },
      });
      return { message: 'Download URL retrieved successfully', data: { pdfUrl } };
    }

    return { message: 'PDF generation failed', data: null };
  }

  async verify(certificateNo: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { certNumber: certificateNo },
      include: { student: { select: { name: true } } },
    });

    if (!certificate) {
      return { message: 'Certificate verification completed', data: { valid: false, message: 'Certificate not found' } };
    }

    if (certificate.revokedAt) {
      return {
        message: 'Certificate verification completed',
        data: { valid: false, message: 'Certificate has been revoked', revokedAt: certificate.revokedAt },
      };
    }

    await this.prisma.certificateVerification.create({
      data: { certificateId: certificate.id },
    });

    return {
      message: 'Certificate verification completed',
      data: {
        valid: true,
        studentName: certificate.student.name,
        courseName: certificate.courseName,
        issuedDate: certificate.issuedDate,
        certNumber: certificate.certNumber,
      },
    };
  }

  async generateBulk(user: AuthenticatedUser, dto: GenerateBulkCertificateDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id: dto.batchId, tenantId: user.tenantId },
    });
    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const template = await this.prisma.certificateTemplate.findFirst({
      where: { id: dto.templateId, tenantId: user.tenantId, isActive: true },
    });
    if (!template) {
      throw new NotFoundException('Certificate template not found');
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: { batchId: dto.batchId, tenantId: user.tenantId, status: 'ACTIVE' },
      select: { studentId: true },
    });

    if (enrollments.length === 0) {
      throw new BadRequestException('No active enrollments found in this batch');
    }

    let targetStudentIds: string[];
    if (dto.studentIds && dto.studentIds.length > 0) {
      const enrolledIds = new Set(enrollments.map((e) => e.studentId));
      targetStudentIds = dto.studentIds.filter((id) => enrolledIds.has(id));
      if (targetStudentIds.length === 0) {
        throw new BadRequestException('None of the provided students are actively enrolled in this batch');
      }
    } else {
      targetStudentIds = enrollments.map((e) => e.studentId);
    }

    const issuedDate = dto.issuedDate ?? new Date();

    const certificates = await this.prisma.$transaction(async (tx) => {
      const results: Record<string, unknown>[] = [];
      for (const studentId of targetStudentIds) {
        const certNumber = await this.generateCertNumber();
        const certificate = await tx.certificate.create({
          data: {
            tenantId: user.tenantId,
            studentId,
            templateId: dto.templateId,
            certNumber,
            courseName: batch.name,
            issuedDate,
            data: {},
          },
        });
        results.push(certificate);
      }
      return results;
    });

    this.generateBulkPdfs(certificates, template, user.tenantId);

    return { message: 'Bulk certificates generated successfully', data: certificates };
  }

  private async generateBulkPdfs(
    certificates: Record<string, unknown>[],
    template: { htmlContent: string; cssStyles: string | null },
    tenantId: string,
  ) {
    try {
      const studentIds = [...new Set(certificates.map((c: any) => c.studentId))];
      const students = await this.prisma.student.findMany({
        where: { id: { in: studentIds }, tenantId },
        select: { id: true, name: true },
      });
      const studentMap = new Map(students.map((s) => [s.id, s.name]));

      for (const cert of certificates as any[]) {
        const studentName = studentMap.get(cert.studentId) ?? 'Student';
        const renderedHtml = this.renderTemplate(template.htmlContent, {
          studentName,
          courseName: cert.courseName,
          certNumber: cert.certNumber,
          issuedDate: new Date(cert.issuedDate).toISOString().split('T')[0],
          ...((cert.data ?? {}) as Record<string, unknown>),
        });

        const pdfUrl = await this.certificatePdfService.generateAndUpload(
          cert.id,
          cert.tenantId,
          renderedHtml,
          template.cssStyles,
        );

        if (pdfUrl) {
          await this.prisma.certificate.update({
            where: { id: cert.id },
            data: { pdfUrl },
          });
        }
      }
    } catch (error) {
      // Best-effort
    }
  }

  async reissue(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const certificate = await this.prisma.certificate.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    if (certificate.revokedAt === null) {
      throw new BadRequestException('Only revoked certificates can be reissued');
    }

    const newCertNumber = await this.generateCertNumber();

    const updated = await this.prisma.certificate.update({
      where: { id },
      data: {
        certNumber: newCertNumber,
        revokedAt: null,
        issuedDate: new Date(),
        pdfUrl: null,
      },
    });

    const pdfTemplate = await this.prisma.certificateTemplate.findFirst({ where: { id: certificate.templateId } });
    if (pdfTemplate) {
      this.generatePdfBackground(
        { ...certificate, id, certNumber: newCertNumber, issuedDate: new Date(), data: certificate.data },
        pdfTemplate,
        (await this.prisma.student.findFirst({ where: { id: certificate.studentId } }))?.name ?? 'Student',
      );
    }

    return { message: 'Certificate reissued successfully', data: updated };
  }

  async revoke(user: AuthenticatedUser, id: string, dto: RevokeCertificateDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const certificate = await this.prisma.certificate.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    if (certificate.revokedAt !== null) {
      throw new BadRequestException('Certificate is already revoked');
    }

    const updateData: Record<string, unknown> = { revokedAt: new Date() };

    if (dto.reason) {
      updateData.data = { ...((certificate.data ?? {}) as Record<string, unknown>), revokeReason: dto.reason } as any;
    }

    const updated = await this.prisma.certificate.update({
      where: { id },
      data: updateData,
    });

    return { message: 'Certificate revoked successfully', data: updated };
  }

  private async generateCertNumber(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    let certNumber: string;
    let attempts = 0;

    do {
      const random = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * 36)]).join('');
      certNumber = `CERT-${datePart}-${random}`;
      attempts++;
      if (attempts > 20) {
        throw new InternalServerErrorException('Could not generate a unique certificate number');
      }
    } while (await this.prisma.certificate.findUnique({ where: { certNumber } }));

    return certNumber;
  }
}
