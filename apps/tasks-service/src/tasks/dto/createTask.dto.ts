import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PRIORITY, TASK_STATUS } from '../entities/task.entity';

export default class CreateTaskDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TASK_STATUS)
  @IsOptional()
  status?: TASK_STATUS;

  @IsEnum(PRIORITY)
  @IsOptional()
  priority?: PRIORITY;

  @IsOptional()
  @IsArray()
  assigneeIds?: string[];
}
