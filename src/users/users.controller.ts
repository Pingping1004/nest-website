import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupUserDto } from './dto/user.dto';
import { User } from './schema/user.entity';

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
}
