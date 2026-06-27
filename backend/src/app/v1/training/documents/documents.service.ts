import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { CreateDocumentDto, QueryDocumentDto, UpdateDocumentDto, VerifyDocumentDto } from './dto/documents.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, dto: CreateDocumentDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const student = await this.prisma.student.findFirst({
      where: { id: dto.studentId, tenantId: user.tenantId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const doc = await this.prisma.trainingDocument.create({
      data: {
        tenantId: user.tenantId,
        studentId: dto.studentId,
        name: dto.name,
        type: dto.type,
        fileUrl: dto.fileUrl,
        fileSize: dto.fileSize,
        mimeType: dto.mimeType,
        notes: dto.notes,
      },
    });

    return { message: 'Document created successfully', data: doc };
  }

  async findAll(user: AuthenticatedUser, query: QueryDocumentDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const where: Record<string, unknown> = { tenantId: user.tenantId };

    if (query.studentId) where.studentId = query.studentId;
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.trainingDocument.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { student: { select: { id: true, name: true } } },
      }),
      this.prisma.trainingDocument.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async findOne(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const doc = await this.prisma.trainingDocument.findFirst({
      where: { id, tenantId: user.tenantId },
      include: { student: { select: { id: true, name: true } } },
    });

    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    return { message: 'Document retrieved successfully', data: doc };
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateDocumentDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const doc = await this.prisma.trainingDocument.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    const updated = await this.prisma.trainingDocument.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });

    return { message: 'Document updated successfully', data: updated };
  }

  async verify(user: AuthenticatedUser, id: string, dto: VerifyDocumentDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const doc = await this.prisma.trainingDocument.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    if (doc.status === 'ARCHIVED') {
      throw new BadRequestException('Cannot verify an archived document');
    }

    const updated = await this.prisma.trainingDocument.update({
      where: { id },
      data: {
        status: dto.status,
        verifiedBy: user.id,
        verifiedAt: new Date(),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });

    return { message: `Document ${dto.status === 'VERIFIED' ? 'verified' : 'rejected'} successfully`, data: updated };
  }

  async archive(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const doc = await this.prisma.trainingDocument.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    const updated = await this.prisma.trainingDocument.update({
      where: { id },
      data: { isArchived: true },
    });

    return { message: 'Document archived successfully', data: updated };
  }

  async restore(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const doc = await this.prisma.trainingDocument.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    const updated = await this.prisma.trainingDocument.update({
      where: { id },
      data: { isArchived: false },
    });

    return { message: 'Document restored successfully', data: updated };
  }
}
