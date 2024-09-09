import { Injectable } from '@nestjs/common';
import { SignupUserDto } from 'src/users/dto/user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schema/user.entity';
import { JwtConstant } from './constant';
import { JwtService } from '@nestjs/jwt';
import { Jwt } from 'jsonwebtoken';

interface UserPayload {
    userId: number;
    username: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}
    async validateUser(username: string, password: string): Promise<UserPayload | null> {
        const user = await this.userService.findByUserName(username);
        if (user && (await bcrypt.compare(password, user.password))) {
            return { userId: user.id, username: user.username };
        }
        return null;
    }

    async login(user: any) {
        console.log('User object received for login:', user);
        const payload = { username: user.username, sub: user.userId };
        const accessToken = this.jwtService.sign(payload);
        console.log('Generated token payload:', payload);
        return { accessToken };
    } 
}
