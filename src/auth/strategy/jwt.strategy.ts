import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtConstant } from '../constant';
import { AuthService } from '../auth.service';

interface JwtPayload {
    userId: number;
    username: string;
    role: string;
    displayName: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
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

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        console.log('JWT payload:', payload);
        const user = await this.authService.findUserById(payload.userId);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        console.log('JWT validtion user:', user);
        return { userId: user.userId, username: user.username, role: user.role, displayName: user.displayName };
    }
}