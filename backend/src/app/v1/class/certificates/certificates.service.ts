import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { CertificateStatusFilter, CreateCertificateDto, GenerateBulkCertificateDto, QueryCertificateDto, RevokeCertificateDto } from './dto/certificate.dto';

@Injectable()
export class CertificatesService {
  constructor(
    private readonly prisma: PrismaService,
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
    let batch: Record<string, unknown> | null = null;
    if (dto.batchId) {
      const found = await this.prisma.batch.findFirst({
        where: { id: dto.batchId, tenantId: user.tenantId },
      });
      if (!found) {
        throw new NotFoundException('Batch not found');
      }
      batch = found;
      courseName = found.name;
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
        data: {},
      },
    });

    const snapshot = this.buildSnapshot({
      certificateId: certificate.id,
      student,
      template,
      batch,
      courseName,
      certNumber,
      issuedDate,
      metadata: dto.data ?? {},
    });

    await this.prisma.certificate.update({
      where: { id: certificate.id },
      data: { data: snapshot as any },
    });

    return { message: 'Certificate created successfully', data: { ...certificate, data: snapshot } };
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
        student: { select: { id: true, name: true, phone: true, email: true } },
        template: { select: { id: true, name: true, orientation: true, paperSize: true } },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return {
      message: 'Certificate download data retrieved successfully',
      data: {
        certificate: {
          id: certificate.id,
          certNumber: certificate.certNumber,
          courseName: certificate.courseName,
          issuedDate: certificate.issuedDate,
          student: certificate.student,
          template: certificate.template,
        },
        snapshot: certificate.data,
      },
    };
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

    const students = await this.prisma.student.findMany({
      where: { id: { in: targetStudentIds }, tenantId: user.tenantId },
    });
    const studentMap = new Map(students.map((s) => [s.id, s]));

    const issuedDate = dto.issuedDate ?? new Date();

    const certificates = await this.prisma.$transaction(async (tx) => {
      const results: Record<string, unknown>[] = [];
      for (const studentId of targetStudentIds) {
        const student = studentMap.get(studentId);
        if (!student) continue;

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

        const snapshot = this.buildSnapshot({
          certificateId: certificate.id,
          student,
          template,
          batch,
          courseName: batch.name,
          certNumber,
          issuedDate,
          metadata: {},
        });

        await tx.certificate.update({
          where: { id: certificate.id },
          data: { data: snapshot as any },
        });

        results.push({ ...certificate, data: snapshot });
      }
      return results;
    });

    return { message: 'Bulk certificates generated successfully', data: certificates };
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
    const newIssuedDate = new Date();

    const existingData = (certificate.data ?? {}) as Record<string, unknown>;
    const updatedSnapshot = {
      ...existingData,
      certNumber: newCertNumber,
      issuedDate: newIssuedDate.toISOString().split('T')[0],
      previousCertNumber: certificate.certNumber,
    };

    const updated = await this.prisma.certificate.update({
      where: { id },
      data: {
        certNumber: newCertNumber,
        revokedAt: null,
        issuedDate: newIssuedDate,
        pdfUrl: null,
        data: updatedSnapshot as any,
      },
    });

    return { message: 'Certificate reissued successfully', data: { ...updated, data: updatedSnapshot } };
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

    const existingData = (certificate.data ?? {}) as Record<string, unknown>;
    const updateData: Record<string, unknown> = { revokedAt: new Date() };

    if (dto.reason) {
      updateData.data = { ...existingData, revokeReason: dto.reason } as any;
    }

    const updated = await this.prisma.certificate.update({
      where: { id },
      data: updateData,
    });

    return { message: 'Certificate revoked successfully', data: updated };
  }

  private buildSnapshot(params: {
    certificateId: string;
    student: { id: string; name: string; phone: string; email?: string | null };
    template: { id: string; name: string };
    batch: Record<string, unknown> | null;
    courseName: string;
    certNumber: string;
    issuedDate: Date;
    metadata: Record<string, unknown>;
  }) {
    return {
      certificateId: params.certificateId,
      certNumber: params.certNumber,
      templateId: params.template.id,
      issuedDate: params.issuedDate.toISOString().split('T')[0],
      courseName: params.courseName,
      student: {
        id: params.student.id,
        name: params.student.name,
        phone: params.student.phone,
        ...(params.student.email ? { email: params.student.email } : {}),
      },
      batch: params.batch
        ? { id: params.batch.id, name: params.batch.name, code: (params.batch as any).code ?? null }
        : null,
      template: {
        id: params.template.id,
        name: params.template.name,
      },
      ...params.metadata,
    };
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
