import { Controller, Post, Get, Patch, Delete, Param, Body, Req, Res, UseGuards, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';

@Controller('blog')
export class PostController {
    constructor(
        private readonly postService: PostService,
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
        try {
            const userId = req.user.id;
            return this.postService.createPost(createPostDto, userId);
        } catch (error) {
            console.error('Failed to get post in controller', error.message);
            throw new InternalServerErrorException('Failed to create post');
        }
    }

    @Get()
    async getAllPost() {
        try {
            return this.postService.getAllPosts()
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

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updatePost(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto, @Req() req) {
        try {
            const userId = req.user.id;
            const post = await this.postService.updatePost(
                id,
                updatePostDto,
                userId,
            )
            return post;
        } catch (error) {
            console.error('Failed to update post in controller', error.message);
            throw new InternalServerErrorException('Failed to update post');
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deletePost(@Param('id') id: number, @Req() req) {
        try {
            const userId = req.user.id;
            return this.postService.deletePost(id, userId);
        } catch (error) {
            console.error('Failed to get post in controller', error.message);
            throw new InternalServerErrorException('Failed to delete post');
        }
    }
}
