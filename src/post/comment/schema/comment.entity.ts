import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Post } from "../../schema/post.entity";
import { User } from "../../../users/schema/user.entity";

@Entity('Comment')

export class Comment {
    @PrimaryGeneratedColumn()
    commentId: number;

    @Column()
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @Column({ default: 0 })
    commentLikeCount: number;

    @ManyToOne(() => Post, (post) => post.comments, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'postId' })
    postId: Post;

    @ManyToOne(() => User, (user) => user.postComments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'commenterId' })
    commenter: User;
}