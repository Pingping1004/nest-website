import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './schema/post.entity';
import { UsersModule } from '../users/users.module';
import { Picture } from '../post/schema/picture.entity';
import { UsersService } from '../users/users.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Picture]),
    UsersModule,
    // MulterModule.register({
    //   dest: './uploads/pictures',
    // }),
  ],
  controllers: [PostController],
  providers: [PostService, UsersService],
  exports: [PostService],
})
export class PostModule {}
