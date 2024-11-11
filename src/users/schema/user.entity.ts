export enum Role {
    user = 'user',
    admin = 'admin',
}

import { Column, Entity, OneToMany, BeforeInsert, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../post/schema/post.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ unique: true })
    username: string;

    @Column({ length: 70, nullable: true })
    displayName?: string;
    @BeforeInsert()
    setDefaultDisplayName() {
        if (!this.displayName) {
            this.displayName = this.username; // Set displayName to username if it's not provided
        }
    }

    @Column({ length: 70, nullable: true })
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
