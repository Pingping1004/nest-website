import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ length: 70 })
    password?: string;

    @Column({ length: 30, default: 'user' })
    role: string = 'user'; // Ensure default value is assigned

    @Column({ nullable: true })
    profilePicture?: string; // Mark as optional or use string | null

    @Column()
    googleId: string;
}
