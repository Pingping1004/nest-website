export enum Role {
    user = 'user',
    admin = 'admin',
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    googleId: string;
}
