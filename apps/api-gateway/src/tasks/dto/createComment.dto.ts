import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEmpty()
  taskId: string;
}
