import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchStudents(query: string) {
    const students = await this.prisma.student.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
    });

    return {
      data: students,
    };
  }

  async searchLeads(query: string) {
    const leads = await this.prisma.lead.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
    });

    return {
      data: leads,
    };
  }

  async searchBatches(query: string) {
    const batches = await this.prisma.batch.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
    });

    return {
      data: batches,
    };
  }

  async searchTrainers(query: string) {
    const trainers = await this.prisma.user.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
    });

    return {
      data: trainers,
    };
  }

  async globalSearch(query: string) {
    const [students, leads, batches, trainers] = await Promise.all([
      this.prisma.student.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        take: 20,
      }),
      this.prisma.lead.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        take: 20,
      }),
      this.prisma.batch.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        take: 20,
      }),
      this.prisma.user.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        take: 20,
      }),
    ]);

    return {
      data: {
        students,
        leads,
        batches,
        trainers,
      },
    };
  }
}