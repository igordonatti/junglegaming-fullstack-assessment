import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { LoginRequestDTO } from './dto/LoginRequest.dto';
import { RefreshTokensDTO } from './dto/RefreshTokens.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth_login' })
  async login(@Body() body: LoginRequestDTO) {
    return await this.authService
      .validateUser(body)
      .then((user) => this.authService.login(user));
  }

  @MessagePattern({ cmd: 'auth_refresh_tokens' })
  async refreshTokens(@Body() body: RefreshTokensDTO) {
    return await this.authService.refreshTokens(body.userId, body.refreshToken);
  }
}
