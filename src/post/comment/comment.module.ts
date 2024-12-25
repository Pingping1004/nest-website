import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './schema/comment.entity';
import { Post } from '../schema/post.entity';
import { PostService } from '../post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Post]),
  ],
  providers: [CommentService, PostService],
  controllers: [CommentController]
})
export class CommentModule {}
