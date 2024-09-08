import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as ejs from 'ejs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(path.join(__dirname, 'views'));
  app.setViewEngine('ejs');
  await app.listen(3000);
}
bootstrap();