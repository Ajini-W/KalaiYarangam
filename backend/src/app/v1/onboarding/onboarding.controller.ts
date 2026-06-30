import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessRequestStatus } from '@prisma/client';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import {
  ApproveAccessDto,
  BranchSetupDto,
  ModuleSelectionDto,
  ProfileSetupDto,
  RejectAccessDto,
  RequestAccessDto,
  SearchTenantDto,
  SelectRoleDto,
  SubscriptionSelectionDto,
  TenantSetupDto,
} from './dto/onboarding.dto';
import { OnboardingService } from './onboarding.service';

@ApiTags('onboarding')
@ApiBearerAuth()
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('progress')
  getProgress(@CurrentUser() user: AuthenticatedUser) {
    return this.onboardingService.getProgress(user.id);
  }

  @Post('role')
  selectRole(@CurrentUser() user: AuthenticatedUser, @Body() dto: SelectRoleDto) {
    return this.onboardingService.selectRole(user.id, dto);
  }

  @Post('profile')
  setupProfile(@CurrentUser() user: AuthenticatedUser, @Body() dto: ProfileSetupDto) {
    return this.onboardingService.setupProfile(user.id, dto);
  }

  @Post('tenant')
  setupTenant(@CurrentUser() user: AuthenticatedUser, @Body() dto: TenantSetupDto) {
    return this.onboardingService.setupTenant(user.id, dto);
  }

  @Post('branch')
  setupBranch(@CurrentUser() user: AuthenticatedUser, @Body() dto: BranchSetupDto) {
    return this.onboardingService.setupBranch(user.id, dto);
  }

  @Post('modules')
  selectModules(@CurrentUser() user: AuthenticatedUser, @Body() dto: ModuleSelectionDto) {
    return this.onboardingService.selectModules(user.id, dto);
  }

  @Post('subscription')
  selectSubscription(@CurrentUser() user: AuthenticatedUser, @Body() dto: SubscriptionSelectionDto) {
    return this.onboardingService.selectSubscription(user.id, dto);
  }

  @Post('tenants/search')
  searchTenants(@CurrentUser() user: AuthenticatedUser, @Body() dto: SearchTenantDto) {
    return this.onboardingService.searchTenants(dto);
  }

  @Post('request-access')
  requestAccess(@CurrentUser() user: AuthenticatedUser, @Body() dto: RequestAccessDto) {
    return this.onboardingService.requestAccess(user.id, dto);
  }

  @Post('complete-client')
  completeClientOnboarding(@CurrentUser() user: AuthenticatedUser) {
    return this.onboardingService.completeClientOnboarding(user.id);
  }

  @Get('access-requests')
  @ApiQuery({ name: 'status', required: false, enum: AccessRequestStatus })
  listAccessRequests(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: AccessRequestStatus,
  ) {
    return this.onboardingService.listAccessRequests(user, status);
  }

  @Post('access-requests/approve')
  approveAccessRequest(@CurrentUser() user: AuthenticatedUser, @Body() dto: ApproveAccessDto) {
    return this.onboardingService.approveAccessRequest(user, dto);
  }

  @Post('access-requests/reject')
  rejectAccessRequest(@CurrentUser() user: AuthenticatedUser, @Body() dto: RejectAccessDto) {
    return this.onboardingService.rejectAccessRequest(user, dto);
  }

  @Get('my-access-requests')
  getMyAccessRequests(@CurrentUser() user: AuthenticatedUser) {
    return this.onboardingService.getMyAccessRequests(user.id);
  }

  @Post('users/:userId/block')
  blockUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.onboardingService.blockUser(user, userId);
  }
}
