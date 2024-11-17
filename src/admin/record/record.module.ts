import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RecordService } from "./record.service";
import { Records } from "./entities/record.entity";
import { UsersModule } from "../../users/users.module";
import { UsersService } from "../../users/users.service";
import { User } from "../../users/schema/user.entity";
import { Post } from "../../post/schema/post.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Post, Records]),
        UsersModule,
    ],
    // controllers: [RecordController],
    providers: [RecordService, UsersService],
    exports: [RecordService, TypeOrmModule],
})
export class RecordModule {}