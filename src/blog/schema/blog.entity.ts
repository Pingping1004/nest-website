import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from '../../../src/users/schema/user.entity';

@Entity('blog')
export class Blog {
    @PrimaryGeneratedColumn()
    postId: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user)
    owner: User;
}