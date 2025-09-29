import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { isPublic } from './decorators/is-public.decorator';
import { LoginRequestDTO } from './dto/LoginRequest.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth_login' })
  @isPublic()
  async login(@Body() body: LoginRequestDTO) {
    return await this.authService
      .validateUser(body)
      .then((user) => this.authService.login(user));
  }
}
