import { NotFoundException, Injectable, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto} from './dto/post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './schema/post.entity';
import { Picture } from '../post/schema/picture.entity';
import { User } from '../users/schema/user.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        @InjectRepository(Picture)
        private readonly picturesRepository: Repository<Picture>,
    ) {}

    async createPost(createPostDto: CreatePostDto, userId: number): Promise<Post> {
        try {
            const post = this.postRepository.create({
                ...createPostDto,
                author: { userId },
                postLikeCount: 0,
                pictures: [],
                comments: [],
            });

            if (createPostDto.pictureContent && createPostDto.pictureContent.length > 0) {
                const pictures = createPostDto.pictureContent.map((filePath) => {
                    const picture = new Picture();
                    picture.pictureUrl = filePath; // Ensure file.path is correct
                    picture.post = post; // Associate with the post
                    return picture;
                });

                // Assign the pictures to the post
                post.pictures = pictures;
            }

            console.log('Create Post DTO:', createPostDto);
            const newPost = await this.postRepository.save(post);

            return await this.postRepository.findOne({
                where: { postId: newPost.postId },
                relations: ['pictures'],
            })
        } catch (error) {
            console.error('Failed to create post', error.message);
            throw new InternalServerErrorException('Failed to create post');
        }
    }

    async getAllPosts(): Promise<Post[]> {
        try {
            return await this.postRepository.find({ relations: ['author', 'pictures'] });
        } catch (error) {
            console.error('Failed to render all posts', error.message);
            throw new InternalServerErrorException('Failed to retrieve posts');
        }
    }

    async getPostForUser(user: User): Promise<Post[]> {
        try {
            return await this.postRepository.find({
                where: [
                    { audience: 'user' }, 
                    { author: user }, // Filtering by 'admin' audience
                ],
                relations: ['author', 'pictures'],  // Including the 'author' and 'pictures' relations
            });
        } catch (error) {
            console.error('Failed to render posts for admin', error.message);
            throw new InternalServerErrorException('Failed to retrieve posts for admin');
        }
    }

    async getPostById(postId: number): Promise<Post | null> {
        try {
            // console.log('Searching for post from userId:', id);
            const post = await this.postRepository.findOne({ 
                where: { postId },
                relations: ['author', 'pictures'],
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

    async updatePost(postId: number, updatePostDto: UpdatePostDto, userId: number): Promise<Post | null> {
        try {
            const post = await this.getPostById(postId);
            console.log('Updated post detail:', post);
            console.log('Update DTO:', updatePostDto);

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            console.log('Author id of updating post:', post.author?.userId);
            console.log('User who update the post:', userId);

            if (post.author?.userId !== userId) {
                throw new ForbiddenException('You do not have permission to edit this post');
            }

            Object.assign(post, updatePostDto);
            return await this.postRepository.save(post);
        } catch (error) {
            console.error('Failed to update post', error.message);
            throw new InternalServerErrorException('Failed to update post');
        }
    }

    async deletePost(postId: number, userId: number): Promise<Post> {
        try {
            console.log('postId to delete:', postId);
            
            const post = await this.getPostById(postId);

            console.log('Deleted post detail:', post);

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            console.log('Author id of updating post:', post.author.userId);
            console.log('User who delete the post:', userId);

            return await this.postRepository.remove(post);
        } catch (error) {
            console.error('Failed to delete post', error.message);
        }
    }

    async updatePostLike(postId: number, newLikeCount: number, userId: number): Promise<Post> {
        try {
            const post = await this.getPostById(postId);
            console.log('Updated post detail:', post);

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            console.log('User who likes post', userId);
            post.postLikeCount = newLikeCount;
            return await this.postRepository.save(post);
        } catch (error) {
            console.error('Failed to update post like count', error.message);
        }
    }
}
