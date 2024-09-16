import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { User } from '../../users/schema/user.entity';

@Entity('post')
@Index('IDX_AUTHOR_ID', ["authorId"])
export class Post {
    @PrimaryGeneratedColumn()
    postId: number;

    @Column()
    title: string;

    @Column()
    content?: string;

    @Column()
    pictureContent?: string;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'authorId' }) // Foreign key column in the database
    author: User; // User who created the post

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP '})
    date: Date;
}