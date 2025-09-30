import { IsString } from 'class-validator';

export class RefreshTokensDTO {
  @IsString()
  userId: string;

  @IsString()
  refreshToken: string;
}
