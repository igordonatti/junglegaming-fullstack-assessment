import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: false, type: 'uuid' })
  recipientId: string;

  @CreateDateColumn()
  createdAt: Date;
}
