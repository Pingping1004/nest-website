import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from '../../users/schema/user.entity';

@Entity('post')
export class Post {
    @PrimaryGeneratedColumn()
    postId: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user)
    owner: User;
}