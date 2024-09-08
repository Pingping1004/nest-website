import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
