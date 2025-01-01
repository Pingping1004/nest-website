import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../../schema/post.entity";
import { User } from "../../../users/schema/user.entity";
import { Comment } from "./comment.entity";

@Entity('commentLike')
export class CommentLike {
    @PrimaryGeneratedColumn()
    commentLikeId: number;

    @ManyToOne(() => User, (user) => user.commentLikes, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId'})
    userId: number;

    @ManyToOne(() => Post, (post) => post.commentLikes, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'postId'})
    postId: number;

    @ManyToOne(() => Comment, (comment) => comment.commentLikes, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'commentId'})
    commentId: number;
}