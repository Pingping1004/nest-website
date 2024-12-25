import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Post } from "../schema/post.entity";

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
    @JoinColumn({ name: 'postId'})
    post: Post;
}