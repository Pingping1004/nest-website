import { Controller, Req, Res, Get, Post, Delete, Param, Body, UseGuards, InternalServerErrorException, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/comment.dto';
import { UsersService } from '../../users/users.service';
import { PostService } from '../post.service';

@Controller('comments')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        private readonly userService: UsersService,
        private readonly postService: PostService
    ) {}

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createComment(@Body() createCommentDto: CreateCommentDto, @Req() req, @Res() res) {
        try {
            const { postId } = createCommentDto;
            const userId = req.user.userId;
            console.log('User ID in create comment controller', userId);
            console.log('Post ID in create comment controller', postId);
            console.log('createCommentDto in create comment controller', createCommentDto);

            const user = await this.userService.findByUserId(userId);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            if (!postId) {
                throw new NotFoundException('postId not found');
            }

            const comment = await this.commentService.createComment(createCommentDto, userId, postId);
            console.log('Created comment in controller', comment);
            return res.status(201).json({ message: 'Comment created successfully', comment });
        } catch (error) {
            console.error('Failed to create comment in controller', error.message);
            throw new InternalServerErrorException('Failed to create post');
        }
    }

    @Get('get-comments/:postId')
    @UseGuards(JwtAuthGuard)
    async getComments(@Req() req, @Res() res, @Param('postId', ParseIntPipe) postId: number) {
        try {
            console.log('Post ID of fetch comments:', postId);

            const userId = req.user.userId;
            const user = await this.userService.findByUserId(userId);
            const post = await this.postService.getPostById(postId);
            const comments = post.comments;

            console.log('User ID in get comments controller', userId);
            console.log('Post in comment fetching', post);
            
            const isLiked = await this.postService.checkIfUserLikedPost(postId, userId);
            console.log('Post is liked in fetch comment api', isLiked);
            const enrichedPost = { ...post, isLiked };

            console.log('Post with isLiked state', enrichedPost);
            console.log('Comment of fetching comment controller', comments);

            return res.status(200).json({ post: enrichedPost, comments, user });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch comments');
        }
    }

    @Get('render/:postId/:userId')
    @UseGuards(JwtAuthGuard)
    async renderCommentPage(@Req() req, @Res() res: Response, @Param('postId', ParseIntPipe) postId: number, @Param('userId', ParseIntPipe) userId: number) {
        try {

            console.log(`User ID ${userId} and Post ID ${postId} from comment render`)

            // const userIdFromToken = req.user.userId;
            const post = await this.postService.getPostById(postId);
            const comments = await this.commentService.getAllCommentsInPost(postId);
            const fullUser = await this.userService.findByUserId(userId);
            const userIdFromToken = req.user.userId;

            if (!userId || !postId) {
                throw new NotFoundException('UserID or postId not found');
            }

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            if (userId !== userIdFromToken) {
                return res.status(403).send('Forbidden');
            }

            const postIsLiked = await this.postService.checkIfUserLikedPost(postId, userId);
            console.log('Post is liked in render comment api', postIsLiked);

            return res.render('comment', { post, comments, userId, user: fullUser, postIsLiked });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error; // Re-throw NotFoundException
            }
            throw new InternalServerErrorException('Failed to render comment page');
        }
    }

    @Delete('delete/:commentId')
    @UseGuards(JwtAuthGuard)
    async deleteComment(@Param('commentId') commentId: number, @Req() req, @Res() res) {
        try {
            const deletedComment = await this.commentService.deleteComment(commentId);
            console.log('Deleted comment in controller:', deletedComment);
            return res.status(200).json({ message: 'Delete comment successfully', deletedComment });
        } catch (error) {
            console.error('Failed to delete comment in controller', error.message);
            throw new InternalServerErrorException('Failed to delete comment');
        }
    }
}
