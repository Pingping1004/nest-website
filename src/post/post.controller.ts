import { Controller, Post, Get, Patch, Delete, Param, Body, Req, Res, UseGuards, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { UsersService } from '../users/users.service';

@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly userService: UsersService,
    ) {}

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
        console.log('User ID from request:', req.user);
        try {
            const userId = req.user.userId;
            console.log('userId before search the post owner:', userId);
            const user = await this.userService.findByUserId(userId);
            
            if (!user) {
                throw new NotFoundException('User not found');
            }
            
            const post = await this.postService.createPost(createPostDto, userId);
            console.log('Post to create:', post)
            console.log('Author ID from request:', post.author);
            return post;
        } catch (error) {
            console.error('Failed to get post in controller', error.message);
            throw new InternalServerErrorException('Failed to create post');
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('feed')
    async getAllPost(@Req() req, @Res() res: Response): Promise<void> {
        try {
            const posts = await this.postService.getAllPosts();
            const userId = req.user.userId;
            console.log('userId before get all post and search post owner:', userId);
            console.log('Post to render(backend controller', posts);
            // res.render('index', { posts, userId });
            res.status(200).json({ posts, userId });
        } catch (error) {
            console.error('Failed to get post in controller', error.message);
            throw new InternalServerErrorException('Failed to retrieve posts');
        }
    }

    @Get(':id')
    async getPostById(@Param('id') id: number) {
        try {
            return this.postService.getPostById(id);
        } catch (error) {
            console.error('Failed to get post in controller', error.message);
            throw new NotFoundException('Post not found');
        }
    }

    @Patch('update/:id')
    @UseGuards(JwtAuthGuard)
    async updatePost(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto, @Req() req, @Res() res) {
        try {
            const userId = req.user.id;
            const post = await this.postService.updatePost(
                id,
                updatePostDto,
                userId,
            )

            if (!post) {
                return res.status(404).json({ message: 'Post not found or you do not have permission to edit' })
            }

            return res.status(200).json(post);
        } catch (error) {
            console.error('Failed to update post in controller', error.message);
            throw new InternalServerErrorException('Failed to update post');
        }
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    async deletePost(@Param('id') id: number, @Req() req, @Res() res) {
        try {
            const userId = req.user.userId;
            const post = await this.postService.getPostById(id);
            if (post.author !== req.user.userId) {
                return res.status(403).json({ message: 'You are not allowed to delete this post.' });
            }

            await this.postService.deletePost(id, userId);
            res.redirect('/feed');
        } catch (error) {
            console.error('Failed to get post in controller', error.message);
            throw new InternalServerErrorException('Failed to delete post');
        }
    }
}
