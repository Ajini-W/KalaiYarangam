import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRole, Prisma } from '@prisma/client';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import {
  BulkStudentImportDto,
  BulkStudentExportDto,
  BulkAttendanceDto,
  BulkTaskDto,
  BulkCertificateDto,
  QueryBulkJobDto,
} from './dto/bulk.dto';

@Injectable()
export class BulkService {
  constructor(private readonly prisma: PrismaService) {}

  private getTenantFilter(user: AuthenticatedUser) {
    return user.role === UserRole.SUPER_ADMIN ? {} : { tenantId: user.tenantId };
  }

  // ── Students Import ─────────────────────────────────────
  async importStudents(user: AuthenticatedUser, dto: BulkStudentImportDto) {
    const tenantFilter = this.getTenantFilter(user);

    const job = await this.prisma.bulkJob.create({
      data: {
        tenantId: user.tenantId!,
        type: 'STUDENT_IMPORT',
        status: 'PROCESSING',
        totalItems: dto.students.length,
      },
    });

    const created: Array<Record<string, unknown>> = [];
    const errors: Array<{ index: number; phone: string; error: string }> = [];

    for (let i = 0; i < dto.students.length; i++) {
      const s = dto.students[i];
      try {
        const existing = await this.prisma.student.findUnique({
          where: { tenantId_phone: { tenantId: user.tenantId!, phone: s.phone } },
        });
        if (existing) {
          errors.push({ index: i, phone: s.phone, error: 'Duplicate phone number' });
          continue;
        }
        const student = await this.prisma.student.create({
          data: {
            tenantId: user.tenantId!,
            name: s.name,
            phone: s.phone,
            email: s.email,
            parentName: s.parentName,
            parentPhone: s.parentPhone,
            address: s.address,
            city: s.city,
            state: s.state,
            pincode: s.pincode,
            gender: s.gender,
            medicalNotes: s.medicalNotes,
          },
        });
        created.push({ id: student.id, name: student.name, phone: student.phone });

        if (dto.batchId) {
          const batch = await this.prisma.batch.findFirst({
            where: { id: dto.batchId, ...tenantFilter },
          });
          if (batch) {
            await this.prisma.enrollment.upsert({
              where: { studentId_batchId: { studentId: student.id, batchId: dto.batchId } },
              update: {},
              create: {
                tenantId: user.tenantId!,
                studentId: student.id,
                batchId: dto.batchId,
                status: 'ACTIVE',
              },
            });
            await this.prisma.batch.update({
              where: { id: dto.batchId },
              data: { enrolled: { increment: 1 } },
            });
          }
        }
      } catch (err: any) {
        errors.push({ index: i, phone: s.phone, error: err.message ?? 'Unknown error' });
      }
    }

    const failed = errors.length;
    const succeeded = created.length;

    await this.prisma.bulkJob.update({
      where: { id: job.id },
      data: {
        status: failed > 0 && succeeded === 0 ? 'FAILED' : 'COMPLETED',
        processedItems: succeeded,
        failedItems: failed,
        completedAt: new Date(),
        result: { created, errors } as Prisma.InputJsonValue,
      },
    });

    return {
      message: `Imported ${succeeded} of ${dto.students.length} students`,
      data: { jobId: job.id, succeeded, failed, errors },
    };
  }

  // ── Students Export ──────────────────────────────────────
  async exportStudents(user: AuthenticatedUser, dto: BulkStudentExportDto) {
    const tenantFilter = this.getTenantFilter(user);

    const where: any = { ...tenantFilter };
    if (dto.batchId) {
      const enrollmentStudentIds = await this.prisma.enrollment.findMany({
        where: { batchId: dto.batchId },
        select: { studentId: true },
      });
      where.id = { in: enrollmentStudentIds.map((e) => e.studentId) };
    }

    const students = await this.prisma.student.findMany({
      where,
      include: {
        enrollments: {
          include: { batch: { select: { id: true, name: true } } },
        },
      },
      orderBy: { name: 'asc' },
    });

    const job = await this.prisma.bulkJob.create({
      data: {
        tenantId: user.tenantId!,
        type: 'STUDENT_EXPORT',
        status: 'COMPLETED',
        totalItems: students.length,
        processedItems: students.length,
        completedAt: new Date(),
        result: { count: students.length } as Prisma.InputJsonValue,
      },
    });

    return {
      message: `Exported ${students.length} students`,
      data: {
        jobId: job.id,
        students: students.map((s) => ({
          id: s.id,
          name: s.name,
          phone: s.phone,
          email: s.email,
          parentName: s.parentName,
          parentPhone: s.parentPhone,
          address: s.address,
          city: s.city,
          state: s.state,
          gender: s.gender,
          isActive: s.isActive,
          joinedAt: s.joinedAt,
          batches: s.enrollments.map((e) => ({ id: e.batch.id, name: e.batch.name })),
        })),
      },
    };
  }

