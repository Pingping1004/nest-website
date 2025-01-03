import { Injectable, HttpStatus, HttpException, NotFoundException, UnauthorizedException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { User } from './schema/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto, SignupUserDto, UpdatedUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from './schema/user.entity';
import { stringify } from 'querystring';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createUser(signupUserDto: SignupUserDto): Promise<User> {
        try {
            // Set tole based on username or default to 'user'
            let role: Role = Role.user; //Default role
            console.log('Role of signup user:', role);

            if (signupUserDto.username.startsWith('admin')) {
                // signupUserDto.role = 'admin';
                role = Role.admin;
            }
            // const role = signupUserDto.role || 'user';
            const hashedPassword = await bcrypt.hash(signupUserDto.password, 10);
            const newUser = this.userRepository.create({
                ...signupUserDto,
                password: hashedPassword,
                role: role,
            });
        
            const savedUser = await this.userRepository.save(newUser);
            console.log('New signup user:', savedUser);
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
        console.log('Searching for user with username:', username);
        const user = await this.userRepository.findOne({
            where: { username },
        });

        console.log('User found:', user);
        if (!user) {
            throw new NotFoundException(`User with username ${username} is not found`);
        }

        return user;
    }

    async findByUserId(userId: number): Promise<User | null> {
        console.log('Searching for user with ID:', userId);
        const user = await this.userRepository.findOne({
            where: ({ userId }),
        })

        console.log('User found:', user);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} is not found`);
        }
        return user;
    }

    async findByGoogleId(googleId: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { googleId } });
        if (!user) {
            console.log(`No user found with googleId: ${googleId}`);
        }
        return user; // Returns null if no user is found
    }    

    async getAllUsers(): Promise<User[]> {
        try {
            return this.userRepository.find();
        } catch (error) {
            console.error('Failed to get all users', error.message);
        }
    }

    async updateUser(userId: number, updatedUserDto: UpdatedUserDto): Promise<User> {
        try {
            const user = await this.findByUserId(userId);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            // console.log('Updated user detail', user);
            Object.assign(user, updatedUserDto);
            return await this.userRepository.save(user);
        } catch (error) {
            console.error('Failed to update user', error.message);
            throw new InternalServerErrorException('Failed to update user');
        }
    }

     async deleteUser(userId: number): Promise<User> {
        try {
            const user = await this.findByUserId(userId);
            console.log('Deleted user detail:', user);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            if (user.role === Role.admin) {
                throw new ForbiddenException('Cannot delete other admins');
            }

            return await this.userRepository.remove(user);
        } catch (error) {
            console.error('Failed to delete user,', error.message);
        }
     }

     async updateProfile(userId: number, updatedUserDto: UpdatedUserDto, profilePictureUrl: string): Promise<User> {
        try {
            const user = await this.findByUserId(userId);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            user.displayName = updatedUserDto.displayName || user.displayName;
            user.profilePicture = profilePictureUrl;
            await this.userRepository.save(user);
            return user;
            
        } catch (error) {
            console.error('Failed to upload profile picture');
            throw new InternalServerErrorException('Could not update profile');
        }
    }
}
