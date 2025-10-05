import {
  IsArray,
  IsEmpty,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { PRIORITY, TASK_STATUS } from './createTask.dto';

export class UpdateTaskDTO {
  @IsEmpty()
  taskId: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  assigneeIds: string[];

  @IsEnum(TASK_STATUS)
  @IsOptional()
  status: TASK_STATUS;

  @IsEnum(PRIORITY)
  @IsOptional()
  priority: PRIORITY;
}
