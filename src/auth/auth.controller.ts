import { Controller, Get, Param, Post, Render, HttpException, HttpStatus, UseGuards , Req, Res, SetMetadata } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { clearCookie } from 'cookie-parser'
import { User } from 'src/users/schema/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './role-auth.guard';
import { Role } from '../users/schema/user.entity';
import { Roles } from './roles.decorator';

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

            const userId = req.user.userId;
            const role = req.user.role;

            console.log('userId from login using userId:', userId);
            console.log('Role from login user:', role);
            res.json({ userId, role });
        } catch (error) {
            console.error('Login failed', error.message);
            throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('index/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.user, Role.admin)
    async renderAuthIndex(@Param('id') id: string, @Req() req: any, @Res() res: Response) {
        const userIdFromParam = parseInt(id, 10);

            // Check if parsing was successful
        if (isNaN(userIdFromParam)) {
            console.error('Failed to parse user ID from URL parameter:', id);
            return res.status(400).send('Invalid user ID');
        }

        const userId = req.user.userId;
        const role = req.user.role;
        console.log('User ID from url:', userIdFromParam);
        console.log('req user:', req.user);
        console.log('Req user userID with userId:', req.user.userId);

        if (userIdFromParam !== req.user.userId) {
            return res.status(403).send('Forbidden');
        }
        res.render('index', { userId, role });
    }

    @Get('admin/index/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.admin)
    async renderAdminAuthIndex(@Param('id') id: string, @Req() req: any, @Res() res: Response) {
        const userIdFromParam = parseInt(id, 10);

        // Check if parsing was successful
        if (isNaN(userIdFromParam)) {
            console.error('Failed to parse user ID from URL parameter:', id);
            return res.status(400).send('Invalid user ID');
        }

        if (req.user.role !== 'admin') {
            return res.status(403).send('Forbidden: Admin access only');
        }

        const userId = req.user.userId;
        const role = req.user.role;
        console.log('Admin user ID from url:', userIdFromParam);
        console.log('req admin user:', req.user);
        console.log('Req admin user with userId:', req.user.userId);

        if (userIdFromParam !== req.user.userId) {
            return res.status(403).send('Forbidden');
        }
        res.render('admin', { userId, role });
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

    @Get('/logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        try {
            res.clearCookie('access_token', {
                httpOnly: true,
            });

            console.log('Logout function is activated');
            return res.status(HttpStatus.OK).json({ message: 'Logout successful' });
        } catch(error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Logout failed' });
        }
    }
}
