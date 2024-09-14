import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtConstant } from '../constant';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { User } from 'src/users/schema/user.entity';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
    userId: number;
    username: string;
    role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    return request?.cookies?.access_token;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: JwtConstant.secret,
        });
    }

    async validate(payload: any): Promise<JwtPayload> {
        console.log('JWT payload:', payload);
        const user = await this.authService.findUserById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        console.log('JWT validtion user:', user);
        // return user;
        return { userId: user.id, username: user.username, role: user.role };
    }
}