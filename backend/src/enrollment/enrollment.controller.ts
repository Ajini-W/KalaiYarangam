import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateRenewalDto } from './dto/create-renewal.dto';

@Controller()
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  // ==========================================
  // 3.1 ENROLLMENTS SECTION
  // ==========================================
  @Post('enrollments')
  createEnrollment(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentService.createEnrollment(dto);
  }

  @Get('enrollments')
  getAllEnrollments() {
    return this.enrollmentService.findAll();
  }

  @Get('enrollments/:id')
  getEnrollmentById(@Param('id') id: string) {
    return this.enrollmentService.findOne(id);
  }

  @Post(':id/pause')
  pauseEnrollment(@Param('id') id: string) {
    return this.enrollmentService.pause(id);
  }

  @Post(':id/resume')
  resumeEnrollment(@Param('id') id: string) {
    return this.enrollmentService.resume(id);
  }

  @Post(':id/reactivate')
  reactivateEnrollment(@Param('id') id: string) {
    return this.enrollmentService.reactivate(id);
  }

  @Post(':id/cancel')
  cancelEnrollment(@Param('id') id: string) {
    return this.enrollmentService.cancel(id);
  }

  @Post(':id/transfer')
  transferEnrollment(@Param('id') id: string) {
    return this.enrollmentService.initiateTransfer(id);
  }

  // ==========================================
  // 3.2 TRANSFERS SECTION
  // ==========================================
  @Post('transfers')
createTransfer(@Body() dto: CreateTransferDto) {
  return this.enrollmentService.handleBatchTransfer(dto);
}

  @Get('transfers')
  getAllTransfers() {
    return this.enrollmentService.findAllTransfers();
  }

  @Get('transfers/:id')
  getTransferById(@Param('id') id: string) {
    return this.enrollmentService.findTransferById(id);
  }

  @Post('transfers/:id/approve')
  approveTransfer(@Param('id') id: string) {
    return this.enrollmentService.approveTransfer(id);
  }

  @Post('transfers/:id/reject')
  rejectTransfer(@Param('id') id: string) {
    return this.enrollmentService.rejectTransfer(id);
  }

  @Post('transfers/:id/cancel')
  cancelTransfer(@Param('id') id: string) {
    return this.enrollmentService.cancelTransfer(id);
  }

  // ==========================================
  // 3.3 RENEWALS SECTION
  // ==========================================
  @Post('renewals')
  createRenewal(@Body() dto: CreateRenewalDto) {
    return this.enrollmentService.handleContractRenewal(dto);
  }

  @Get('renewals')
  getAllRenewals() {
    return this.enrollmentService.findAllRenewals();
  }

  @Get('renewals/:id')
  getRenewalById(@Param('id') id: string) {
    return this.enrollmentService.findRenewalById(id);
  }

  @Post('renewals/:id/approve')
  approveRenewal(@Param('id') id: string) {
    return this.enrollmentService.approveRenewal(id);
  }

  @Post('renewals/:id/reject')
  rejectRenewal(@Param('id') id: string) {
    return this.enrollmentService.rejectRenewal(id);
  }

  @Post('renewals/:id/cancel')
  cancelRenewal(@Param('id') id: string) {
    return this.enrollmentService.cancelRenewal(id);
  }
}