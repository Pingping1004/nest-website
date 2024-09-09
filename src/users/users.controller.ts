import { Controller, Post, Get, UseGuards, Body, Request, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupUserDto } from './dto/user.dto';
import { User } from './schema/user.entity';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';

@Controller('user')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
    ) {}
    @Post('/signup')
    async signup(@Body() signupUserDto: SignupUserDto): Promise<User> {
        try {
            return await this.userService.createUser(signupUserDto);
        } catch (error) {
            throw new HttpException('Signup failed', HttpStatus.BAD_REQUEST)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    async getProfile(@Request() req) {
        // console.log(req.user);
        // const userId = req.user.userId;
        // console.log('User ID from JWT:', req.user.userId);
        const user = await this.userService.findByUserName(req.user.username);
        console.log('Fetched user:', user);
        return user;
    }
}
