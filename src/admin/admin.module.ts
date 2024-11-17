import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { RecordModule } from './record/record.module';
import { RecordService } from './record/record.service';

@Module({
  imports: [
    UsersModule,
    RecordModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, UsersService, RecordService],
})
export class AdminModule {}
