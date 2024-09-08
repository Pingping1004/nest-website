import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ length: 50 })
    password: string;

    @Column({ length: 30, default: 'user' })
    role: string;

    @Column({ nullable: true })
    profilePicture: string;
}