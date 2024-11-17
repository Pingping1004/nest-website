import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../../../users/schema/user.entity';

@Entity('Records')
export class Records {
    @PrimaryGeneratedColumn()
    recordId: number;

    @Column()
    action: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;
    
    @Column({ nullable: true })
    entityId: number;

    // @ManyToOne(() => User, (user) => user.records)
    // @JoinColumn({ name: 'userId' })
    // user: User; // This creates the relationship to the User entity

    // @Column()
    // userId: number; // Foreign key to User
}