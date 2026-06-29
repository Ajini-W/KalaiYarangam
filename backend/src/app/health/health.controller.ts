import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@/common/decorators';
import { PrismaService } from '@/database';
import { env } from '@/config';
import * as os from 'os';

const START_TIME = Date.now();

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check with system details' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @ApiResponse({ status: 503, description: 'Service is degraded or down' })
  async check() {
    const checks: Record<string, { status: string; latencyMs?: number; details?: Record<string, unknown> }> = {};
    let overallStatus = 'ok';

    // Database check
    const dbStart = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = { status: 'ok', latencyMs: Date.now() - dbStart };
    } catch {
      checks.database = { status: 'error', latencyMs: Date.now() - dbStart };
      overallStatus = 'degraded';
    }

    // Database stats
    try {
      const [userCount, tenantCount, accessRequestCount] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.tenant.count(),
        this.prisma.tenantAccessRequest.count(),
      ]);
      checks.database.details = { users: userCount, tenants: tenantCount, accessRequests: accessRequestCount };
    } catch {
      // non-critical
    }

    // Memory
    const mem = process.memoryUsage();
    checks.memory = {
      status: 'ok',
      details: {
        heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
        rssMB: Math.round(mem.rss / 1024 / 1024),
        externalMB: Math.round(mem.external / 1024 / 1024),
      },
    };

    // CPU
    const cpus = os.cpus();
    const loadAvg = os.loadavg();
    checks.cpu = {
      status: 'ok',
      details: {
        cores: cpus.length,
        model: cpus[0]?.model ?? 'unknown',
        loadAverage: { '1m': loadAvg[0], '5m': loadAvg[1], '15m': loadAvg[2] },
      },
    };

    // Uptime
    const uptimeSec = Math.floor((Date.now() - START_TIME) / 1000);
    const days = Math.floor(uptimeSec / 86400);
    const hours = Math.floor((uptimeSec % 86400) / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = uptimeSec % 60;

    return {
      status: overallStatus,
      service: 'kalai-arangam-api',
      version: '0.1.0',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: uptimeSec,
        humanReadable: `${days}d ${hours}h ${minutes}m ${seconds}s`,
      },
      checks,
    };
  }
}
