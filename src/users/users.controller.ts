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
        const user = req.user as User;
        console.log('Req.user:', user);
        console.log('User ID from JWT:', user.id);
        const fetchUser = await this.userService.findByUserName(user.username);
        console.log('Fetched user:', fetchUser);
        return fetchUser;
    }
}
