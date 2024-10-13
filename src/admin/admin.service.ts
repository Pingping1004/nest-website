import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { User } from '../users/schema/user.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService:  UsersService,
    @InjectRepository(User)
    private readonly  userRepository: Repository<User>
  ) {}

  async updateRole(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
