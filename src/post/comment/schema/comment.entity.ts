import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from "typeorm";
import { Post as PostEntity } from "../../schema/post.entity";
import { User } from "../../../users/schema/user.entity";
import { CommentLike } from "./commentLike.entity";

@Entity('Comment')

export class Comment {
    @PrimaryGeneratedColumn()
    commentId: number;

    @Column()
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @Column({ default: 0, nullable: false })
    likeCount: number;

    @ManyToOne(() => PostEntity, (post) => post.comments, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'postId' })
    post: PostEntity;

    @ManyToOne(() => User, (user) => user.postComments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'commenterId' })
    commenter: User;

    @OneToMany(() => CommentLike, (commentLikes) => commentLikes.commentId, {
        onDelete: 'CASCADE',
    })
    commentLikes: CommentLike[];
}