import { Injectable } from '@nestjs/common';
import { SignupUserDto } from 'src/users/dto/user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schema/user.entity';
import { JwtConstant } from './constant';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
    ) {}
    async validateUser(username: string, password: string): Promise<User | null> {
        const user = await this.userService.findByUserName(username);
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }
}
