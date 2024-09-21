import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/schema/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface UserPayload {
    userId: number;
    username: string;
    role: string;
    user: User;
}

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<UserPayload | null> {
        const user = await this.userService.findByUserName(username);
        if (user && (await bcrypt.compare(password, user.password))) {
            return {
                userId: user.id,
                username: user.username,
                role: user.role,
                user,
             }
        }
        return null;
    }

    async login(user: Partial<User>) {
        console.log('User object received for login:', user);
        // Retrieve user from the database (include role in the result)
        const foundUser = await this.userRepository.findOne({
            where: { username: user.username },
            // select: ['id', 'username', 'role']
        });

        if (!foundUser) {
            throw new Error('User not found');
        }

        const payload = { username: foundUser.username, sub: foundUser.id, role: foundUser.role };
        const accessToken = this.jwtService.sign(payload);
        console.log('Generated token payload:', payload);

        return {
            accessToken,
            message: 'Login successful',
            user: foundUser,
        };
    }

    async googleLogin(req: any): Promise<any> {
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
            accessToken: this.jwtService.sign(payload),
            user,
        }
    }

    async findUserById(userId: number): Promise<User> {
        const user = await this.userService.findByUserId(userId);

        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }
}
