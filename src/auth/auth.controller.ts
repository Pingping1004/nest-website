import { Controller, Get, Param, Post, Body, Render, HttpException, HttpStatus, UseGuards , Req, Res, SetMetadata } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { clearCookie } from 'cookie-parser'
import { User } from 'src/users/schema/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './role-auth.guard';
import { PostService } from '../post/post.service';
import { Role } from '../users/schema/user.entity';
import { Roles } from './roles.decorator';
import { LoginUserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly postService: PostService,
        private readonly userService: UsersService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Req() req, @Res({ passthrough: true }) res: Response) {
        try {
            console.log('Req user object from login', req.user);
            const { accessToken } = await this.authService.login(req.user);

            //save to cookie
            res.cookie('access_token', accessToken, {
                httpOnly: true,
            });

            const userId = req.user.userId;
            const role = req.user.role;

            console.log('Role from login user:', role);
            res.json({ userId, role });
        } catch (error) {
            console.error('Login failed', error.message);
            throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('index/:userId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.user, Role.admin)
    async renderAuthIndex(@Param('userId') userId: string, @Req() req: any, @Res() res: Response) {
        console.log('ID from URL param before parsing:', userId);
        const userIdFromParam = parseInt(userId, 10);

            // Check if parsing was successful
        if (isNaN(userIdFromParam)) {
            console.error('Failed to parse user ID from URL parameter:', userId);
            return res.status(400).send('Invalid user ID');
        }

        const user = req.user;
        const userIdFromToken = req.user.userId;
        const role = req.user.role;
        const fullUser = await this.userService.findByUserId(userIdFromToken);

        if (!fullUser) {
            return res.status(404).send('User not found');
        }
        const posts = await this.postService.getPostForUser(user);
        console.log('All render post for user:', posts);

        if (userIdFromParam !== userIdFromToken) {
            return res.status(403).send('Forbidden');
        }
        
        res.render('index', { userID: userIdFromToken, role, posts, user: fullUser });
    }

    @Get('admin/index/:userId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.admin)
    async renderAdminAuthIndex(@Param('userId') userId: string, @Req() req: any, @Res() res: Response) {
        const userIdFromParam = parseInt(userId, 10);

        // Check if parsing was successful
        if (isNaN(userIdFromParam)) {
            console.error('Failed to parse user ID for admin from URL parameter:', userId);
            return res.status(400).send('Invalid user ID');
        }

        if (req.user.role !== 'admin') {
            return res.status(403).send('Forbidden: Admin access only');
        }

        // const user = req.user;
        const userIdFromToken = req.user.userId;
        const role = req.user.role;
        const fullUser = await this.userService.findByUserId(userIdFromToken);
        console.log('Full user profile object in admin auth', fullUser);

        if (!fullUser) {
            return res.status(404).send('User not found');
        }
        const posts = await this.postService.getAllPosts();

        if (userIdFromParam !== req.user.userId) {
            return res.status(403).send('Forbidden');
        }
        res.render('admin', { userID: userIdFromToken, role, posts, user: fullUser });
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
        try {
            const { user, accessToken } = await this.authService.googleLogin(req);
            const userId = user.userId;
            console.log('user and userId for google login', user, userId);
            const redirectUrl = user.role === 'admin' ? `/auth/admin/index/${userId}` : `/auth/index/${userId}`;
            
            //save to cookie
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,
            }); 
            
            return res.redirect(redirectUrl);
        } catch (error) {
            console.error('Error in Google auth redirect:', error);
            return res.status(500).send('Internal server error during Google authentication');
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
