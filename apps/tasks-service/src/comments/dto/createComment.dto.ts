import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsNotEmpty()
  @IsString()
  taskId: string;
}
