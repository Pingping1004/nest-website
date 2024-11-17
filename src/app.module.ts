import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/schema/user.entity';
import { GoogleStrategy } from './auth/strategy/google.strategy';
import { PostModule } from './post/post.module';
import { Post } from './post/schema/post.entity';
import { AdminModule } from './admin/admin.module';
import { Picture } from '../src/post/schema/picture.entity'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RecordModule } from './admin/record/record.module';
import { Records } from './admin/record/entities/record.entity';
import { RecordSubscriber } from './admin/record/record.subscriber';

@Module({
  imports: [
    // Config .env file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    AuthModule,
    UsersModule,
    PostModule,
    RecordModule,
    // Connect to typeorm database
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Post, Picture, Records],
      synchronize: false,
      subscribers: [RecordSubscriber],
      // logging: true,
    }),
    TypeOrmModule.forFeature([User, Records]),
    AdminModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],

  controllers: [AppController],
  providers: [AppService, GoogleStrategy, RecordSubscriber],
})
export class AppModule {}