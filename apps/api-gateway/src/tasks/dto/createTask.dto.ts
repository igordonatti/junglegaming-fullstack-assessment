import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
