import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDTO } from './dto/createUser.dto';
import { LoginDTO } from './dto/login.dto';
import { isPublic } from './decorators/is-public.decorator';

@Controller('auth')
export class AuthController {
  logger = new Logger();

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Get('health')
  @isPublic()
  getAuthHealth() {
    this.logger.log('Health check requested from api gateway');
    return this.authClient.send({ cmd: 'get_auth_health' }, {});
  }

  @Post('register')
  @isPublic()
  createUser(@Body() createUserDto: CreateUserDTO) {
    this.logger.log('Create User requested from api gateway');
    return this.authClient.send({ cmd: 'auth_create_user' }, createUserDto);
  }

  @Post('login')
  @isPublic()
  login(@Body() loginDto: LoginDTO) {
    this.logger.log('Login User requested from api gateway');
    return this.authClient.send({ cmd: 'auth_login' }, loginDto);
  }
}
