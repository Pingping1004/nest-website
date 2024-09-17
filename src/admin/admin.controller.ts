import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UsersService } from '../users/users.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/schema/user.entity';
import { RolesGuard } from '../auth/role-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Get('dashboard')
  async getAllUsersForAdmin(@Req() req, @Res() res) {
    try {
      const users = await this.usersService.getAllUsers();
      const userId = req.user.userId;
      const role = req.user.role;
      console.log('Dashboard render userId:', userId);
      console.log('Dashboard render role:', role);
      console.log('Dashboard render users:', users);
      res.render('dashboard', { userId, role, users });
    } catch (error) {
      console.error('Failed to render all user for admin page:', error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
