/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UserPayload } from './dto/UserPayload.dto';
import { UserTokenDTO } from './dto/UserToken.dto';
import { LoginRequestDTO } from './dto/LoginRequest.dto';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(user: User): Promise<UserTokenDTO> {
    const atSecret = this.configService.get<string>('AT_SECRET');
    const rtSecret = this.configService.get<string>('RT_SECRET');

    if (!atSecret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }
    if (!rtSecret) {
      throw new Error('RT_SECRET is not defined in configuration');
    }

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const [access_token, refreshToken] = await Promise.all([
      // Access Token de curta duração
      this.jwtService.signAsync(payload, {
        secret: atSecret,
        expiresIn: '15m',
      }),
      // Refresh Token de longa duração
      this.jwtService.signAsync(payload, {
        secret: rtSecret,
        expiresIn: '7d',
      }),
    ]);

    await this.usersService.updateRefreshTokenHash(user.id, refreshToken);

    return { access_token, refreshToken };
  }

  async validateUser({ email, password }: LoginRequestDTO) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      console.log('Email não encontrado.');
      throw new RpcException(
        new HttpException('Email não encontrado.', HttpStatus.NOT_FOUND),
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('Senha incorreta.');
      throw new HttpException('Senha incorreta!', HttpStatus.UNAUTHORIZED);
    }

    const { ...safeUser } = user;
    return safeUser as unknown as User;
  }

  validateToken(token: string) {
    const decoded = this.jwtService.verify(token);

    if (!decoded)
      throw new HttpException('Invalid token.', HttpStatus.UNAUTHORIZED);

    return decoded;
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const tokensMatch = await bcrypt.compare(rt, user.refreshToken);
    if (!tokensMatch) throw new ForbiddenException('Access Denied');

    // Gera novos tokens e atualiza o hash no banco
    return this.login(user as User);
  }

  async logout(userId: string) {
    // Invalida o token ao setar o hash como nulo
    return this.usersService.logout(userId);
  }
}
