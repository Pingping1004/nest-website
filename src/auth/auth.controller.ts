import { Controller, Request, Post, HttpException, HttpStatus, UseGuards , Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authservice: AuthService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req, @Res({ passthrough: true }) res) {
        try {
            console.log(req.user);
            const { accessToken } = await this.authservice.login(req.user);

            //save to cookie
            res.cookie('access_token', accessToken, {
                httpOnly: true,
            })
            return { message: "Login successful" };
        } catch (error) {
            console.error('Login failed', error.message);
            throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
