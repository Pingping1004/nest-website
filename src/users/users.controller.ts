import { Controller, Post, Get, UseGuards, Body, Req, Res, Request, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { SignupUserDto } from './dto/user.dto';
import { User } from './schema/user.entity';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService,
    ) {}

    @Post('/signup')
    async signup(@Req() req, @Res({ passthrough: true }) res: Response) {
        try {
            // return await this.userService.createUser(signupUserDto);
            const user = await this.userService.createUser(req.body);
            console.log('User signup:', user);
            console.log('User signup ID:', user.id);
            const { accessToken } = await this.authService.login({
                userId: user.id,
                username: user.username,
                role: user.role,
            });

            res.cookie('access_token', accessToken, {
                httpOnly: true,
            });
            
            // const userId = req.user.userId;
            console.log('userId for signup:', user.id);
            console.log('user role for signup:', user.role);
            const userId = user.id;
            res.json({ userId });
        } catch (error) {
            throw new HttpException('Signup failed', HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    async getProfile(@Request() req) {
        const user = req.user as User;
        console.log('Req.user:', user);
        console.log('User ID from JWT:', user.id);
        const fetchUser = await this.userService.findByUserName(user.username);
        console.log('Fetched user:', fetchUser);
        return fetchUser;
    }
}