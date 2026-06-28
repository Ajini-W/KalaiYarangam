import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database';

import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateRenewalDto } from './dto/create-renewal.dto';

@Injectable()
export class EnrollmentService {
  constructor(private readonly prisma: PrismaService) {}

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
    return this.prisma.enrollment.update({
      where: { id },
      data: { status: 'PAUSED' },
    });
  }

  async resume(id: string) {
    await this.findOne(id);
    return this.prisma.enrollment.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  async reactivate(id: string) {
    await this.findOne(id);
    return this.prisma.enrollment.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  async cancel(id: string) {
    await this.findOne(id);
    return this.prisma.enrollment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async initiateTransfer(id: string) {
    await this.findOne(id);
    return this.prisma.enrollment.update({
      where: { id },
      data: { status: 'PAUSED' },
    });
  }

  // ==========================================
  // 3.2 TRANSFERS LOGIC
  // ==========================================
  async handleBatchTransfer(dto: CreateTransferDto) {
    return this.prisma.transfer.create({
      data: {
        enrollmentId: dto.enrollmentId,
        tenantId: dto.tenantId,        
        fromBatchId: dto.fromBatchId,
        toBatchId: dto.toBatchId,      
        status: 'PENDING',
      },
    });
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
    return this.prisma.transfer.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }

  async rejectTransfer(id: string) {
    const transfer = await this.findTransferById(id);
    await this.prisma.enrollment.update({
      where: { id: transfer.enrollmentId },
      data: { status: 'ACTIVE' },
    });
    return this.prisma.transfer.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  async cancelTransfer(id: string) {
    return this.prisma.transfer.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  // ==========================================
  // 3.3 RENEWALS LOGIC
  // ==========================================
  async handleContractRenewal(dto: CreateRenewalDto) {
    return this.prisma.renewal.create({
      data: {
        enrollmentId: dto.enrollmentId,
        tenantId: dto.tenantId,                      
        currentEndDate: new Date(dto.currentEndDate),  
        extendedEndDate: new Date(dto.extendedEndDate),
        status: 'PENDING',
        notes: dto.notes,
      },
    });
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
    return this.prisma.renewal.update({
      where: { id },
      data: { status: 'APPROVED', approvedAt: new Date() },
    });
  }

  async rejectRenewal(id: string) {
    return this.prisma.renewal.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  async cancelRenewal(id: string) {
    return this.prisma.renewal.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}