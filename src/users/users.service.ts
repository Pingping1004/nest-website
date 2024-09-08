import { Injectable, HttpStatus, HttpException, NotFoundException } from '@nestjs/common';
import { User } from './schema/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto, SignupUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async createUser(signupUserDto: SignupUserDto): Promise<User> {
        try {
            if (!signupUserDto.role) {
                signupUserDto.role = 'user';
            }
            const hashedPassword = await bcrypt.hash(signupUserDto.password, 10);
            const newUser = this.userRepository.create({
                ...signupUserDto,
                password: hashedPassword,
                role: signupUserDto.role || 'user',
            });
        
            const savedUser = await this.userRepository.save(newUser);
            console.log('New saved signup user:', savedUser);
            return savedUser;
        } catch (error) {
            console.error('Error creating user:', error.message, error.stack);
            throw new HttpException('Failed to create new user', HttpStatus.BAD_REQUEST);
        }
    }

    async validateUser(username: string, password: string): Promise<User | null> {
        console.log(`Validating user: ${username}`);
        const user = await this.userRepository.findOne({
            where: ({ username }),
        });

        if (user) {
            console.log('User found:', username);
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return user;
            }
            return null;
        }
    }

    async findByUserName(username: string): Promise<User | null> {
        const user = this.userRepository.findOne({
            where: ({ username }),
        });

        if (!user) {
            throw new NotFoundException(`User with username ${username} is not found`);
        }

        return user;
    }

    async findByUserId(id: number): Promise<User | null> {
        const user = this.userRepository.findOne({
            where: ({ id }),
        })

        if (!user) {
            throw new NotFoundException(`User with ID ${id} is not found`);
        }
        return user;
    }
}
