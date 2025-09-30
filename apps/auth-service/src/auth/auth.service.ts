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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: User): UserTokenDTO {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      access_token: jwtToken,
    };
  }

  async validateUser({ email, password }: LoginRequestDTO) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new RpcException(
        new HttpException('Email não encontrado.', HttpStatus.NOT_FOUND),
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
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

  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshTokenHash(userId, hashedRefreshToken);
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
}
