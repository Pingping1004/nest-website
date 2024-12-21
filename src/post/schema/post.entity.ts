import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index, OneToMany } from "typeorm";
import { User } from '../../users/schema/user.entity';
import { Picture } from '../schema/picture.entity';
import { Comment } from "../comment/comment.entity";

@Entity('post')
@Index('IDX_AUTHOR_ID', ["author"])
export class Post {
    @PrimaryGeneratedColumn()
    postId: number;

    @Column()
    title: string;

    @Column()
    content?: string;

    @OneToMany(() => Picture, (picture) => picture.post, {
        cascade: true,
        eager: true,
    })
    pictures: Picture[];

    @ManyToOne(() => User, (user) => user.posts, {
        onDelete: 'CASCADE', // Delete all related details
        eager: true,
    })

    @JoinColumn({ name: 'authorId' }) // Foreign key column in the database
    author: User; // User who created the post

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @Column({ default: 'user'})
    audience: string;

    @Column({ default: 0 })
    postLikeCount: number;

    @OneToMany(() => Comment, (comment) => comment.post, {
        onDelete: 'CASCADE',
        eager: true,
    })
    comments: Comment[];
}