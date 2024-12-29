import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as express from 'express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.setBaseViewsDir(path.join(__dirname, 'views'));
  app.use('/node_modules', express.static(join(__dirname, '../node_modules')));
  // app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.useStaticAssets(path.join(__dirname, '..', 'public'), {
    prefix: '/public',
  });
  app.setViewEngine('ejs');
  app.enableCors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true,
  })
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}

bootstrap();