  // ── Attendance ───────────────────────────────────────────
  async markAttendance(user: AuthenticatedUser, dto: BulkAttendanceDto) {
    const tenantFilter = this.getTenantFilter(user);

    const batch = await this.prisma.batch.findFirst({
      where: { id: dto.batchId, ...tenantFilter },
    });
    if (!batch) throw new NotFoundException('Batch not found');

    const job = await this.prisma.bulkJob.create({
      data: {
        tenantId: user.tenantId!,
        type: 'ATTENDANCE',
        status: 'PROCESSING',
        totalItems: dto.records.length,
      },
    });

    let attSession = dto.classSessionId
      ? await this.prisma.attendanceSession.findUnique({ where: { classSessionId: dto.classSessionId } })
      : null;

    if (!attSession) {
      attSession = await this.prisma.attendanceSession.create({
        data: {
          tenantId: user.tenantId!,
          branchId: batch.branchId,
          batchId: dto.batchId,
          classSessionId: dto.classSessionId ?? null,
          date: dto.date,
          markedBy: user.id,
        },
      });
    }

    let created = 0;
    const errors: Array<{ studentId: string; error: string }> = [];

    for (const record of dto.records) {
      try {
        await this.prisma.studentAttendance.upsert({
          where: {
            attendanceSessionId_studentId: {
              attendanceSessionId: attSession.id,
              studentId: record.studentId,
            },
          },
          update: { status: record.status, remarks: record.remarks, checkInTime: record.checkInTime },
          create: {
            attendanceSessionId: attSession.id,
            studentId: record.studentId,
            status: record.status,
            remarks: record.remarks,
            checkInTime: record.checkInTime,
          },
        });
        created++;
      } catch (err: any) {
        errors.push({ studentId: record.studentId, error: err.message ?? 'Unknown error' });
      }
    }

    await this.prisma.bulkJob.update({
      where: { id: job.id },
      data: {
        status: errors.length === dto.records.length ? 'FAILED' : 'COMPLETED',
        processedItems: created,
        failedItems: errors.length,
        completedAt: new Date(),
        result: { sessionId: attSession.id, errors } as Prisma.InputJsonValue,
      },
    });

    return {
      message: `Marked attendance for ${created} students`,
      data: { jobId: job.id, attendanceSessionId: attSession.id, succeeded: created, failed: errors.length },
    };
  }

  // ── Tasks ────────────────────────────────────────────────
  async createTasks(user: AuthenticatedUser, dto: BulkTaskDto) {
    const tenantFilter = this.getTenantFilter(user);

    const batch = await this.prisma.batch.findFirst({
      where: { id: dto.batchId, ...tenantFilter },
    });
    if (!batch) throw new NotFoundException('Batch not found');

    const job = await this.prisma.bulkJob.create({
      data: {
        tenantId: user.tenantId!,
        type: 'TASKS',
        status: 'PROCESSING',
        totalItems: dto.tasks.length,
      },
    });

    const created: Array<Record<string, unknown>> = [];
    const errors: Array<{ title: string; error: string }> = [];

    for (const task of dto.tasks) {
      try {
        const t = await this.prisma.task.create({
          data: {
            tenantId: user.tenantId!,
            batchId: dto.batchId,
            createdBy: user.id,
            title: task.title,
            description: task.description,
            type: task.type,
            dueDate: task.dueDate,
            maxScore: task.maxScore,
            allowLateSubmission: String(task.allowLateSubmission) === 'true',
          },
        });
        created.push({ id: t.id, title: t.title });
      } catch (err: any) {
        errors.push({ title: task.title, error: err.message ?? 'Unknown error' });
      }
    }

    await this.prisma.bulkJob.update({
      where: { id: job.id },
      data: {
        status: errors.length === dto.tasks.length ? 'FAILED' : 'COMPLETED',
        processedItems: created.length,
        failedItems: errors.length,
        completedAt: new Date(),
        result: { errors } as Prisma.InputJsonValue,
      },
    });

    return {
      message: `Created ${created.length} of ${dto.tasks.length} tasks`,
      data: { jobId: job.id, succeeded: created.length, failed: errors.length, tasks: created },
    };
  }

