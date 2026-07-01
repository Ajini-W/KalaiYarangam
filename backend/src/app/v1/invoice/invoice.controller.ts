import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/invoice.dto';
import { Patch } from '@nestjs/common';
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() dto: CreateInvoiceDto) {
    return this.invoiceService.create(dto);
  }

  @Get()
  findAll() {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }
  @Post(':id/send')
send(@Param('id') id: string) {
  return this.invoiceService.send(id);
}

@Post(':id/cancel')
cancel(@Param('id') id: string) {
  return this.invoiceService.cancel(id);
}

@Get(':id/download')
download(@Param('id') id: string) {
  return this.invoiceService.download(id);
}
}