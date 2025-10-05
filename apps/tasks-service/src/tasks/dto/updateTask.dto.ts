import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PRIORITY, TASK_STATUS } from '../entities/task.entity';

export class UpdateTaskDTO {
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  assigneeIds: string[];

  @IsString()
  @IsOptional()
  status: TASK_STATUS;

  @IsString()
  @IsOptional()
  priority: PRIORITY;
}
