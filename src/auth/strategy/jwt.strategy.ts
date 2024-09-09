import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtConstant } from '../constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
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

    async validate(payload: any) {
        console.log('JWT payload:', payload);
        return { userId: payload.sub, username: payload.username };
    }
}