import { User } from 'src/user/entities/user.entity';
import { Task } from '../entities/task.entity';

export interface ResponseTaskDTO extends Task {
  assigneeIds: User[];
}
