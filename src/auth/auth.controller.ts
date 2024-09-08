import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authservice: AuthService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req) {
        try {
            console.log(req.user);
            return req.user;
        } catch (error) {
            console.error('Login failed', error.message);
        }
    }
}
