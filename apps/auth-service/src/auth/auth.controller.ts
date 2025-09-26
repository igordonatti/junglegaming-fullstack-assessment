import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest } from './dto/AuthRequest.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }
}
