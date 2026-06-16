import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from '@/app.module';
import { env } from '@/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(compression());
  app.enableCors({ origin: env.APP_URL, credentials: true });
  app.setGlobalPrefix(env.API_PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swagger = new DocumentBuilder()
    .setTitle('KalaiArangam API')
    .setDescription('Multi-tenant ERP platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swagger));

  await app.listen(env.PORT);
  console.log(`API running at http://localhost:${env.PORT}/${env.API_PREFIX}`);
  console.log(`Swagger docs at http://localhost:${env.PORT}/docs`);
}

bootstrap();
