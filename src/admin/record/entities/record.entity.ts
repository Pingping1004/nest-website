import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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
}