import { Controller, Get, Param, Post, Render, HttpException, HttpStatus, UseGuards , Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { clearCookie } from 'cookie-parser'
import { User } from 'src/users/schema/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authservice: AuthService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Req() req, @Res({ passthrough: true }) res: Response) {
        try {
            console.log('Req user object from login', req.user);
            const { accessToken } = await this.authservice.login(req.user);

            //save to cookie
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === 'production',
            });

            const userId = req.user.userId;  // Ensure req.user contains userId
            console.log('userId from login using userId:', userId);
            console.log('Redirecting to index ID:', userId);
            // res.redirect(`/auth/index/${userId}`);
            res.json({ userId });
        } catch (error) {
            console.error('Login failed', error.message);
            throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('index/:id')
    @UseGuards(JwtAuthGuard)
    async renderAuthIndex(@Param('id') id: string, @Req() req: any, @Res() res: Response) {
        const userIdFromParam = parseInt(id, 10);

            // Check if parsing was successful
        if (isNaN(userIdFromParam)) {
            console.error('Failed to parse user ID from URL parameter:', id);
            return res.status(400).send('Invalid user ID');
        }

        console.log('User ID from url:', userIdFromParam);
        console.log('req user:', req.user);
        console.log('Req user userID with userId:', req.user.userId);

        if (userIdFromParam !== req.user.userId) {
            return res.status(403).send('Forbidden');
        }
        res.render('index', { userId: req.user.userId });
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google')
    async googleAuth(@Req() req) {
        //
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
        const { accessToken } = await this.authservice.googleLogin(req);
        //save to cookie
        res.cookie('access_token', accessToken, {
            httpOnly: true,
        });
        return {
            accessToken,
            message: 'Google authentication successful'
        }
    }

    @Get('logout')
    async logout(@Req() req, @Res() res: Response) {
        res.clearCookie('jwt token', {
            httpOnly: true,
        })
    }
}
