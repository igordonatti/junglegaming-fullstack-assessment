import { Comment } from 'src/comments/entities/comments.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TASK_STATUS {
  TODO,
  IN_PROGRESS,
  REVIEW,
  DONE,
}

export enum PRIORITY {
  LOW,
  MEDIUM,
  HIGH,
  URGENT,
}

@Entity({ name: 'task' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column()
  description: string;

  @Column({ default: TASK_STATUS.TODO })
  status: TASK_STATUS;

  @Column({ default: PRIORITY.LOW })
  priority: PRIORITY;

  @Column({ type: 'uuid' })
  creatorId: string;

  @Column({ type: 'uuid', array: true, default: [] })
  assigneeIds: string[];

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  udpated_at: Date;
}
