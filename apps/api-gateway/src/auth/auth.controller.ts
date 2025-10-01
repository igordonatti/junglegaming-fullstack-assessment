/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDTO } from './dto/createUser.dto';
import { LoginDTO } from './dto/login.dto';
import { isPublic } from './decorators/is-public.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

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

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Req() req) {
    const user = req.user;

    const userId = user.sub;
    const refreshToken = req.user.refreshToken;

    return this.authClient.send(
      { cmd: 'refresh_tokens' },
      { userId, refreshToken },
    );
  }
}
