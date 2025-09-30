import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDTO {
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  assignedTo: string[];
}
