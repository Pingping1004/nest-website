import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './schema/comment.entity';
import { Repository } from 'typeorm';
import { Post } from '../schema/post.entity';
import { CreateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,

        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) {}

    async getCommentById(commentId: number): Promise<Comment | null> {
        try {
            const comment = this.commentRepository.findOne({
                where: { commentId },
                relations: ['commenter'],
            });

            if (!comment) {
                throw new NotFoundException('Comment not found');
            }

            console.log('Comment that get by ID:', comment);
            return comment;
        } catch (error) {
            console.error('Failed to get comment by ID', error.message);
        }
    }

    async createComment(createCommentDto: CreateCommentDto, userId: number): Promise<Comment> {
        try {
            const comment = this.commentRepository.create({
                ...createCommentDto,
                commenter: { userId },
                //commentLikeCount: 0
            });

            console.log('Create comment DTO', createCommentDto);
            const newComment = await this.commentRepository.save(comment);

            return await this.commentRepository.findOne({
                where: { commentId: newComment.commentId },
            });
        } catch (error) {
            console.error('Failed to create comment', error.message);
        }
    }

    async getAllCommentsInPost(postId: number): Promise<Comment[]> {
        try {
            const comments = await this.commentRepository.find({
                where: { postId: { postId } },
                relations: ['commenter'],
            });
            return comments;
        } catch (error) {
            console.error('Failed to render all comments in post', error.message);
            throw new InternalServerErrorException('Failed to retrieve comments');
        }
    }

    async deleteComments(commentId: number): Promise<Comment> {
        try {
            console.log('commentId to delete:', commentId);

            const comment = await this.getCommentById(commentId);
            console.log('Deleted comment detail:', comment);

            if (!comment) {
                throw new NotFoundException('Comment not found');
            }

            console.log('Commenter id of deleted comment:', comment.commenter.userId);
            return await this.commentRepository.remove(comment);
        } catch (error) {
            console.error('Failed to delete comment', error.message);
        }
    }
}
