import { Controller, Post, Get, Patch, Delete, Param, Body, Req, Res, UseGuards, BadRequestException, UseInterceptors, NotFoundException, InternalServerErrorException, UploadedFiles, UploadedFile } from '@nestjs/common';
import { Request, Response } from 'express';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { UsersService } from '../users/users.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { User } from '../users/schema/user.entity';
import { existsSync, mkdirSync } from 'fs';
import { plainToClass, plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLike } from './like/postLike.entity';

@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly userService: UsersService,

        @InjectRepository(PostLike)
        private readonly postLikeRepository: Repository<PostLike>,
    ) {}

    @Post('create')
    @UseGuards(JwtAuthGuard)
    // @UseInterceptors(FilesInterceptor('files'))
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'pictures');
                    
                    // Create directory if it does not exist
                    if (!existsSync(uploadPath)) {
                        mkdirSync(uploadPath, { recursive: true });
                    }
                    
                    cb(null, uploadPath); // Use the correct upload path
                },
                filename: (req, file, callback) => {
                    const ext = path.extname(file.originalname);
                    const fileName = `${Date.now()}${ext}`;
                    callback(null, fileName);
                },
            }),
            limits: { fileSize: 1024 * 1024 * 10}, // 10 MB file size limit
        }),
    )
    async createPost(@Req() req, @Res() res, @Body() createPostDto: CreatePostDto, @UploadedFiles() files: Express.Multer.File[]) {
        try {
            const userId = req.user.userId;
            console.log('UserID', userId);
            const user = await this.userService.findByUserId(userId);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            // createPostDto.pictureContent = files;
            createPostDto.pictureContent = files.map(file => `/uploads/pictures/${file.filename}`);


            const post = await this.postService.createPost(createPostDto, userId);
            console.log('Created post in controller', post);
            return res.status(201).json({ message: 'Post created successfully', post });
        } catch (error) {
            console.error('Failed to create post in controller', error.message);
            throw new InternalServerErrorException('Failed to create post');
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('feed')
    async getAllPost(@Req() req, @Res() res: Response) {
        try {
            const user = req.user;
            const role = req.user.role;
            let posts;

            if (role === 'admin') {
                posts = await this.postService.getAllPosts();
            } else {
                posts = await this.postService.getPostForUser(user);
            }
            const userId = req.user.userId;
            const postsWithLikeState = await Promise.all(
                posts.map(async (post) => {
                    const isLiked = await this.postService.checkIfUserLikedPost(post.postId, userId);
                    return { ...post, isLiked };
                })
            );

            // Recalculate like counts for each post when user logs in or refreshes
            for (const post of posts) {
                // Fetch total likes from PostLike table
                const likeCount = await this.postLikeRepository.count({ where: { postId: post.postId } });
                post.likeCount = likeCount;  // Update the post's like count

                console.log('Post like count', post.likeCount);
            }

            console.log('User ID before get all post and search post owner:', userId);
            return res.status(200).json({ posts: postsWithLikeState, userId, role });
        } catch (error) {
            console.error('Failed to get post in controller', error.message);
            throw new InternalServerErrorException('Failed to retrieve posts');
        }
    }

    @Patch('update/:postId')
    @UseGuards(JwtAuthGuard)
    async updatePost(@Param('postId') postId: number, @Body() updatePostDto: UpdatePostDto, @Req() req, @Res() res) {
        try {
            console.log('User from request:', req.user);
            const userId = req.user.userId;
            console.log('User ID in update controller:', userId);
            const post = await this.postService.updatePost(
                postId,
                updatePostDto,
                userId,
            )

            if (!post) {
                return res.status(404).json({ message: 'Post not found or you do not have permission to edit' })
            }

            return res.status(200).json(post);
        } catch (error) {
            console.error('Failed to update post in controller', error.message);
            return res.status(500).json({ message: 'Failed to update post' });
        }
    }

    @Delete('delete/:postId')
    @UseGuards(JwtAuthGuard)
    async deletePost(@Param('postId') postId: number, @Req() req, @Res() res) {
        try {
            const userId = req.user?.userId;
            const post = await this.postService.getPostById(postId);
            const role = req.user.role;
            const authorId = post.author.userId;
            console.log('Author ID of the post:', authorId);

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            if (authorId !== req.user.userId && role !== 'admin') {
                return res.status(403).json({ message: 'You are not allowed to delete this post.' });
            }

            await this.postService.deletePost(postId, userId);
            return res.status(200).json({ message: 'Post deleted successfully', postId })
        } catch (error) {
            console.error('Failed to delete post in controller', error.message);
            throw new InternalServerErrorException('Failed to delete post');
        }
    }

    @Patch('update/like/:postId')
    @UseGuards(JwtAuthGuard)
    async likePost(@Body() body: { postId: number; userId: number }, @Req() req, @Res() res,) {
        try {
            const { postId, userId } = body;

            if (!userId) {
                throw new BadRequestException('User ID is required');
            }

            console.log('User who likes post in controller', userId);
            return this.postService.likePost(postId, userId);
        } catch (error) {
            console.error('Error updating post like count:', error.message);
            return res.status(500).json({ message: 'Failed to update post like count' });
        }
    }

    @Get('get/likeCount/:postId')
    async getLikeCount(@Param('postId') postId: number) {
        const post = await this.postService.getPostById(postId);
        console.log(`Post ID in controller ${postId} like count is ${post.likeCount}`)
      return this.postService.getPostLikeCount(postId);
    }
}
