import { Controller, Post, Get, Patch, UseGuards, Body, Req, Res, Request, HttpException, HttpStatus, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { SignupUserDto, UpdatedUserDto } from './dto/user.dto';
import { User } from './schema/user.entity';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UserPayload } from '../auth/auth.service';

@Controller('user')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService,
    ) {}

    @Post('/signup')
    async signup(@Req() req, @Res({ passthrough: true }) res: Response) {
        try {
            const signupUserDto = req.body;

            if (!signupUserDto.username || !signupUserDto.password) {
                throw new HttpException('Missing username or password', HttpStatus.BAD_REQUEST);
            }
            
            const user = await this.userService.createUser(signupUserDto);
            console.log('User signup:', user);
            console.log('User signup ID:', user.userId);
            console.log('User signup role:', user.role);
            const { accessToken } = await this.authService.login({
                userId: user.userId,
                username: user.username,
                role: user.role,
            });

            res.cookie('access_token', accessToken, {
                httpOnly: true,
            });
            
            // const userId = req.user.userId;
            console.log('userId for signup:', user.userId);
            console.log('user role for signup:', user.role);
            
            const userId = user.userId;
            const role = user.role;
            res.json({ userId, role });
        } catch (error) {
            throw new HttpException('Signup failed', HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    async getProfile(@Request() req) {
        const user = req.user as User;
        console.log('Req.user:', user);
        console.log('User ID from JWT:', user.userId);
        const fetchUser = await this.userService.findByUserName(user.username);
        console.log('Fetched user:', fetchUser);
        return fetchUser;
    }

    // @UseGuards(JwtAuthGuard)
    @Patch('/uploadProfile/:userId')
    @UseInterceptors(
        FileInterceptor('profilePicture', {
            storage: diskStorage({
                destination: '.uploads/profilePicture',
                filename: (req, file, callback) => {
                    const user = req.user as UserPayload; // Use the defined payload structure
                    const ext = path.extname(file.originalname);
                    const fileName = `${Date.now()}${ext}`;
                    callback(null, fileName);
                },
            }),
            limits: { fileSize: 1024 * 1024 * 10}, // 10 MB file size limit
        }),
    )
    async uploadProfilePicture (@Req() req, @Res() res, @Body() @UploadedFile() file: Express.Multer.File) {
        try {
            const userId = req.user.userId;
            const userName = req.user.username;
            console.log(userName + 'upload profile picture');

            if (!file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const profilePictureUrl = `/upload/profilePicture/${file.filename}`;
            await this.userService.uploadProfilePicture(userId, profilePictureUrl);

             return res.status(200).json({ message: 'Profile picture uploaded successfully', profilePictureUrl});
        }
        catch (error) {
            console.error('Error uploading profile picture:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}