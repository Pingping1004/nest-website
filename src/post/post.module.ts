import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './schema/post.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    UsersModule,
  ],
  controllers: [PostController],
  providers: [PostService, UsersService],
  exports: [PostService],
})
export class PostModule {}
