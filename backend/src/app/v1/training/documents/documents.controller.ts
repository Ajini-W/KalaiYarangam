import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, QueryDocumentDto, UpdateDocumentDto, VerifyDocumentDto } from './dto/documents.dto';

@ApiTags('training/documents')
@ApiBearerAuth()
@Controller('training/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateDocumentDto) {
    return this.documentsService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryDocumentDto) {
    return this.documentsService.findAll(user, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.documentsService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(user, id, dto);
  }

  @Post(':id/verify')
  verify(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VerifyDocumentDto,
  ) {
    return this.documentsService.verify(user, id, dto);
  }

  @Post(':id/archive')
  archive(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.documentsService.archive(user, id);
  }

  @Post(':id/restore')
  restore(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.documentsService.restore(user, id);
  }
}
