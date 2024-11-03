import { Exclude, Expose } from 'class-transformer'
import { Post } from '../schema/post.entity';

export class PictureDto {
    @Expose()
    id?: number;

    @Expose()
    pictureUrl: string;

    @Expose()
    post?: Post;
}