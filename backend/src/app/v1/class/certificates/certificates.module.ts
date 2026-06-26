import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { CertificatePdfService } from './certificate-pdf.service';

@Module({
  controllers: [CertificatesController],
  providers: [CertificatesService, CertificatePdfService],
})
export class CertificatesModule {}
