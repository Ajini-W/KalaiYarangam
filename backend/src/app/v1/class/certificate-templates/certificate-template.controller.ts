import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { CertificateTemplateService } from './certificate-template.service';
import { CreateCertificateTemplateDto, UpdateCertificateTemplateDto, QueryCertificateTemplateDto } from './dto/certificate-template.dto';

@ApiTags('class/certificate-templates')
@ApiBearerAuth()
@Controller('class/certificate-templates')
export class CertificateTemplateController {
  constructor(private readonly certificateTemplateService: CertificateTemplateService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCertificateTemplateDto) {
    return this.certificateTemplateService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryCertificateTemplateDto) {
    return this.certificateTemplateService.findAll(user, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.certificateTemplateService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCertificateTemplateDto,
  ) {
    return this.certificateTemplateService.update(user, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.certificateTemplateService.remove(user, id);
  }
}
