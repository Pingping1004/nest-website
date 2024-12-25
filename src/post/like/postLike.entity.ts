import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../schema/post.entity";
import { User } from "../../users/schema/user.entity";

@Entity('postLike')
export class PostLike {
    @PrimaryGeneratedColumn()
    postLikeId: number;

    @ManyToOne(() => User, (user) => user.postLikes, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId'})
    userId: number;

    @ManyToOne(() => Post, (post) => post.postLikes, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'postId'})
    postId: number;
}