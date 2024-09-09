import { Controller, Request, Get, Post, HttpException, HttpStatus, UseGuards , Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { clearCookie } from 'cookie-parser'

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

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Request() req) {
        //
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Request() req, @Res({ passthrough: true }) res: Response) {
        const { accessToken } = await this.authservice.googleLogin(req);
        return {
            accessToken,
            message: 'Google authentication successful'
        }
    }

    @Get('logout')
    async logout(@Request() req, @Res() res: Response) {
        res.clearCookie('jwt token', {
            httpOnly: true,
        })
    }
}
