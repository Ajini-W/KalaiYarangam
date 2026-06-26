import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { env } from '@/config';
import * as path from 'path';
import * as os from 'os';

@Injectable()
export class CertificatePdfService {
  private readonly logger = new Logger(CertificatePdfService.name);
  private initialized = false;

  constructor() {
    this.initFirebase();
  }

  private initFirebase() {
    if (this.initialized || getApps().length) return;
    try {
      const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
      initializeApp({ credential: cert(serviceAccount) });
      this.initialized = true;
    } catch (error) {
      this.logger.warn('Firebase init skipped:', (error as Error).message);
    }
  }

  async generateAndUpload(
    certificateId: string,
    tenantId: string,
    htmlContent: string,
    cssStyles: string | null,
  ): Promise<string | null> {
    if (!this.initialized && !getApps().length) {
      this.logger.warn('Firebase not initialized, skipping PDF upload');
      return null;
    }

    try {
      const pdfBuffer = await this.generatePdf(htmlContent, cssStyles);
      const url = await this.uploadPdf(pdfBuffer, certificateId, tenantId);
      return url;
    } catch (error) {
      this.logger.error('PDF generation/upload failed:', (error as Error).message);
      return null;
    }
  }

  private async generatePdf(htmlContent: string, cssStyles: string | null): Promise<Buffer> {
    const fullHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  @page { margin: 0; }
  body { margin: 0; padding: 0; }
  ${cssStyles ?? ''}
</style>
</head><body>${htmlContent}</body></html>`;

    const chromePath = path.join(
      os.homedir(),
      '.cache',
      'puppeteer',
      'chrome',
      'win64-150.0.7871.24',
      'chrome-win64',
      'chrome.exe',
    );
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: chromePath,
      args: ['--no-sandbox'],
    });
    try {
      const page = await browser.newPage();
      await page.setContent(fullHtml, { waitUntil: 'networkidle0' as any });
      const pdf = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private async uploadPdf(
    pdfBuffer: Buffer,
    certificateId: string,
    tenantId: string,
  ): Promise<string> {
    const bucket = getStorage().bucket(env.FIREBASE_STORAGE_BUCKET);
    const filename = `certificates/${tenantId}/${certificateId}.pdf`;
    const file = bucket.file(filename);

    await file.save(pdfBuffer, {
      metadata: { contentType: 'application/pdf' },
    });

    await file.makePublic();

    return `https://storage.googleapis.com/${env.FIREBASE_STORAGE_BUCKET}/${filename}`;
  }
}
