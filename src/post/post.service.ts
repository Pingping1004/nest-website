import { NotFoundException, Injectable, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto} from './dto/post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './schema/post.entity';
import { User } from '../users/schema/user.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) {}

    async createPost(createPostDto: CreatePostDto, id: number): Promise<Post> {
        try {
            const post = this.postRepository.create({
                ...createPostDto,
                author: { id },
            });

            console.log('Author ID of owner:', post.author);
            const newPost = await this.postRepository.save(post);
            console.log('New created post:', newPost);
            return newPost;
        } catch (error) {
            console.error('Failed to create post', error.message);
            throw new InternalServerErrorException('Failed to create post');
        }
    }

    async getAllPosts(): Promise<Post[]> {
        try {
            return await this.postRepository.find({ relations: ['author'] });
        } catch (error) {
            console.error('Failed to render all post', error.message);
        }
    }

    async getPostById(postId: number): Promise<Post | null> {
        try {
            // console.log('Searching for post from userId:', id);
            const post = await this.postRepository.findOne({ 
                where: { postId },
                relations: ['author'],
            });

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            console.log('Post that get by ID:', post);
            return post;
        } catch (error) {
            console.error('Failed to render post', error.message);
        }
    }

    async updatePost(postId: number, updatePostDto: UpdatePostDto, id: number): Promise<Post | null> {
        try {
            const post = await this.getPostById(postId);
            console.log('Updated post detail:', post);
            console.log('Update DTO:', updatePostDto);

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            console.log('Author id of updating post:', post.author?.id);
            console.log('User who update the post:', id);

            if (post.author?.id !== id) {
                throw new ForbiddenException('You do not have permission to edit this post');
            }

            Object.assign(post, updatePostDto);
            return await this.postRepository.save(post);
        } catch (error) {
            console.error('Failed to update post', error.message);
            throw new InternalServerErrorException('Failed to update post');
        }
    }

    async deletePost(postId: number, id: number): Promise<Post> {
        try {
            console.log('postId to delete:', postId);
            
            const post = await this.getPostById(postId);

            console.log('Deleted post detail:', post);

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            console.log('Author id of updating post:', post.author.id);
            console.log('User who update the post:', id);

            return await this.postRepository.remove(post);
        } catch (error) {
            console.error('Failed to delete post', error.message);
        }
    }
}
