import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators';
import { Public } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto, GenerateBulkCertificateDto, QueryCertificateDto, RevokeCertificateDto } from './dto/certificate.dto';

@ApiTags('class/certificates')
@ApiBearerAuth()
@Controller('class/certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCertificateDto) {
    return this.certificatesService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryCertificateDto) {
    return this.certificatesService.findAll(user, query);
  }

  @Public()
  @Get('verify/:certificateNo')
  verify(@Param('certificateNo') certificateNo: string) {
    return this.certificatesService.verify(certificateNo);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.certificatesService.findOne(user, id);
  }

  @Get(':id/download')
  download(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.certificatesService.download(user, id);
  }

  @Post('generate-bulk')
  generateBulk(@CurrentUser() user: AuthenticatedUser, @Body() dto: GenerateBulkCertificateDto) {
    return this.certificatesService.generateBulk(user, dto);
  }

  @Post(':id/reissue')
  reissue(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.certificatesService.reissue(user, id);
  }

  @Post(':id/revoke')
  revoke(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RevokeCertificateDto,
  ) {
    return this.certificatesService.revoke(user, id, dto);
  }
}
