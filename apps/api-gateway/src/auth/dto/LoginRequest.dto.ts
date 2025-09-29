import { IsString } from 'class-validator';

export class LoginRequestDTO {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
