import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/schema/user.entity';

@Module({
  imports: [
    // Config .env file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    AuthModule,
    UsersModule,
    // Connect to typeorm database
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User],
      synchronize: true,
    })
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}