import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './schema/comment.entity';
import { Repository } from 'typeorm';
import { Post } from '../schema/post.entity';
import { User } from '../../users/schema/user.entity';
import { CommentLike } from './schema/commentLike.entity';
import { CreateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,

        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(CommentLike)
        private readonly commentLikeRepository: Repository<CommentLike>,
    ) {}

    async getCommentById(postId: number, commentId: number): Promise<Comment | null> {
        try {
            console.log('Post ID in get comment by ID funciton', postId);
            console.log('Comment ID in get comment by ID funciton', commentId);

            const comment = await this.commentRepository.findOne({
                where: { post: { postId }, commentId },
                relations: ['commenter', 'post'],
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

    async createComment(createCommentDto: CreateCommentDto, userId: number, postId: number): Promise<Comment> {
        try {
            console.log('Post ID in create comment service', postId);
            const comment = this.commentRepository.create({
                ...createCommentDto,
                post: { postId },
                commenter: { userId },
                likeCount: 0,
            });

            console.log('Comment before creating in controller', comment);

            const newComment = await this.commentRepository.save(comment);
            return await this.commentRepository.findOne({
                where: { commentId: newComment.commentId },
                relations: ['commenter'],
            });
        } catch (error) {
            console.error('Failed to create comment', error.message);
        }
    }

    async getAllCommentsInPost(postId: number): Promise<Comment[]> {
        try {
            const comments = await this.commentRepository.find({
                where: { post: { postId } },
                relations: ['commenter'],
                order: { date: 'ASC' },
            });
            return comments;
        } catch (error) {
            console.error('Failed to render all comments in post', error.message);
            throw new InternalServerErrorException('Failed to retrieve comments');
        }
    }

    async deleteComment(postId: number, commentId: number): Promise<Comment> {
        try {
            console.log('commentId to delete:', commentId), ' from post ID', postId;

            const comment = await this.getCommentById(postId, commentId);
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

    async likeComment(postId: number, commentId: number, userId: number):Promise<Comment & { isLiked: boolean }> {
        const comment = await this.commentRepository.findOne({ where: { commentId } });
        if (!comment) throw new NotFoundException('Post not found');

        const user = await this.userRepository.findOne({ where: { userId } });
        if (!user) throw new NotFoundException('User not found');

        const post = await this.postRepository.findOne({ where: { postId } });
        if (!post) throw new NotFoundException('Post not found');
    
        const existingCommentLike = await this.commentLikeRepository.findOne({
          where: { commentId, userId },
        });

        console.log('Existing comment like', existingCommentLike);

        if (existingCommentLike) {
            await this.commentLikeRepository.remove(existingCommentLike);
            comment.likeCount --;
        } else {
            const newCommentLike = this.commentLikeRepository.create({ postId, commentId, userId });
            await this.commentLikeRepository.save(newCommentLike);
            comment.likeCount ++;
        }

        await this.commentRepository.save(comment);

        const isLiked = await this.checkIfUserLikedComment(postId, commentId, userId);
        const commentWithLikeState = {
            postId,
            ...comment,
            isLiked,
        }

        console.log(`Comment like state for user ${userId}: ${isLiked} from post ${postId}`);
        return commentWithLikeState;
    }

    async getCommentLikeCount(postId: number, commentId: number): Promise<number> {
        console.log('Comment ID from get comment like count serivce', postId);
        const comment = await this.getCommentById(postId, commentId);
    
        if (!comment) {
          throw new NotFoundException('Post not found');
        }
    
        console.log(`Comment ID ${commentId} like count is ${comment.likeCount}`)
        return comment.likeCount;
      }
    
      async checkIfUserLikedComment(postId: number, commentId: number, userId: number): Promise<boolean> {
        const like = await this.commentLikeRepository.findOne({
          where: { postId, commentId, userId },
        });
    
        return !!like;
      }
}
