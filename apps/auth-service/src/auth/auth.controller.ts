import { Controller, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LoginRequestDTO } from './dto/LoginRequest.dto';
import { RefreshTokensDTO } from './dto/RefreshTokens.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth_login' })
  async login(@Payload() body: LoginRequestDTO) {
    return await this.authService
      .validateUser(body)
      .then((user) => this.authService.login(user));
  }

  @MessagePattern({ cmd: 'refresh_tokens' })
  async refreshTokens(@Payload() body: RefreshTokensDTO) {
    console.log('Refreshing tokens:', body);
    return await this.authService.refreshTokens(body.userId, body.refreshToken);
  }

  @MessagePattern({ cmd: 'auth_validate_user' })
  async validateUser(@Payload() body: LoginRequestDTO) {
    const user = await this.authService.validateUser(body);
    if (!user) {
      // É importante jogar uma exceção que o gateway entenda
      throw new RpcException(
        new UnauthorizedException('Credenciais inválidas'),
      );
    }
    return user;
  }

  @MessagePattern({ cmd: 'logout' })
  logout(@Payload() data: { userId: string }) {
    return this.authService.logout(data.userId);
  }
}
