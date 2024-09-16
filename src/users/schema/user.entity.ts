export enum Role {
    user = 'user',
    admin = 'admin',
}

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../post/schema/post.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ length: 70 })
    password?: string;

    @Column({ nullable: true })
    profilePicture?: string;

    @Column({ type: 'enum', enum: Role, default: Role.user })
    role: Role;

    @Column()
    googleId?: string;

    @OneToMany(() => Post, post => post.author)
    posts: Post[];
}
