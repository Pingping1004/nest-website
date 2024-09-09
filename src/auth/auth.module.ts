import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstant } from './constant';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async() => ({
        secret: JwtConstant.secret,
        signOptions: { expiresIn: "60m" },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
