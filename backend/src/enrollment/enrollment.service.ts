import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateRenewalDto } from './dto/create-renewal.dto';
import { AuditService } from '@/app/v1/security/audit.service';

@Injectable()
export class EnrollmentService {
  constructor(
  private readonly prisma: PrismaService,
  private readonly auditService: AuditService,
) {}

    private async logActivity(
    activity: string,
    tenantId?: string,
    resourceId?: string,
  ) {
    await this.auditService.recordActivity({
      tenantId,
      activity,
      resource: 'Enrollment',
      resourceId,
    });
  }

  // ==========================================
  // 3.1 ENROLLMENTS LOGIC + VALIDATIONS
  // ==========================================
  async createEnrollment(dto: CreateEnrollmentDto) {
    // 1. Check if the student is already actively enrolled in this batch
    const existingEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId: dto.studentId,
        batchId: dto.batchId,
        status: 'ACTIVE',
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('Student is already actively enrolled');
    }

    // 2. Fetch the batch to check its capacity
    const batch = await this.prisma.batch.findUnique({
      where: { id: dto.batchId },
    });

    if (!batch) {
      throw new NotFoundException(`Batch with ID ${dto.batchId} not found`);
    }

    // 3. Count how many active students are currently in this batch
    const currentEnrolledCount = await this.prisma.enrollment.count({
      where: {
        batchId: dto.batchId,
        status: 'ACTIVE',
      },
    });

    // 4. Check if the batch is full
    if (currentEnrolledCount >= batch.capacity) {
      throw new BadRequestException(`Batch is full! Max limit of ${batch.capacity} reached.`);
    }

    // 5. Everything passed! Create the enrollment record cleanly
    const newEnrollment = await this.prisma.enrollment.create({
      data: {
        studentId: dto.studentId,
        batchId: dto.batchId,
        tenantId: dto.tenantId,
        status: 'ACTIVE',
      },
    });
    await this.logActivity(
  'ENROLLMENT_CREATED',
  dto.tenantId,
  newEnrollment.id,
);

    return newEnrollment;
  }
  async findAll() {
    return this.prisma.enrollment.findMany();
  }

  async findOne(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({ where: { id } });
    if (!enrollment) throw new NotFoundException(`Enrollment ${id} not found`);
    return enrollment;
  }

  async pause(id: string) {
  await this.findOne(id);

  const enrollment = await this.prisma.enrollment.update({
    where: { id },
    data: { status: 'PAUSED' },
  });

  await this.logActivity(
    'ENROLLMENT_PAUSED',
    enrollment.tenantId,
    enrollment.id,
  );

  return enrollment;
}
  async resume(id: string) {
  await this.findOne(id);

  const enrollment = await this.prisma.enrollment.update({
    where: { id },
    data: { status: 'ACTIVE' },
  });

  await this.logActivity(
    'ENROLLMENT_RESUMED',
    enrollment.tenantId,
    enrollment.id,
  );

  return enrollment;
}

  async reactivate(id: string) {
  await this.findOne(id);

  const enrollment = await this.prisma.enrollment.update({
    where: { id },
    data: { status: 'ACTIVE' },
  });

  await this.logActivity(
    'ENROLLMENT_REACTIVATED',
    enrollment.tenantId,
    enrollment.id,
  );

  return enrollment;
}

  async cancel(id: string) {
  await this.findOne(id);

  const enrollment = await this.prisma.enrollment.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });

  await this.logActivity(
    'ENROLLMENT_CANCELLED',
    enrollment.tenantId,
    enrollment.id,
  );

  return enrollment;
}

  async initiateTransfer(id: string) {
  await this.findOne(id);

  const enrollment = await this.prisma.enrollment.update({
    where: { id },
    data: { status: 'PAUSED' },
  });

  await this.logActivity(
    'TRANSFER_INITIATED',
    enrollment.tenantId,
    enrollment.id,
  );

  return enrollment;
}

  // ==========================================
  // 3.2 TRANSFERS LOGIC
  // ==========================================
  async handleBatchTransfer(dto: CreateTransferDto) {
  const transfer = await this.prisma.transfer.create({
    data: {
      enrollmentId: dto.enrollmentId,
      tenantId: dto.tenantId,
      fromBatchId: dto.fromBatchId,
      toBatchId: dto.toBatchId,
      status: 'PENDING',
    },
  });

  await this.logActivity(
    'TRANSFER_CREATED',
    dto.tenantId,
    transfer.id,
  );

  return transfer;
}

  async findAllTransfers() {
    return this.prisma.transfer.findMany();
  }

  async findTransferById(id: string) {
    const record = await this.prisma.transfer.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Transfer record ${id} not found`);
    return record;
  }

  async approveTransfer(id: string) {
  const transfer = await this.findTransferById(id);

  await this.prisma.enrollment.update({
    where: { id: transfer.enrollmentId },
    data: { status: 'CANCELLED' },
  });

  const updatedTransfer = await this.prisma.transfer.update({
    where: { id },
    data: { status: 'APPROVED' },
  });

  await this.logActivity(
    'TRANSFER_APPROVED',
    transfer.tenantId,
    transfer.id,
  );

  return updatedTransfer;
}

  async rejectTransfer(id: string) {
  const transfer = await this.findTransferById(id);

  await this.prisma.enrollment.update({
    where: { id: transfer.enrollmentId },
    data: { status: 'ACTIVE' },
  });

  const updatedTransfer = await this.prisma.transfer.update({
    where: { id },
    data: { status: 'REJECTED' },
  });

  await this.logActivity(
    'TRANSFER_REJECTED',
    transfer.tenantId,
    transfer.id,
  );

  return updatedTransfer;
}

async cancelTransfer(id: string) {
  const transfer = await this.prisma.transfer.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });

  await this.logActivity(
    'TRANSFER_CANCELLED',
    transfer.tenantId,
    transfer.id,
  );

  return transfer;
}
  

  // ==========================================
  // 3.3 RENEWALS LOGIC
  // ==========================================
 async handleContractRenewal(dto: CreateRenewalDto) {
  const renewal = await this.prisma.renewal.create({
    data: {
      enrollmentId: dto.enrollmentId,
      tenantId: dto.tenantId,
      currentEndDate: new Date(dto.currentEndDate),
      extendedEndDate: new Date(dto.extendedEndDate),
      status: 'PENDING',
      notes: dto.notes,
    },
  });

  await this.logActivity(
    'RENEWAL_CREATED',
    dto.tenantId,
    renewal.id,
  );

  return renewal;
}

  async findAllRenewals() {
    return this.prisma.renewal.findMany();
  }

  async findRenewalById(id: string) {
    const record = await this.prisma.renewal.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Renewal record ${id} not found`);
    return record;
  }

  async approveRenewal(id: string) {
  const renewal = await this.prisma.renewal.update({
    where: { id },
    data: {
      status: 'APPROVED',
      approvedAt: new Date(),
    },
  });

  await this.logActivity(
    'RENEWAL_APPROVED',
    renewal.tenantId,
    renewal.id,
  );

  return renewal;
}

  async rejectRenewal(id: string) {
  const renewal = await this.prisma.renewal.update({
    where: { id },
    data: { status: 'REJECTED' },
  });

  await this.logActivity(
    'RENEWAL_REJECTED',
    renewal.tenantId,
    renewal.id,
  );

  return renewal;
}

 async cancelRenewal(id: string) {
  const renewal = await this.prisma.renewal.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });

  await this.logActivity(
    'RENEWAL_CANCELLED',
    renewal.tenantId,
    renewal.id,
  );

  return renewal;
}
}