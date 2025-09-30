import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum TASK_STATUS {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export enum PRIORITY {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

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
}
