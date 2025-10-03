import { IsArray, IsEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDTO {
  @IsEmpty()
  taskId: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  assignedTo: string[];
}
