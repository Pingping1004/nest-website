import { Controller, Get, Body, Patch, Param, Delete, Req, Res, UseGuards, InternalServerErrorException, ParseIntPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { UpdatedUserDto } from '../users/dto/user.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UsersService } from '../users/users.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/schema/user.entity';
import { RolesGuard } from '../auth/role-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RecordService } from './record/record.service';
import { format } from 'date-fns';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly recordService: RecordService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Get('dashboard')
  async getAllUsersForAdmin(@Req() req, @Res() res: Response) {
    try {
      const users = await this.usersService.getAllUsers();
      const userId = req.user.userId;
      const role = req.user.role;

      if (!userId || role !== Role.admin) {
        return res.status(402).send('Forbidden: You do not have an access to this page');
      }

      res.render('dashboard', { userId, role, users });
      // res.json({ userId, role, users });
      // return res.status(200).json({ userId, role, users });
    } catch (error) {
      console.error('Failed to render all user for admin page:', error.message);
      res.status(500).send('Internal Server Error');
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Get('/dashboard/users') // Different endpoint for fetching JSON data
  async getAllUsersJson(@Req() req, @Res() res: Response) {
    try {
      const users = await this.usersService.getAllUsers();
      const userId = req.user.userId;
      const role = req.user.role;

    // Send user data as JSON
      return res.status(200).json({ userId, role, users });
    } catch (error) {
    console.error('Failed to fetch all users:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Patch('update/:userId')
  async updateUser(@Param('userId', ParseIntPipe) userId: number, @Body() updatedUserDto: UpdatedUserDto, @Req() req, @Res() res) {
    try {
      const updatedUser = await this.usersService.updateUser(
        userId,
        updatedUserDto,
      )

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('Updated user detail', updatedUser);
      return res.status(200).json({ message: 'User update successfully' });
    } catch (error) {
      console.error('Failed to update user in controller', error.message);
      return res.status(500).json({ message: 'Failed to update user' });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Delete('delete/:userId')
  async deleteUser(@Param('userId') userId: number, @Req() req, @Res() res) {
    try {
      const deletedUser = await this.usersService.findByUserId(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      await this.usersService.deleteUser(userId);
      return res.status(200).json({ message: 'Delete user ID ' + userId + ' successfully'});
      // return res.redirect('/admin/dashboard');
    } catch (error) {
      console.error('Failed to delete user in controller', error.message);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Get('/activity-log')
  async renderAllRecords(@Req() req, @Res() res) {
    try {
      const user = req.user;
      const userId = req.user.userId;
      const role = req.user.role;
      const records = await this.recordService.getAllRecords();

        // Create a new array with formatted dates
        const formattedRecords = records.map(record => ({
          ...record,
          formattedDate: format(record.date, 'HH:mm - dd/MM/yy'),
      }));

      console.log('Record on page:', records);
      res.render('record', { user, records: formattedRecords, userId, role })
    } catch (error) {
      console.error('Failed to render activity logs', error.message);
      res.status(500).send('Internal Server Error');
    }
  }
}
