import { Controller, Post, Get, Patch, UseGuards, Body, Req, Res, Request, BadRequestException, HttpException, HttpStatus, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
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
import { existsSync, mkdirSync } from 'fs';

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
    @Get('/profile/data')
    async getProfile(userId: number, @Req() req, @Res() res) {
        console.log('Receiving userId in profile route:', userId);
        const user = req.user as User;
        console.log('User profile data:', user);
        const userID = req.user.userId;
        console.log('User ID from JWT:', userID);
        const fetchUser = await this.userService.findByUserName(user.username);

        if (!fetchUser) {
            return res.status(404).send('User not found');
        }

        console.log('Fetched user:', fetchUser);
        console.log('profile page is rendering');
        return res.json({ user: fetchUser, userID: user.userId });
        // return res.json({ user: { displayName: 'Test User', profilePicture: 'test.jpg' }, userID: '12345' });
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    async renderProfilePage(@Req() req, @Res() res) {
        const user = req.user as User;
        const userID = req.user.userId;
        console.log('User profile:', user);

        const fetchUser = await this.userService.findByUserName(user.username);
        console.log('Fetched user profile:', fetchUser);
        res.render('profile', { user: fetchUser, userID })
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/updateProfile/:userId')
    @UseInterceptors(
        FileInterceptor('profilePicture', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'profilePictures');
                    
                    // Create directory if it does not exist
                    if (!existsSync(uploadPath)) {
                        mkdirSync(uploadPath, { recursive: true });
                    }
                    
                    cb(null, uploadPath); // Use the correct upload path
                },
                filename: (req, file, callback) => {
                    const ext = path.extname(file.originalname);
                    const fileName = `${Date.now()}${ext}`;
                    callback(null, fileName);
                },
            }),
            limits: { fileSize: 1024 * 1024 * 10}, // 10 MB file size limit
        }),
    )
    async updateProfile (@Param('userId') userId: number, @Req() req, @Res() res, @Body() updatedUserDto: UpdatedUserDto, @UploadedFile() file: Express.Multer.File) {
        try {
            if (!file) {
                throw new BadRequestException('No file uploaded.');
            }

            // const userName = req.user.username;
            // const userProfile = req.user.profilePicture;

            const user = req.user;
            const profilePictureUrl = `uploads/profilePictures/${file.filename}`;
            const updatedUser = await this.userService.updateProfile(
                userId,
                updatedUserDto,
                profilePictureUrl,
            )

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            // console.log(userName + 'upload profile picture');
            console.log('Updated user:', updatedUser);
            console.log('User profile picture', user.profilePicture);
            return res.status(200).json({
                message: 'Profile picture uploaded successfully',
                profilePictureUrl: updatedUser.profilePicture,
            });
        }
        catch (error) {
            console.error('Error uploading profile picture:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}