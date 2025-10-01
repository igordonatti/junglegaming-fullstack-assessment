import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteTaskDTO {
  @IsUUID()
  @IsNotEmpty()
  taskId: string;
}
