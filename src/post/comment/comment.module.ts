import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './schema/comment.entity';
import { Post } from '../schema/post.entity';
import { User } from '../../users/schema/user.entity';
import { PostService } from '../post.service';
import { UsersService } from '../../users/users.service';
import { UsersModule } from '../../users/users.module';
import { PostModule } from '../post.module';
import { PostLike } from '../like/postLike.entity';
import { CommentLike } from './schema/commentLike.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Post, User, PostLike, CommentLike]),
    PostModule,
    UsersModule,
  ],
  providers: [CommentService, PostService, UsersService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