  // ── Certificates ─────────────────────────────────────────
  async generateCertificates(user: AuthenticatedUser, dto: BulkCertificateDto) {
    const tenantFilter = this.getTenantFilter(user);

    const batch = await this.prisma.batch.findFirst({
      where: { id: dto.batchId, ...tenantFilter },
    });
    if (!batch) throw new NotFoundException('Batch not found');

    const template = await this.prisma.certificateTemplate.findFirst({
      where: { id: dto.templateId, ...tenantFilter, isActive: true },
    });
    if (!template) throw new NotFoundException('Certificate template not found');

    const enrollments = await this.prisma.enrollment.findMany({
      where: { batchId: dto.batchId, ...tenantFilter, status: 'ACTIVE' },
      select: { studentId: true },
    });
    if (enrollments.length === 0) throw new BadRequestException('No active enrollments in this batch');

    let targetIds = enrollments.map((e) => e.studentId);
    if (dto.studentIds && dto.studentIds.length > 0) {
      const enrolledSet = new Set(enrollments.map((e) => e.studentId));
      targetIds = dto.studentIds.filter((id) => enrolledSet.has(id));
    }

    const students = await this.prisma.student.findMany({
      where: { id: { in: targetIds }, ...tenantFilter },
    });
    const studentMap = new Map(students.map((s) => [s.id, s]));

    const issuedDate = dto.issuedDate ?? new Date();

    const job = await this.prisma.bulkJob.create({
      data: {
        tenantId: user.tenantId!,
        type: 'CERTIFICATES',
        status: 'PROCESSING',
        totalItems: targetIds.length,
      },
    });

    const created: Array<Record<string, unknown>> = [];
    const errors: Array<{ studentId: string; error: string }> = [];

    for (const studentId of targetIds) {
      try {
        const student = studentMap.get(studentId);
        if (!student) {
          errors.push({ studentId, error: 'Student not found' });
          continue;
        }

        const certNumber = `CERT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

        const cert = await this.prisma.certificate.create({
          data: {
            tenantId: user.tenantId!,
            studentId,
            templateId: dto.templateId,
            certNumber,
            courseName: batch.name,
            issuedDate,
            data: { studentName: student.name, batchName: batch.name },
          },
        });
        created.push({ id: cert.id, certNumber: cert.certNumber, studentId });
      } catch (err: any) {
        errors.push({ studentId, error: err.message ?? 'Unknown error' });
      }
    }

    await this.prisma.bulkJob.update({
      where: { id: job.id },
      data: {
        status: errors.length === targetIds.length ? 'FAILED' : 'COMPLETED',
        processedItems: created.length,
        failedItems: errors.length,
        completedAt: new Date(),
        result: { errors } as Prisma.InputJsonValue,
      },
    });

    return {
      message: `Generated ${created.length} of ${targetIds.length} certificates`,
      data: { jobId: job.id, succeeded: created.length, failed: errors.length, certificates: created },
    };
  }

  // ── Job Tracking ─────────────────────────────────────────
  async listJobs(user: AuthenticatedUser, query: QueryBulkJobDto) {
    const tenantFilter = this.getTenantFilter(user);

    const where: any = { ...tenantFilter };
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;

    const [jobs, total] = await Promise.all([
      this.prisma.bulkJob.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page! - 1) * query.pageSize!,
        take: query.pageSize,
      }),
      this.prisma.bulkJob.count({ where }),
    ]);

    return {
      message: 'Bulk jobs retrieved successfully',
      data: {
        jobs: jobs.map((j) => ({
          id: j.id,
          type: j.type,
          status: j.status,
          totalItems: j.totalItems,
          processedItems: j.processedItems,
          failedItems: j.failedItems,
          startedAt: j.startedAt,
          completedAt: j.completedAt,
          createdAt: j.createdAt,
        })),
        total,
        page: query.page,
        pageSize: query.pageSize,
      },
    };
  }

  async getJob(user: AuthenticatedUser, jobId: string) {
    const tenantFilter = this.getTenantFilter(user);

    const job = await this.prisma.bulkJob.findFirst({
      where: { id: jobId, ...tenantFilter },
    });
    if (!job) throw new NotFoundException('Bulk job not found');

    return {
      message: 'Bulk job retrieved successfully',
      data: {
        id: job.id,
        type: job.type,
        status: job.status,
        totalItems: job.totalItems,
        processedItems: job.processedItems,
        failedItems: job.failedItems,
        result: job.result,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
        createdAt: job.createdAt,
      },
    };
  }
}
