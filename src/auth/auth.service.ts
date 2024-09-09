import { Injectable } from '@nestjs/common';
import { SignupUserDto } from 'src/users/dto/user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/schema/user.entity';
import { JwtConstant } from './constant';
import { JwtService } from '@nestjs/jwt';
import { Jwt } from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface UserPayload {
    userId: number;
    username: string;
}

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
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
        return { accessToken, message: 'Login successful' };
    }

    async googleLogin(req): Promise<any> {
        if (!req.user) {
            throw new Error('Google login failed: No user information received');
        }

        const { username, role, profilePicture, googleId } = req.user;
        let user = await this.userService.findByUserName(username);

        if (!user) {
            user = this.userRepository.create({
                username,
                role,
                profilePicture,
                googleId,
            });

            await this.userRepository.save(user);
        }

        const payload = { username: user.username};
        return {
            accessToken: this.jwtService.sign(payload)
        }
    }
}
