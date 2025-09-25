import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Get('health')
  getAuthHealth() {
    console.log('Health check requested from api gateway');
    return this.authClient.send({ cmd: 'get_auth_health' }, {});
  }
}
