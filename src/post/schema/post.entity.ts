import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index, OneToMany } from "typeorm";
import { User } from '../../users/schema/user.entity';
import { Picture } from '../schema/picture.entity';

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
}