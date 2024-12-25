export enum Role {
    user = 'user',
    admin = 'admin',
}

import { Column, Entity, OneToMany, BeforeInsert, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../post/schema/post.entity';
import { PostLike } from '../../post/like/postLike.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ nullable: true })
    username: string;

    @Column({ unique: true, nullable: true, default: null })
    email?: string | null;
    @BeforeInsert()
    setDefaultEmail() {
        if (!this.email) {
            this.email = `placeholder${Math.floor(Math.random() * 100000)}@example.com`;
        }
    }

    @Column({ length: 70, nullable: true })
    displayName?: string;
    @BeforeInsert()
    setDefaultDisplayName() {
        if (!this.displayName) {
            this.displayName = this.username;
        }
    }

    @Column({ length: 70, nullable: true })
    password?: string;

    @Column({ nullable: true })
    profilePicture?: string;

    @Column({ type: 'enum', enum: Role, default: Role.user })
    role: Role;

    @Column({ unique: true, nullable: true, default: null })
    googleId?: string;
    @BeforeInsert()
    setDefaultGoogleId() {
        if (!this.googleId) {
            this.googleId =  `placeholder_google_id_${Math.floor(Math.random() * 100000)}`;
        }
    }

    @OneToMany(() => Post, post => post.author)
    posts: Post[];

    @OneToMany(() => PostLike, (postLike) => postLike.userId)
    postLikes: PostLike[];
}
