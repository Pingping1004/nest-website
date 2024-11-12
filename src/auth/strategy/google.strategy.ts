import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { id, emails, photos } = profile;
        const { givenName, familyName } = profile.name || {};
        const user = {
            googleId: id,
            email: emails[0].value,
            username: `${givenName} ${familyName}`,
            profilePicture: photos[0].value,
            role: 'user',
            accessToken,
        };
        done(null, user);
    }
}