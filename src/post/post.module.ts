import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './schema/post.entity';
import { UsersModule } from '../users/users.module';
import { Picture } from '../post/schema/picture.entity';
import { UsersService } from '../users/users.service';
import { MulterModule } from '@nestjs/platform-express';
import { PostLike } from './like/postLike.entity';
import { User } from '../users/schema/user.entity';
import { Comment } from './comment/schema/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Picture, PostLike, User, Comment]),
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
