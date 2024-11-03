import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Post } from '../schema/post.entity';
import { Exclude } from 'class-transformer';

@Entity('pictures')
export class Picture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 300 })
  pictureUrl: string; // The URL or path of the uploaded picture

  @Exclude()
  @ManyToOne(() => Post, (post) => post.pictures, {
    onDelete: 'CASCADE', // Automatically delete pictures when the associated post is deleted
  })
  @JoinColumn({ name: 'postId' })
  post: Post; // The post associated with this picture
}
