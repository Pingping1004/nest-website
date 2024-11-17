import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, InternalServerErrorException, ParseIntPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { RecordService } from './record.service';
import { UsersService } from 'src/users/users.service';
import { RecordDto } from './dto/record..dto';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/role-auth.guard';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('record')
export class RecordController {
    constructor(
        private readonly usersService: UsersService,
        private readonly recordService: RecordService,
    ) {}
}