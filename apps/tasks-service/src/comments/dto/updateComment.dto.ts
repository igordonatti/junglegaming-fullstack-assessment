import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDTO {
  @IsString()
  @IsNotEmpty()
  commentId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
